import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/commons/StatCard";
import CoursesTable from "../components/courses/CoursesTable";
import LineTrendSales from "../components/courses/LineTrendSales";
import PieCategoryCourse from "../components/courses/PieCategoryCourse";
import { useState } from "react";


const CoursesPage = () => {
  // Replace API fetch with mock data
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      actor: "John Smith",
      image: "../course-images/javascript.jpg",
      name: "JavaScript Fundamentals",
      category: "Programming - Web Development",
      categoryObject: {
        name: "Web Development",
        field: "Programming",
      },
      price: 299000,
      date: "2023-09-15",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-JS-001",
        template: "template1",
        requiresCompletion: true
      },
      video_courses: [
        { id: 1, title: "Introduction to JS" },
        { id: 2, title: "Variables and Data Types" },
      ],
      outstanding: true,
    },
    {
      id: 2,
      actor: "Maria Rodriguez",
      image: "../course-images/python.png",
      name: "Python for Beginners",
      category: "Programming - Data Science",
      categoryObject: {
        name: "Data Science",
        field: "Programming",
      },
      price: 399000,
      date: "2023-08-20",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-PY-002",
        template: "template2",
        requiresCompletion: true
      },
      video_courses: [
        { id: 5, title: "Python Basics" },
        { id: 6, title: "Control Structures" },
      ],
      outstanding: false,
    },
    {
      id: 3,
      actor: "David Johnson",
      image: "../course-images/react.png",
      name: "React Masterclass",
      category: "Programming - Frontend",
      categoryObject: {
        name: "Frontend",
        field: "Programming",
      },
      price: 499000,
      date: "2023-10-05",
      statusbar: "Chờ duyệt",
      certificate: null,
      video_courses: [
        { id: 9, title: "React Fundamentals" },
        { id: 10, title: "Hooks and State Management" },
      ],
      outstanding: true,
    },
    {
      id: 4,
      actor: "Sarah Lee",
      image: "../course-images/marketing.jpg",
      name: "Digital Marketing Essentials",
      category: "Business - Marketing",
      categoryObject: {
        name: "Marketing",
        field: "Business",
      },
      price: 349000,
      date: "2023-09-25",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-MKT-003",
        template: "template1",
        requiresCompletion: true
      },
      video_courses: [
        { id: 13, title: "SEO Basics" },
        { id: 14, title: "Social Media Strategy" },
      ],
      outstanding: false,
    },
    {
      id: 5,
      actor: "Michael Wong",
      image: "../avatarAdmin.png",
      name: "UX Design Principles",
      category: "Design - User Experience",
      categoryObject: {
        name: "User Experience",
        field: "Design",
      },
      price: 449000,
      date: "2023-10-10",
      statusbar: "Vi phạm",
      certificate: null,
      video_courses: [
        { id: 17, title: "Design Thinking" },
        { id: 18, title: "Wireframing" },
      ],
      outstanding: false,
    },
    {
      id: 6,
      actor: "Emma Garcia",
      image: "../course-images/data-science.jpg",
      name: "Data Analysis with R",
      category: "Programming - Data Science",
      categoryObject: {
        name: "Data Science",
        field: "Programming",
      },
      price: 529000,
      date: "2023-09-18",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-R-004",
        template: "template2",
        requiresCompletion: true
      },
      video_courses: [
        { id: 21, title: "Introduction to R" },
        { id: 22, title: "Data Visualization" },
      ],
      outstanding: true,
    },
    {
      id: 7,
      actor: "Alex Chen",
      image: "../course-images/mobile-dev.jpg",
      name: "Flutter Mobile App Development",
      category: "Programming - Mobile",
      categoryObject: {
        name: "Mobile",
        field: "Programming",
      },
      price: 459000,
      date: "2023-10-02",
      statusbar: "Vi phạm",
      certificate: null,
      video_courses: [
        { id: 25, title: "Dart Fundamentals" },
        { id: 26, title: "Flutter Widgets" },
      ],
      outstanding: false,
    }
  ]);

  // Tính thống kê
  const totalCourses = courses.length;
  const outstandingCourses = courses.filter(course => course.outstanding).length;
  const violatedCourses = courses.filter(course => course.statusbar === "Vi phạm").length;
  const totalPrice = courses.reduce((sum, course) => sum + (course.price || 0), 0);
  
  // Format tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Tổng số khóa học"
              icon={Package}
              value={totalCourses}
              color="#6366F1"
            />
            <StatCard
              name="Số khóa học nổi bật"
              icon={TrendingUp}
              value={outstandingCourses}
              color="#10B981"
            />
            <StatCard
              name="Số khóa học vi phạm"
              icon={AlertTriangle}
              value={violatedCourses}
              color="#F59E0B"
            />
            <StatCard
              name="Tổng chi phí"
              icon={DollarSign}
              value={formatPrice(totalPrice)}
              color="#EF4444"
            />
          </motion.div>

          <CoursesTable courses={courses} />

          {/* CHARTS */}
          <div className="grid grid-col-1 lg:grid-cols-2 gap-8 z-10">
            <LineTrendSales />
            <PieCategoryCourse courses={courses}/>
          </div>
        </>
      )}
      </main>
    </div>
  );
};

export default CoursesPage;
