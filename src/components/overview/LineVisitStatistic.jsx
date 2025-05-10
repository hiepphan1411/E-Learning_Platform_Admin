import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const LineVisitStatistic = ({logs}) => {
    const [monthlyData, setMonthlyData] = useState([]);
    
    useEffect(() => {
        if (!logs || !logs.length) return;
        
        const monthlyVisits = {};
        
        logs.forEach(log => {
            const date = new Date(log.timestamp);
            const month = date.getMonth();
            const year = date.getFullYear();
            const monthKey = `${year}-${month + 1}`;
            
            if (!monthlyVisits[monthKey]) {
                monthlyVisits[monthKey] = 0;
            }
            
            monthlyVisits[monthKey]++;
        });
        
        const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const formattedData = Object.entries(monthlyVisits).map(([key, count]) => {
            const [year, month] = key.split('-');
            return {
                name: `${monthNames[parseInt(month) - 1]}/${year}`,
                visits: count
            };
        });
        
        formattedData.sort((a, b) => {
            const [monthA, yearA] = a.name.split('/');
            const [monthB, yearB] = b.name.split('/');
            
            if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
            return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
        });
        
        setMonthlyData(formattedData);
    }, [logs]);

    return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Thống kê lượt truy cập theo tháng</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={monthlyData.length ? monthlyData : []}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='visits'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
							name="Lượt truy cập"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}

export default LineVisitStatistic;