import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function LineUserRetention({ logs }) {
	const retentionData = useMemo(() => {
		if (!logs || logs.length === 0) return [];
		
		const logsByMonth = logs.reduce((acc, log) => {
			const date = new Date(log.timestamp);
			const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
			
			if (!acc[monthYear]) {
				acc[monthYear] = new Set();
			}
			acc[monthYear].add(log.user_id);
			
			return acc;
		}, {});
		
		const months = Object.keys(logsByMonth).sort((a, b) => {
			const [monthA, yearA] = a.split('/').map(Number);
			const [monthB, yearB] = b.split('/').map(Number);
			if (yearA !== yearB) return yearA - yearB;
			return monthA - monthB;
		});
		
		if (months.length === 0) return [];

		const baselineUsers = logsByMonth[months[0]].size;
		
		return months.map((month, index) => {
			const [monthNum, year] = month.split('/');
			const retentionPercentage = Math.round((logsByMonth[month].size / baselineUsers) * 100);
			const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
				"Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
			const monthIndex = parseInt(monthNum) - 1;
			const monthName = monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : "Tháng ?";
			
			return {
				name: `${monthName}/${year}`,
				retention: retentionPercentage
			};
		});
	}, [logs]);

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Thống kê tỷ lệ giữ chân người dùng</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={retentionData}>
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
						<Legend />
						<Line type='monotone' dataKey='retention' stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}