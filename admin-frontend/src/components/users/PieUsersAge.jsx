import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export default function PieUsersAge({users}) {
  const [demographicsData, setDemographicsData] = useState([
    { name: "18-24", value: 0 },
    { name: "25-34", value: 0 },
    { name: "35-44", value: 0 },
    { name: "45-54", value: 0 },
    { name: "55+", value: 0 },
  ]);

  useEffect(() => {
    if (!users || users.length === 0) return;

    const calculateAge = (birthDate) => {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    };

    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    users.forEach(user => {
      if (!user.birthDate) return;
      
      const age = calculateAge(user.birthDate);
      
      if (age >= 18 && age <= 24) {
        ageGroups["18-24"]++;
      } else if (age >= 25 && age <= 34) {
        ageGroups["25-34"]++;
      } else if (age >= 35 && age <= 44) {
        ageGroups["35-44"]++;
      } else if (age >= 45 && age <= 54) {
        ageGroups["45-54"]++;
      } else if (age >= 55) {
        ageGroups["55+"]++;
      }
    });

    const newData = Object.entries(ageGroups)
      .filter(([name, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value
      }));

    setDemographicsData(newData);
  }, [users]);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Thống kê độ tuổi người dùng</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={demographicsData}
              cx='50%'
              cy='50%'
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {demographicsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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