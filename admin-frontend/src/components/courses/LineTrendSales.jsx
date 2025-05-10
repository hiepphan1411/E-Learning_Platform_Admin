import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LineTrendSales = () => {
  const [salesData, setSalesData] = useState([]);
  const currentYear = new Date().getFullYear(); 
  
  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch("http://localhost:5000/api/all-data/user_courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        processSalesData(data);
      })
      .catch((error) => {
        console.error("Error fetching user courses:", error);
      });
  }, []);
  
  const processSalesData = (courses) => {
    const salesByMonth = courses.reduce((acc, course) => {
      const purchaseDate = new Date(course.date_of_purchase);
      const year = purchaseDate.getFullYear();
      
      if (year === currentYear) {
        const monthIndex = purchaseDate.getMonth(); 
        const month = purchaseDate.toLocaleString('default', { month: 'short' });
        
        if (!acc[monthIndex]) {
          acc[monthIndex] = { month, sales: 0 };
        }
        acc[monthIndex].sales += course.price;
      }
      return acc;
    }, {});
    
    const chartData = Object.keys(salesByMonth)
      .map(monthIndex => salesByMonth[monthIndex])
      .sort((a, b) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });
    
    setSalesData(chartData);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 z-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Xu hướng doanh thu {currentYear}
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `${value.toLocaleString()} VND`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="Doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LineTrendSales;
