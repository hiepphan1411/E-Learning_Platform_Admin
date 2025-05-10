import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899"];

const PieUserStatistic = ({users}) => {
    const countUsersByRole = () => {
        if (!users || users.length === 0) {
            return [
                { name: "Học viên", value: 0 },
                { name: "Giảng viên", value: 0 },
                { name: "Quản trị viên", value: 0 }
            ];
        }

        const counts = {
            "STUDENT": 0,
            "TEACHER": 0,
            "ADMIN": 0
        };

        users.forEach(user => {
            if (user.typeUser === "Học viên") counts.STUDENT++;
            else if (user.typeUser === "Giáo viên") counts.TEACHER++;
            else if (user.typeUser === "Quản trị viên") counts.ADMIN++;
        });

        return [
            { name: "Học viên", value: counts.STUDENT },
            { name: "Giảng viên", value: counts.TEACHER },
            { name: "Quản trị viên", value: counts.ADMIN }
        ];
    };

    const userData = countUsersByRole();

    return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Thống kê người dùng</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={userData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{userData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} người dùng`, null]}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}

export default PieUserStatistic;