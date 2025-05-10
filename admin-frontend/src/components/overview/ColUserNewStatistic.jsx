import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useMemo } from "react";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const ColUserNewStatistic = ({users}) => {
    const monthlyUserData = useMemo(() => {
        if (!users || users.length === 0) {
            return [];
        }
        
        const monthCounts = {};
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", 
                        "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", 
                        "Tháng 11", "Tháng 12"];
        
        months.forEach(month => {
            monthCounts[month] = 0;
        });
        
        users.forEach(user => {
            const createdAt = new Date(user.createdAt);
            const monthIndex = createdAt.getMonth(); 
            const monthName = months[monthIndex];
            monthCounts[monthName]++;
        });
      
        return Object.keys(monthCounts)
            .filter(month => monthCounts[month] > 0)
            .map(month => ({
                name: month,
                value: monthCounts[month]
            }));
    }, [users]);
    
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Thống kê người dùng mới
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={monthlyUserData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => [`${value} người dùng`, "Số lượng"]}
            />
            <Legend />
            <Bar dataKey="value" name="Số người dùng mới" fill="#8884d8">
              {monthlyUserData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ColUserNewStatistic;
