import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

export default function PieChannelPerformance({users}) {
  const processChannelData = () => {
    if (!users || !Array.isArray(users) || users.length === 0) {
      return [
        { name: "Facebook", value: 0 },
        { name: "Email", value: 0 },
        { name: "Sự kiện tổ chức", value: 0 },
        { name: "Đa phương tiện", value: 0 },
        { name: "Youtube", value: 0 },
        { name: "Google", value: 0 },
      ];
    }

    const channelCounts = {};
    users.forEach(user => {
      if (user.account && user.account.To) {
        const channel = user.account.To;
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      }
    });


    return Object.keys(channelCounts).map(channel => ({
      name: channel,
      value: channelCounts[channel]
    }));
  };

  const channelData = processChannelData();

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Hiệu suất kênh giới thiệu
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {channelData.map((entry, index) => (
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
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
