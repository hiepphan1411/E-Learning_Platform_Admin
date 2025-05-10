import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function LineUserGrowth({users}) {
  // Thống kê theo tháng trong năm hiện tại
  const userGrowthData = useMemo(() => {
    if (!users || users.length === 0) return [];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const monthlyData = {};

    for (let month = 1; month <= currentMonth; month++) {
      const key = `${currentYear}-${month}`;
      monthlyData[key] = {
        month: `T${month}`,
        users: 0,
        timestamp: new Date(currentYear, month - 1, 1).getTime()
      };
    }
    
    users.forEach(user => {
      if (user.createdAt != null && user.createdAt !== "N/A") {
        try {
          const date = new Date(user.createdAt);
          
          if (isNaN(date.getTime())) {
            console.error("Invalid date:", user.createdAt);
            return;
          }
          
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          
          if (year === currentYear) {
            const key = `${year}-${month}`;
            monthlyData[key].users++;
          }
        } catch (err) {
          console.error("Error processing user date:", err, user.createdAt);
        }
      }
    });
    
    return Object.values(monthlyData)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ month, users }) => ({ month, users }));
  }, [users]);


  const displayData = userGrowthData.length > 0 ? userGrowthData : [
    { month: "T1", users: 0 },
    { month: "T2", users: 0 },
    { month: "T3", users: 0 }
  ];

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Thống kê tăng trưởng người dùng</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
