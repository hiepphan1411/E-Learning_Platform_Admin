import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Combobox from "../courses/ComboboxCustom";
import axios from "axios"; // Import axios

export default function CertificatesTable({ courses, onCoursesUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [alphabetOption, setAlphabetOption] = useState("A-Z");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const certificateSectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const alphabetOptions = ["A-Z", "Z-A", "Mới nhất", "Cũ nhất"];

  // Kiểm tra xem chuỗi có phải là Base64 hay không
  const isBase64Image = (src) => {
    return (
      src &&
      (src.startsWith("data:image") ||
        src.startsWith("data:application/octet-stream;base64") ||
        (src.length > 100 && /^[A-Za-z0-9+/=]+$/.test(src)))
    );
  };

  //Chuyển đổi Base64 thành URL
  const getImageSrc = (image) => {
    console.log(image);
    if (!image) return "../avatarAdmin.png";

    if (isBase64Image(image)) {
      if (image.startsWith("data:")) {
        return image;
      }
      console.log(image);
      return `data:image/jpeg;base64,${image}`;
    }

    return image;
  };
  useEffect(() => {
    const coursesData = courses || [];

    let result = coursesData.filter(
      (course) =>
        course.certificate && course.certificate.status === "Chờ duyệt"
    );

    // Lọc theo tên
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (alphabetOption === "A-Z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (alphabetOption === "Z-A") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    } else if (alphabetOption === "Mới nhất") {
      result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (alphabetOption === "Cũ nhất") {
      result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredCourses(result);
  }, [searchTerm, alphabetOption, courses]);

  // Tính giá trị mỗi trang
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Đặt lại về trang đầu tiên khi bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, alphabetOption]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse({
      ...selectedCourse,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleStatusChange = (newStatus) => {
    setSelectedCourse({
      ...selectedCourse,
      statusbar: newStatus,
    });
  };

  const handleSaveChanges = () => {
    // Lưu khóa học
    const updatedCourses = filteredCourses.map((course) =>
      course.id === selectedCourse.id ? selectedCourse : course
    );
    setFilteredCourses(updatedCourses);
    handleCloseModal();
  };

  // Cuộn đến modal khi mở
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

  // Xem chi tiết chứng chỉ
  const handleViewCertificate = (course) => {
    setSelectedCertificate(course);
    setTimeout(() => {
      if (certificateSectionRef.current) {
        certificateSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Hàm hiển thị thông báo
  const showNotification = (type, message) => {
    console.log(`${type}: ${message}`);
  };

  // Hàm duyệt chứng chỉ
  const handleApproveCertificate = () => {
    if (!selectedCertificate) return;

    setIsLoading(true);

    const courseId = selectedCertificate.id;
    
    const payload = {
      certificate: {
        ...selectedCertificate.certificate,
        status: "Đã duyệt",
        approved_by: "Admin",
        approval_date: new Date().toISOString()
      }
    };

    axios
      .put(
        `http://localhost:5000/api/all-data/courses/by/id/${courseId}`,
        payload
      )
      .then((response) => {
        const updatedCourses = courses.map((course) =>
          course.id === courseId 
            ? {
                ...course,
                certificate: {
                  ...course.certificate,
                  status: "Đã duyệt",
                  approved_by: "Admin",
                  approval_date: new Date().toISOString(),
                },
              }
            : course
        );

        if (onCoursesUpdate) {
          onCoursesUpdate(updatedCourses);
        }

        setFilteredCourses((prevFiltered) =>
          prevFiltered.filter((course) => course.id !== courseId)
        );

        setSelectedCertificate(null);
        setIsLoading(false);
        showNotification("success", "Chứng chỉ đã được duyệt thành công!");
      })
      .catch((error) => {
        console.error("Error approving certificate:", error);
        console.error("Server response:", error.response?.data);

        setError("Failed to approve certificate");
        showNotification("error", "Lỗi khi duyệt chứng chỉ!");
        setIsLoading(false);
      });
  };

  // Hàm đánh dấu vi phạm
  const handleRejectCertificate = () => {
    if (!selectedCertificate) return;

    setIsLoading(true);

    const courseId = selectedCertificate.id;
    
    // Tạo payload với thông tin cập nhật cho chứng chỉ
    const payload = {
      certificate: {
        ...selectedCertificate.certificate,
        status: "Vi phạm",
        rejected_by: "Admin",
        rejection_date: new Date().toISOString()
      }
    };

    axios
      .put(
        `http://localhost:5000/api/all-data/courses/by/id/${courseId}`,
        payload
      )
      .then((response) => {
        console.log("Certificate rejected successfully:", response.data);

        const updatedCourses = courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                certificate: {
                  ...course.certificate,
                  status: "Vi phạm",
                  rejected_by: "Admin",
                  rejection_date: new Date().toISOString(),
                },
              }
            : course
        );

        if (onCoursesUpdate) {
          onCoursesUpdate(updatedCourses);
        }

        setFilteredCourses((prevFiltered) =>
          prevFiltered.filter((course) => course.id !== courseId)
        );

        setSelectedCertificate(null);
        setIsLoading(false);
        showNotification("success", "Chứng chỉ đã bị đánh dấu vi phạm!");
      })
      .catch((error) => {
        console.error("Error rejecting certificate:", error);
        console.error("Server response:", error.response?.data);

        setError("Failed to reject certificate");
        showNotification("error", "Lỗi khi đánh dấu vi phạm chứng chỉ!");
        setIsLoading(false);
      });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-100 mr-3">
            Danh sách khóa học đang chờ duyệt chứng chỉ
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Combobox
            value={alphabetOption}
            options={alphabetOptions}
            onChange={setAlphabetOption}
            width="160px"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên/loại khóa học..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      <div
        className="overflow-x-auto"
        style={{ maxHeight: "600px", minHeight: "200px" }}
      >
        {filteredCourses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-100">
                  Tên khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Loại khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ngày phát hành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trạng thái chứng chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {currentCourses.map((course) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    {course.id}
                  </td>
                  <td className="px-6S py-4 whitespace-nowrap text-sm font-medium text-gray-100 gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={getImageSrc(course.image)}
                        alt="course img"
                        className="size-10 rounded-full"
                      />
                      {course.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {course.actor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {course.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {course.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {course.certificate && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Chờ duyệt
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2">
                    {course.certificate &&
                      course.certificate.status === "Chờ duyệt" && (
                        <button
                          className="text-green-400 hover:text-green-300"
                          onClick={() => handleViewCertificate(course)}
                          title="Xem chứng chỉ"
                        >
                          <Check size={18} />
                        </button>
                      )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-blue-900 bg-opacity-20 p-4 rounded-full mb-4">
              <Check className="text-blue-400" size={40} />
            </div>
            <h3 className="text-xl font-medium text-gray-200 mb-2">Không có chứng chỉ nào cần duyệt</h3>
            <p className="text-gray-400 text-center max-w-md">
              Tất cả các chứng chỉ đã được xử lý. Bạn sẽ thấy danh sách chứng chỉ mới khi có yêu cầu.
            </p>
          </div>
        )}
      </div>

      {/* Thông tin */}
      {filteredCourses.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-gray-300">
          <div>
            Hiển thị {indexOfFirstCourse + 1}-
            {Math.min(indexOfLastCourse, filteredCourses.length)} của{" "}
            {filteredCourses.length} khóa học
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
              // Phân trang
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
      )}

      {/* Thông tin chứng chỉ */}
      {selectedCertificate && (
        <motion.div
          ref={certificateSectionRef}
          className="mt-8 border-t border-gray-700 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Thông tin chi tiết
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin chi tiết chứng chỉ */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Thông tin khóa học
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Tên khóa học:</p>
                  <p className="text-white font-medium">
                    {selectedCertificate.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Tác giả:</p>
                  <p className="text-white font-medium">
                    {selectedCertificate.actor}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Ngày phát hành:</p>
                  <p className="text-white font-medium">
                    {selectedCertificate.date}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Thời lượng học:</p>
                  <p className="text-white font-medium">18 buổi</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Lĩnh vực:</p>
                  <p className="text-white font-medium">
                    {selectedCertificate.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Mô tả:</p>
                  <p className="text-white font-medium">
                    {selectedCertificate.certificate?.description ||
                      "Không có mô tả"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Duyệt bởi admin:</p>
                  <p className="text-white font-medium">Chờ duyệt</p>
                </div>
              </div>
            </div>

            {/* Hình ảnh chứng chỉ */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Mẫu chứng chỉ:
              </h3>

              <div className="border-4 border-blue-800 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#4338ca"
                    >
                      <path d="M30,10 C10,15 5,30 5,50 C5,75 25,90 50,90 C75,90 95,75 95,50 C95,30 90,15 70,10 C60,7 40,7 30,10 Z" />
                      <path
                        d="M20,25 C35,40 65,40 80,25"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-xl">
                      ENGATECH
                    </div>
                    <div className="text-blue-800 font-bold text-sm">MEP</div>
                  </div>
                  <div className="w-12 h-12">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#4338ca"
                    >
                      <path d="M30,10 C10,15 5,30 5,50 C5,75 25,90 50,90 C75,90 95,75 95,50 C95,30 90,15 70,10 C60,7 40,7 30,10 Z" />
                      <path
                        d="M20,25 C35,40 65,40 80,25"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                <div className="text-center my-4">
                  <div className="bg-blue-800 text-white py-1 mb-1">
                    <h2 className="text-xl font-bold">CERTIFICATE</h2>
                  </div>
                  <div className="text-gray-700 mb-1 text-sm">
                    OF COMPLETION
                  </div>
                  <div className="text-red-600 font-bold text-lg mb-3">
                    CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
                  </div>

                  <div className="text-gray-700 text-sm">
                    <p>Chứng chỉ mẫu</p>
                    <h3 className="text-lg font-bold text-blue-800 my-1">
                      {selectedCertificate.certificate?.actor ||
                        selectedCertificate.actor}
                    </h3>
                    <p className="mb-2">Has completed the training program:</p>
                    <h2 className="text-red-600 font-bold text-lg mb-1">
                      {selectedCertificate.certificate?.name ||
                        selectedCertificate.name}
                    </h2>
                    <div className="text-xs text-gray-600 mt-2">
                      Issue Date: {selectedCertificate.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button chức năng */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleRejectCertificate}
              disabled={isLoading}
              className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Đang xử lý..." : "Đánh dấu vi phạm"}
            </button>
            <button
              onClick={handleApproveCertificate}
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Đang xử lý..." : "Duyệt"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-600 bg-opacity-20 border border-red-700 rounded-lg text-red-100">
              {error}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
