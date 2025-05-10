import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const userRetentionData = [
	{ name: "Tháng 1", retention: 100 },
	{ name: "Tháng 2", retention: 75 },
	{ name: "Tháng 3", retention: 60 },
	{ name: "Tháng 4", retention: 50 },
	{ name: "Tháng 5", retention: 45 },
	{ name: "Tháng 6", retention: 40 },
	{ name: "Tháng 7", retention: 38 },
	{ name: "Tháng 8", retention: 35 },
];

export default function LineUserRetention() {
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
					<LineChart data={userRetentionData}>
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