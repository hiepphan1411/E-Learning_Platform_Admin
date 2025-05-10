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
  
  // Mock data thay thế cho fetch API
  useEffect(() => {
    // Dữ liệu giả mô phỏng doanh thu theo tháng
    const mockUserCourses = [
      { month: "Jan", sales: 12500000 },
      { month: "Feb", sales: 15800000 },
      { month: "Mar", sales: 18700000 },
      { month: "Apr", sales: 17200000 },
      { month: "May", sales: 20500000 },
      { month: "Jun", sales: 22000000 },
      { month: "Jul", sales: 21300000 },
      { month: "Aug", sales: 25600000 },
      { month: "Sep", sales: 27800000 },
      { month: "Oct", sales: 29000000 },
      { month: "Nov", sales: 31200000 },
      { month: "Dec", sales: 35000000 }
    ];
    
    setSalesData(mockUserCourses);
  }, []);

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
