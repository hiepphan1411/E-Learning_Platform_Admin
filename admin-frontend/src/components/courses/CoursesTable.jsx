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
  Film,
  Award,
  Info,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Combobox from "./ComboboxCustom";
import axios from "axios";
import Notification from "../common/Notification";

// Add custom scrollbar styling
const scrollbarStyle = `
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.8);
    border-radius: 10px;
    transition: all 0.2s ease;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(96, 165, 250, 0.8);
  }
  
  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(75, 85, 99, 0.8) rgba(31, 41, 55, 0.5);
  }
`;

const CoursesTable = ({courses = [], onCoursesUpdate}) => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = scrollbarStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortOption, setSortOption] = useState("Chờ duyệt");
  const [alphabetOption, setAlphabetOption] = useState("A-Z");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [activeTab, setActiveTab] = useState("info");
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const sortOptions = ["Chờ duyệt", "Đã duyệt", "Vi phạm", "Tất cả"];
  const alphabetOptions = ["A-Z", "Z-A", "Mới nhất", "Cũ nhất"];
  const statusOptions = ["Chờ duyệt", "Đã duyệt", "Vi phạm"];

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
    if (courses && courses.length > 0) {
      let initialFiltered = [...courses];
      
      if (sortOption !== "Tất cả") {
        initialFiltered = initialFiltered.filter((course) => course.statusbar === sortOption);
      }
      
      if (alphabetOption === "A-Z") {
        initialFiltered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (alphabetOption === "Z-A") {
        initialFiltered.sort((a, b) => b.name.localeCompare(a.name));
      } else if (alphabetOption === "Mới nhất") {
        initialFiltered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (alphabetOption === "Cũ nhất") {
        initialFiltered.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      
      setFilteredCourses(initialFiltered);
    }
  }, [courses]); 

  useEffect(() => {
    let result = [...courses];

    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.actor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (sortOption !== "Tất cả") {
      result = result.filter((course) => course.statusbar === sortOption);
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
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, sortOption, alphabetOption, courses]);

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
  }, [searchTerm, sortOption, alphabetOption]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSelectedCourse({
        ...selectedCourse,
        [parent]: {
          ...selectedCourse[parent],
          [child]: value,
        },
      });
    } else {
      setSelectedCourse({
        ...selectedCourse,
        [name]: name === "price" ? parseFloat(value) : value,
      });
    }
  };

  const handleStatusChange = (newStatus) => {
    setSelectedCourse({
      ...selectedCourse,
      statusbar: newStatus,
    });
  };

  const handleSaveChanges = () => {
    if (!selectedCourse) return;
    const previousStatus = courses.find(c => c.id === selectedCourse.id)?.statusbar;

    // Tạo payload
    const payload = {
      name: selectedCourse.name,
      actor: selectedCourse.actor,
      category: selectedCourse.categoryObject,
      price: parseFloat(selectedCourse.price),
      statusbar: selectedCourse.statusbar,
      ...(selectedCourse.date && {
        date: new Date(selectedCourse.date).toISOString(),
      }),
    };

    if (
      selectedCourse.image &&
      selectedCourse.image !==
        courses.find((c) => c.id === selectedCourse.id)?.image
    ) {
      payload.image = selectedCourse.image;
    }

    const courseId = selectedCourse.id;
    setIsLoading(true);
    axios
      .put(
        `http://localhost:5000/api/all-data/courses/by/id/${courseId}`,
        payload
      )
      .then((response) => {
        console.log("Course updated successfully:", response.data);

        const updatedData = mapApiResponseToCourse(response.data);
        const updatedCourses = courses.map(course => 
          course.id === courseId ? updatedData : course
        );

        if (onCoursesUpdate) {
          onCoursesUpdate(updatedCourses);
        }

        setFilteredCourses(prevFiltered => {
          if (previousStatus !== updatedData.statusbar && 
              sortOption !== "Tất cả" && 
              sortOption !== updatedData.statusbar) {
            return prevFiltered.filter(course => course.id !== courseId);
          } else {
            return prevFiltered.map(course => 
              course.id === courseId ? updatedData : course
            );
          }
        });
        
        handleCloseModal();
        showNotification("success", "Cập nhật khóa học thành công!");
      })
      .catch((error) => {
        console.error("Error updating course:", error);
        console.error("Server response:", error.response?.data);

        setError("Failed to update course. Changes applied locally only.");
        showNotification("error", "Lỗi khi cập nhật khóa học!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const mapApiResponseToCourse = (apiResponse) => {
    const courseData = apiResponse.document || apiResponse;
    
    return {
      id: courseData.id || courseData._id,
      actor: courseData.actor || "Unknown",
      image: courseData.image || courseData.cover_image || "",
      name: courseData.name || "Untitled Course",
      category: courseData.category
        ? typeof courseData.category === "object"
          ? `${courseData.category.field} - ${courseData.category.name}`
          : courseData.category
        : "Uncategorized",
      categoryObject: courseData.category || {
        name: "Uncategorized",
        field: "Other",
      },
      price: courseData.price || 0,
      date: courseData.date
        ? new Date(courseData.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      statusbar: courseData.statusbar || "Chờ duyệt",
      certificate: courseData.certificate || null,
      video_courses: courseData.video_courses || [],
      _original: apiResponse,
    };
  };

  const handleApprove = (courseId) => {
    const courseToUpdate = courses.find((course) => course.id === courseId);
    if (!courseToUpdate) return;

    const payload = {
      statusbar: "Đã duyệt",
    };
    setIsLoading(true);

    axios
      .put(
        `http://localhost:5000/api/all-data/courses/by/id/${courseId}`,
        payload
      )
      .then((response) => {
        console.log("Course approved:", response.data);
        const updatedCourses = courses.map(course => 
          course.id === courseId ? {...course, statusbar: "Đã duyệt"} : course
        );
        
        if (onCoursesUpdate) {
          onCoursesUpdate(updatedCourses);
        }
        
        setFilteredCourses(prevFiltered => {
          if (sortOption === "Đã duyệt" || sortOption === "Tất cả") {
            return prevFiltered.map(course => 
              course.id === courseId ? {...course, statusbar: "Đã duyệt"} : course
            );
          } else {
            return prevFiltered.filter(course => course.id !== courseId);
          }
        });
        
        setIsLoading(false);
        showNotification("success", "Khóa học đã được duyệt thành công!");
      })
      .catch((error) => {
        console.error("Error approving course:", error);
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        showNotification("error", "Lỗi khi duyệt khóa học!");
        setIsLoading(false);
      });
  };

  const handleOpenDeleteModal = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  //Xóa khóa học
  const handleDeleteCourse = () => {
    if (!courseToDelete) return;

    const courseId = courseToDelete.id;

    setIsLoading(true);
    axios
      .delete(`http://localhost:5000/api/all-data/courses/by/id/${courseId}`)
      .then((response) => {
        const updatedCourses = courses.filter(course => course.id !== courseId);

        if (onCoursesUpdate) {
          onCoursesUpdate(updatedCourses);
        }
        
        setFilteredCourses(prevFiltered => 
          prevFiltered.filter(course => course.id !== courseId)
        );
        
        setIsLoading(false);
        showNotification("success", "Xóa khóa học thành công!");
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        showNotification("error", "Lỗi khi xóa khóa học!");
        setIsLoading(false);
      })
      .finally(() => {
        handleCloseDeleteModal();
      });
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      return date.toISOString().split("T")[0];
    } catch (e) {
      return dateString;
    }
  };

  // Change active tab
  const changeTab = (tab) => {
    setActiveTab(tab);
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
  //Hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
    
    setTimeout(() => {
      closeNotification();
    }, 3000);
  };
  //Đóng thông báo
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{ minHeight: "80vh" }}
    >
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
        duration={3000} 
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-100 mr-3">
            Danh sách khóa học
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Combobox
            value={sortOption}
            options={sortOptions}
            onChange={setSortOption}
            width="160px"
          />
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

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 text-red-400">
          <p>Lỗi tải dữ liệu: {error}</p>
          <p className="mt-2">Đang hiển thị dữ liệu mẫu</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 sticky top-0 z-1">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-60">
                    Tên khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-40">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">
                    Loại khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-28">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                    Ngày phát hành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-28">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-28">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {currentCourses.map((course, index) => (
                  <motion.tr
                    key={`course-${course.id || index}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                      <span className="truncate">{course.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="truncate max-w-60" title={course.name}>
                        {course.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-100">
                      <div className="truncate max-w-40" title={course.actor}>
                        {course.actor}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div
                        className="truncate max-w-48"
                        title={course.category}
                      >
                        {course.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {course.price.toFixed(2)} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(course.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {course.statusbar === "Chờ duyệt" ? (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {course.statusbar}
                        </span>
                      ) : course.statusbar === "Đã duyệt" ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {course.statusbar}
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {course.statusbar}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleOpenModal(course)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleOpenDeleteModal(course)}
                      >
                        <Trash2 size={18} />
                      </button>
                      {course.statusbar !== "Đã duyệt" && course.statusbar != "Vi phạm" && (
                        <button
                          className="text-green-400 hover:text-green-300 ml-2"
                          onClick={() => handleApprove(course.id)}
                          title="Duyệt khóa học"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700 text-gray-300">
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

              {Array.from({ length: Math.min(totalPages, 5) }).map(
                (_, index) => {
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
                }
              )}

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
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            ref={modalRef}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Chỉnh sửa khóa học
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                onClick={() => changeTab("info")}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === "info"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Info size={18} />
                Thông tin cơ bản
              </button>
              <button
                onClick={() => changeTab("videos")}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === "videos"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Film size={18} />
                Video bài giảng{" "}
                {selectedCourse.video_courses?.length > 0 &&
                  `(${selectedCourse.video_courses.length})`}
              </button>
              <button
                onClick={() => changeTab("certificate")}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === "certificate"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Award size={18} />
                Chứng chỉ
              </button>
            </div>

            {/* Content container with fixed height */}
            <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
              {/* Basic Information Tab */}
              {activeTab === "info" && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={selectedCourse.id}
                      disabled
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 cursor-not-allowed opacity-70"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tên khóa học
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={selectedCourse.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tác giả
                    </label>
                    <input
                      type="text"
                      name="actor"
                      value={selectedCourse.actor}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Giá
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={selectedCourse.price}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Lĩnh vực
                    </label>
                    <input
                      type="text"
                      name="categoryObject.field"
                      value={selectedCourse.categoryObject?.field || ""}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Loại khóa học
                    </label>
                    <input
                      type="text"
                      name="categoryObject.name"
                      value={selectedCourse.categoryObject?.name || ""}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ngày phát hành
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formatDate(selectedCourse.date)}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Hình ảnh
                    </label>
                    <div className="flex items-center gap-2">
                      <img
                        src={getImageSrc(selectedCourse.image)}
                        alt="Author preview"
                        className="size-12 rounded-full object-cover"
                      />
                      <span className="text-gray-300 text-sm">
                        {isBase64Image(selectedCourse.image)
                          ? "Ảnh bìa"
                          : "Hình ảnh URL"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Trạng thái
                    </label>
                    <div className="flex gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            selectedCourse.statusbar === status
                              ? status === "Chờ duyệt"
                                ? "bg-yellow-500 text-white"
                                : status === "Đã duyệt"
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
              )}

              {/* Videos Tab */}
              {activeTab === "videos" && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-3">
                    Danh sách video bài giảng
                  </h3>
                  {selectedCourse.video_courses &&
                  selectedCourse.video_courses.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full divide-y divide-gray-600">
                        <thead className="bg-gray-800 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                              STT
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                              Link video
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                              Ngày tạo
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {selectedCourse.video_courses.map((video, index) => (
                            <tr key={index} className="hover:bg-gray-800">
                              <td className="px-4 py-2 text-sm text-gray-300">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2 text-sm text-blue-400">
                                <a
                                  href={video.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {video.link.substring(0, 40)}...
                                </a>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-300">
                                {formatDate(video.createAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <Film size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Khóa học này chưa có video bài giảng</p>
                    </div>
                  )}
                </div>
              )}

              {/* Certificate Tab */}
              {activeTab === "certificate" && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-3">
                    Thông tin chứng chỉ
                  </h3>
                  {selectedCourse.certificate ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-gray-300 text-sm mb-2 font-medium">
                          Mẫu chứng chỉ
                        </h4>
                        {selectedCourse.certificate ? (
                          <div className="flex justify-center">
                            <img
                              src={getImageSrc(
                                selectedCourse.certificate.dataImage
                              )}
                              alt="Certificate"
                              className="max-h-60 rounded-lg object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            <FileText
                              size={32}
                              className="mx-auto mb-2 opacity-50"
                            />
                            <p>Không có hình ảnh mẫu chứng chỉ</p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-gray-300 text-sm mb-1 font-medium">
                            Tên chứng chỉ
                          </h4>
                          <p className="bg-gray-800 p-2 rounded text-white">
                            {selectedCourse.certificate.name ||
                              "Chưa có thông tin"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-300 text-sm mb-1 font-medium">
                            Loại chứng chỉ
                          </h4>
                          <p className="bg-gray-800 p-2 rounded text-white">
                            {selectedCourse.certificate.type ||
                              "Chưa có thông tin"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-300 text-sm mb-1 font-medium">
                          Mô tả
                        </h4>
                        <p className="bg-gray-800 p-2 rounded text-white">
                          {selectedCourse.certificate.description ||
                            "Chưa có mô tả"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <Award size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Khóa học này chưa có chứng chỉ</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xóa khóa học */}
      {isDeleteModalOpen && courseToDelete && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
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
              Bạn có chắc chắn muốn xóa khóa học "{courseToDelete.name}" không?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
              >
                Xóa khóa học
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CoursesTable;
