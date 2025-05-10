import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
export default function LineRevenue({ salesData }) {
    const [selectedTimeRange, setSelectedTimeRange] = useState("Tháng này");
    const [chartData, setChartData] = useState([]);
    const [xAxisKey, setXAxisKey] = useState("day");
    const [comparisonLabels, setComparisonLabels] = useState({
        current: "Tháng này",
        previous: "Tháng trước"
    });

    useEffect(() => {
        if (!salesData || salesData.length === 0) {
            setChartData([]);
            return;
        }

        const processedData = processDataForTimeRange(salesData, selectedTimeRange);
        setChartData(processedData.chartData);
        setXAxisKey(processedData.xAxisKey);
        setComparisonLabels(processedData.labels);
    }, [selectedTimeRange, salesData]);

    const processDataForTimeRange = (data, timeRange) => {
        const sortedData = [...data].sort((a, b) => 
            new Date(a.date_of_purchase) - new Date(b.date_of_purchase)
        );
        
        const now = new Date();
        let currentData = [];
        let previousData = [];
        let xAxisKey = "day";
        let labels = { current: "", previous: "" };

        switch (timeRange) {
            case "Tuần này":
                currentData = getWeekData(sortedData, 0);
                previousData = getWeekData(sortedData, -1);
                xAxisKey = "day";
                labels = {
                    current: "Tuần này",
                    previous: "Tuần trước"
                };
                break;
            case "Tháng này":
                currentData = getMonthData(sortedData, 0);
                previousData = getMonthData(sortedData, -1);
                xAxisKey = "day";
                labels = {
                    current: "Tháng này",
                    previous: "Tháng trước"
                };
                break;
            case "Quý này":
                currentData = getQuarterData(sortedData, 0);
                previousData = getQuarterData(sortedData, -1);
                xAxisKey = "month";
                labels = {
                    current: "Quý này",
                    previous: "Quý trước"
                };
                break;
            case "Năm nay":
                currentData = getYearData(sortedData, 0);
                previousData = getYearData(sortedData, -1);
                xAxisKey = "quarter";
                labels = {
                    current: "Năm nay",
                    previous: "Năm trước"
                };
                break;
            default:
                currentData = getMonthData(sortedData, 0);
                previousData = getMonthData(sortedData, -1);
                xAxisKey = "day";
                labels = {
                    current: "Tháng này",
                    previous: "Tháng trước"
                };
        }

        const chartData = mergeData(currentData, previousData, xAxisKey);
        
        return { chartData, xAxisKey, labels };
    };

    const getWeekData = (data, offsetWeeks = 0) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1 + (offsetWeeks * 7)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const weekData = weekDays.map(day => ({ day, revenue: 0 }));
        
        data.forEach(sale => {
            const saleDate = new Date(sale.date_of_purchase);
            if (saleDate >= startOfWeek && saleDate <= endOfWeek) {
                const dayIndex = saleDate.getDay() === 0 ? 6 : saleDate.getDay() - 1; 
                weekData[dayIndex].revenue += sale.price;
            }
        });
        
        return weekData;
    };

    const getMonthData = (data, offsetMonths = 0) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1 + offsetMonths;
        const adjustedDate = new Date(year, month - 1, 1);
        const startOfMonth = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), 1);
        const endOfMonth = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth() + 1, 0);
        
        const weeklyData = [
            { day: 'Tuần 1', revenue: 0 },
            { day: 'Tuần 2', revenue: 0 },
            { day: 'Tuần 3', revenue: 0 },
            { day: 'Tuần 4', revenue: 0 }
        ];
        
        data.forEach(sale => {
            const saleDate = new Date(sale.date_of_purchase);
            if (saleDate >= startOfMonth && saleDate <= endOfMonth) {
                const day = saleDate.getDate();
                let weekIndex = Math.min(Math.floor((day - 1) / 7), 3); 
                weeklyData[weekIndex].revenue += sale.price;
            }
        });
        
        return weeklyData;
    };

    const getQuarterData = (data, offsetQuarters = 0) => {
        const now = new Date();
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const targetQuarterStart = currentQuarter + offsetQuarters;
        const year = now.getFullYear() + Math.floor((currentQuarter + offsetQuarters) / 4);
        const startMonth = (targetQuarterStart % 4) * 3;
        
        const startOfQuarter = new Date(year, startMonth, 1);
        const endOfQuarter = new Date(year, startMonth + 3, 0);
        
        const monthlyData = [
            { month: 'Tháng 1', revenue: 0 },
            { month: 'Tháng 2', revenue: 0 },
            { month: 'Tháng 3', revenue: 0 }
        ];
        
        data.forEach(sale => {
            const saleDate = new Date(sale.date_of_purchase);
            if (saleDate >= startOfQuarter && saleDate <= endOfQuarter) {
                const monthInQuarter = Math.floor((saleDate.getMonth() - startMonth) % 3);
                monthlyData[monthInQuarter].revenue += sale.price;
            }
        });
        
        return monthlyData;
    };

    const getYearData = (data, offsetYears = 0) => {
        const now = new Date();
        const year = now.getFullYear() + offsetYears;
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        
        const quarterlyData = [
            { quarter: 'Q1', revenue: 0 },
            { quarter: 'Q2', revenue: 0 },
            { quarter: 'Q3', revenue: 0 },
            { quarter: 'Q4', revenue: 0 }
        ];
        
        data.forEach(sale => {
            const saleDate = new Date(sale.date_of_purchase);
            if (saleDate >= startOfYear && saleDate <= endOfYear) {
                const quarter = Math.floor(saleDate.getMonth() / 3);
                quarterlyData[quarter].revenue += sale.price;
            }
        });
        
        return quarterlyData;
    };

    const mergeData = (currentPeriodData, previousPeriodData, keyName) => {
        return currentPeriodData.map((item, index) => {
            const key = item[keyName];
            const prevItem = previousPeriodData.find(prev => prev[keyName] === key) || 
                             (index < previousPeriodData.length ? previousPeriodData[index] : { revenue: 0 });
            
            return {
                [keyName]: key,
                current: item.revenue,
                previous: prevItem.revenue
            };
        });
    };

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
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option>Tuần này</option>
                    <option>Tháng này</option>
                    <option>Quý này</option>
                    <option>Năm nay</option>
                </select>
            </div>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey={xAxisKey} stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}`}
                        />
                        <Legend />
                        <Area 
                            type='monotone' 
                            dataKey='current' 
                            name={comparisonLabels.current}
                            stroke='#8B5CF6' 
                            fill='#8B5CF6' 
                            fillOpacity={0.3} 
                        />
                        <Area 
                            type='monotone' 
                            dataKey='previous'
                            name={comparisonLabels.previous} 
                            stroke='#10B981' 
                            fill='#10B981' 
                            fillOpacity={0.3} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}