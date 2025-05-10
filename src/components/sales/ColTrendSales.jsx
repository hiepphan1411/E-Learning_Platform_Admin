import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const getCurrentWeekData = (salesData) => {
  if (!salesData || !salesData.length) return [];
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  const daysToShow = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  

  const result = [];
  for (let i = 1; i <= daysToShow; i++) {
    const day = i % 7; 
    const dayIndex = day === 0 ? 6 : day - 1; 
    
    const dayData = salesData.find(item => item.day === day) || { sales: 0 };
    
    result.push({
      name: dayNames[day],
      sales: dayData.sales || 0
    });
  }
  
  return result;
};

export default function ColTrendSales({dataSales}) {
  const currentWeekData = getCurrentWeekData(dataSales);
  
  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Xu hướng doanh thu tuần này</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={currentWeekData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey='sales' fill='#10B981' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}