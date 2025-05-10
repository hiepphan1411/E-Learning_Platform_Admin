import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Edit,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function UsersTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [accountTypeFilter, setAccountTypeFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  // Thêm phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const statusOptions = ["Hoạt động", "Vô hiệu hóa"];
  const accountTypes = ["Tất cả", "Quản trị viên", "Giáo viên", "Học viên"];
  const statusFilterOptions = ["Tất cả", "Hoạt động", "Vô hiệu hóa"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const applyFilters = useCallback(() => {
    if (!users) return [];
    
    return users.filter(
      (user) =>
        (user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) &&
        (accountTypeFilter === "Tất cả" || user.typeUser === accountTypeFilter) &&
        (statusFilter === "Tất cả" || user.status === statusFilter)
    );
  }, [users, debouncedSearchTerm, accountTypeFilter, statusFilter]);

  useEffect(() => {
    setFilteredUsers(applyFilters());
    setCurrentPage(1);
  }, [debouncedSearchTerm, accountTypeFilter, statusFilter, users, applyFilters]);

  // Kiểm tra xem chuỗi có phải là Base64 hay không
  const isBase64Image = useCallback((src) => {
    return (
      src &&
      (src.startsWith("data:image") ||
        src.startsWith("data:application/octet-stream;base64") ||
        (src.length > 100 && /^[A-Za-z0-9+/=]+$/.test(src)))
    );
  }, []);

  //Chuyển đổi Base64 thành URL
  const getImageSrc = useCallback((image) => {
    if (!image) return "../avatarAdmin.png";

    if (isBase64Image(image)) {
      if (image.startsWith("data:")) {
        return image;
      }
      return `data:image/jpeg;base64,${image}`;
    }

    return image;
  }, [isBase64Image]);

  // Phân trang
  const { currentUsers, indexOfFirstUser, indexOfLastUser, totalPages } = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    
    return { currentUsers, indexOfFirstUser, indexOfLastUser, totalPages };
  }, [filteredUsers, currentPage]);

  // Điều khiển phân trang
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);
  const nextPage = useCallback(() => 
    setCurrentPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);
  const prevPage = useCallback(() => 
    setCurrentPage((prev) => Math.max(prev - 1, 1)), []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }, []);

  const handleAccountTypeFilterChange = useCallback((e) => {
    setAccountTypeFilter(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleOpenModal = useCallback((user) => {
    setErrorMessage("");
    setSelectedUser({ ...user });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setErrorMessage("");
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleStatusChange = useCallback((newStatus) => {
    setSelectedUser((prev) => ({
      ...prev,
      status: newStatus,
    }));
  }, []);

  // Chỉnh sửa người dùng
  const handleSaveChanges = useCallback(async () => {
    if (!selectedUser) return;

    const previousStatus = users.find(u => u.id === selectedUser.id)?.status;

    // Tạo payload
    const payload = {
      name: selectedUser.name,
      email: selectedUser.email,
      pass: selectedUser.pass,
      typeUser: selectedUser.typeUser,
      status: selectedUser.status,
    };

    if (
      selectedUser.avatar &&
      selectedUser.avatar !==
        users.find((u) => u.id === selectedUser.id)?.avatar
    ) {
      payload.avatar = selectedUser.avatar;
    }

    const userId = selectedUser.id;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/all-data/users/by/id/${userId}`,
        payload
      );

      if (response.data && response.data.document) {
        const updatedData = response.data.document;
        
        const originalUser = users.find(u => u.id === userId);
        const mergedData = {
          ...updatedData,
          avatar: updatedData.avatar || originalUser.avatar
        };
        
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === userId ? mergedData : user)
        );
        
        setFilteredUsers(prevFiltered => {
          if (previousStatus !== updatedData.status && 
              statusFilter !== "Tất cả" && 
              statusFilter !== updatedData.status) {
            return prevFiltered.filter(user => user.id !== userId);
          } else {
            return prevFiltered.map(user => 
              user.id === userId ? updatedData : user
            );
          }
        });

        handleCloseModal();
      } else {
        setErrorMessage(
          response.data.error || "Không thể cập nhật người dùng"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage(
        error.response?.data?.error || "Đã xảy ra lỗi khi cập nhật người dùng"
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, users, statusFilter, handleCloseModal]);

  const handleOpenDeleteModal = useCallback((user) => {
    setErrorMessage("");
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setErrorMessage("");
  }, []);

  const handleDeleteUser = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/all-data/users/by/id/${userToDelete.id}`
      );

      if (response.data && response.data.message) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        setFilteredUsers(prevFiltered => prevFiltered.filter(user => user.id !== userToDelete.id));
        handleCloseDeleteModal();
      } else {
        setErrorMessage(response.data.error || "Không thể xóa người dùng");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage(
        error.response?.data?.error || "Đã xảy ra lỗi khi xóa người dùng"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userToDelete, handleCloseDeleteModal]);

  const handleToggleUserStatus = useCallback(async (user) => {
    setIsLoading(true);
    
    try {
      const newStatus = user.status === "Hoạt động" ? "Vô hiệu hóa" : "Hoạt động";
      
      const updatedUserData = { ...user, status: newStatus };
      
      const response = await axios.put(
        `http://localhost:5000/api/all-data/users/by/id/${user.id}`,
        updatedUserData
      );
      
      if (response.data && response.data.document) {
        const updatedUser = response.data.document;
        
        setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
        
        setFilteredUsers(prevUsers => {
          if (statusFilter !== "Tất cả" && statusFilter !== newStatus) {
            return prevUsers.filter(u => u.id !== user.id);
          }
          return prevUsers.map(u => u.id === user.id ? updatedUser : u);
        });
      } else {
        console.error("Failed to update user status:", response.data);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Cuộn tới modal khi mở
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }

    if (isDeleteModalOpen && deleteModalRef.current) {
      setTimeout(() => {
        deleteModalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isModalOpen, isDeleteModalOpen]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Danh sách người dùng
        </h2>
        <div className="flex items-center">
          <span className="text-gray-300 mr-2">Loại tài khoản</span>
          <select
            value={accountTypeFilter}
            onChange={handleAccountTypeFilterChange}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accountTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <span className="text-gray-300 mr-2">Trạng thái</span>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusFilterOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập tên/email..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div
        className="overflow-x-auto"
        style={{ maxHeight: "600px", minHeight: "450px" }}
      >
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={getImageSrc(user.avatar)}
                      alt="user img"
                      className="size-10 rounded-full"
                    />
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user.typeUser}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    onClick={() => handleToggleUserStatus(user)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "Hoạt động"
                        ? "bg-green-800 text-green-100 hover:bg-green-700"
                        : "bg-red-800 text-red-100 hover:bg-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleOpenModal(user)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleOpenDeleteModal(user)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thanh điều khiển phân trang */}
      <div className="flex justify-between items-center mt-6 text-gray-300">
        <div>
          Hiển thị {indexOfFirstUser + 1}-
          {Math.min(indexOfLastUser, filteredUsers.length)} của{" "}
          {filteredUsers.length} người dùng
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
            // Logic phân trang
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            if (pageNumber > 0 && pageNumber <= totalPages) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <motion.div
            ref={modalRef}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Chỉnh sửa người dùng
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>
            {errorMessage && (
              <div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-md mb-4">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  name="id"
                  value={selectedUser.id}
                  disabled
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    value={selectedUser.pass}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="typeUser"
                  value={selectedUser.typeUser}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Quản trị viên">Quản trị viên</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Học viên">Học viên</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Trạng thái
                </label>
                <div className="flex gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.status === status
                          ? status === "Hoạt động"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveChanges}
                className={`px-4 py-2 rounded-lg ${
                  isLoading ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-500"
                } text-white transition flex items-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xóa */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            ref={deleteModalRef}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
          >
            <div className="flex justify-center mb-4 text-yellow-500">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-semibold text-white text-center mb-2">
              Xác nhận xóa
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Bạn có chắc chắn muốn xóa "{userToDelete.name}"?
            </p>
            {errorMessage && (
              <div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-md mb-4">
                {errorMessage}
              </div>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteUser}
                className={`px-4 py-2 rounded-lg ${
                  isLoading ? "bg-red-800" : "bg-red-600 hover:bg-red-500"
                } text-white transition flex items-center justify-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
