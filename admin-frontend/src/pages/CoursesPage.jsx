import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/commons/StatCard";
import CoursesTable from "../components/courses/CoursesTable";
import LineTrendSales from "../components/courses/LineTrendSales";
import PieCategoryCourse from "../components/courses/PieCategoryCourse";
import { useEffect, useState } from "react";


const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
    // Fetch dữ liệu từ API
    useEffect(() => {
      fetch("http://localhost:5000/api/all-data/courses")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("fetch() got:", data);
          const formattedData = data.map((course) => ({
            id: course.id || course._id,
            actor: course.actor || "Unknown",
            image: course.image || course.cover_image || "../avatarAdmin.png",
            name: course.name || "Untitled Course",
            category: course.category
              ? typeof course.category === "object"
                ? `${course.category.field} - ${course.category.name}`
                : course.category
              : "Uncategorized",
            categoryObject: course.category || {
              name: "Uncategorized",
              field: "Other",
            },
            price: course.price || 0,
            date: course.date
              ? new Date(course.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            statusbar: course.statusbar || "Chờ duyệt",
            certificate: course.certificate || null,
            video_courses: course.video_courses || [],
            outstanding: course.outstanding || false,
  
            _original: course,
          }));
          setCourses(formattedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("fetch() error:", err);
          setLoading(false);
        });
    }, []);

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
