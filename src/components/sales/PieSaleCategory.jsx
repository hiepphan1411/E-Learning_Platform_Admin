import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export default function PieSaleCategory({ dataSales }) {
  const [courses, setCourses] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/all-data/courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
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
      })
      .catch((err) => {
        console.error("fetch() error:", err);
      });
  }, []);
  
  useEffect(() => {
    if (courses.length > 0 && dataSales && dataSales.length > 0) {
      // Kết bảng
      const courseMap = new Map();
      courses.forEach(course => {
        courseMap.set(course.id, course);
      });
      
      const categorySales = {};
      
      dataSales.forEach(sale => {
        const course = courseMap.get(sale.course_id);
        if (course) {

          let categoryName;
          if (course.categoryObject && course.categoryObject.field) {
            categoryName = course.categoryObject.field;
          } else if (typeof course.category === 'string') {
            categoryName = course.category.split(' - ')[0] || course.category;
          } else {
            categoryName = "Khác";
          }
          
          const saleAmount = parseFloat(sale.amount) || course.price || 0;
          
          if (categorySales[categoryName]) {
            categorySales[categoryName] += saleAmount;
          } else {
            categorySales[categoryName] = saleAmount;
          }
        }
      });
      
      const salesData = Object.entries(categorySales).map(([name, value]) => ({
        name,
        value: Math.round(value), 
      }));
      
      setSalesByCategory(salesData.length > 0 ? salesData : [
        { name: "No Sales Data", value: 1 }
      ]);
    } else if (dataSales && dataSales.length === 0) {
      setSalesByCategory([{ name: "No Sales", value: 1 }]);
    }
  }, [courses, dataSales]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Doanh thu theo lĩnh vực
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={salesByCategory}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {salesByCategory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `$${value}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
