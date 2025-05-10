import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TrData = [
	{ month: "T1", Tr: 4000, S: 3800 },
	{ month: "T2", Tr: 3000, S: 3200 },
	{ month: "T3", Tr: 5000, S: 4500 },
	{ month: "T4", Tr: 4500, S: 4200 },
	{ month: "T5", Tr: 6000, S: 5500 },
	{ month: "T6", Tr: 5500, S: 5800 },
	{ month: "T7", Tr: 7000, S: 6500 }
];

export default function LineRevenue() {
    const [selectedTimeRange, setSelectedTimeRange] = useState("Tháng này");
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Biểu đồ so sánh doanh thu xu hướng</h2>
				<select
					className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.S.value)}
				>
					<option>Tuần này</option>
					<option>Tháng này</option>
					<option>Quý này</option>
					<option>Năm nay</option>
				</select>
			</div>

			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<AreaChart data={TrData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Area type='monotone' dataKey='Tr' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
						<Area type='monotone' dataKey='S' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}