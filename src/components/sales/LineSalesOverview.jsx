import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const getStartOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); 
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getStartOfMonth = (date) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getStartOfQuarter = (date) => {
  const newDate = new Date(date);
  const month = Math.floor(newDate.getMonth() / 3) * 3;
  newDate.setMonth(month);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getStartOfYear = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(0);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const groupDataByDay = (data) => {
  const grouped = {};
  data.forEach(sale => {
    const date = formatDate(sale.date_of_purchase);
    if (!grouped[date]) {
      grouped[date] = 0;
    }
    grouped[date] += sale.price;
  });
  return Object.entries(grouped).map(([date, sales]) => ({ date, sales }));
};

const groupDataByWeek = (data) => {
  const grouped = {};
  data.forEach(sale => {
    const date = new Date(sale.date_of_purchase);
    const weekStart = getStartOfWeek(date);
    const weekKey = formatDate(weekStart);
    if (!grouped[weekKey]) {
      grouped[weekKey] = 0;
    }
    grouped[weekKey] += sale.price;
  });
  return Object.entries(grouped).map(([date, sales]) => ({ date, sales }));
};

const groupDataByMonth = (data) => {
  const grouped = {};
  const sortedKeys = [];
  
  data.forEach(sale => {
    const date = new Date(sale.date_of_purchase);
    const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const displayKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!grouped[sortKey]) {
      grouped[sortKey] = { displayDate: displayKey, sales: 0 };
      sortedKeys.push(sortKey);
    }
    grouped[sortKey].sales += sale.price;
  });
  
  sortedKeys.sort();
  
  return sortedKeys.map(key => ({
    date: grouped[key].displayDate,
    sales: grouped[key].sales,
  }));
};

export default function LineSalesOverview({ dataSales = [] }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Tháng này");

  const processedData = useMemo(() => {
    if (!dataSales || dataSales.length === 0) return [];

    const today = new Date();
    let periodStart, periodEnd;

    // Xác định khoảng thời gian hiện tại dựa trên lựa chọn
    switch (selectedTimeRange) {
      case "Tuần này":
        periodStart = getStartOfWeek(today);
        periodEnd = new Date(today);
        break;
      case "Tháng này":
        periodStart = getStartOfMonth(today);
        periodEnd = new Date(today);
        break;
      case "Quý này":
        periodStart = getStartOfQuarter(today);
        periodEnd = new Date(today);
        break;
      case "Năm nay":
        periodStart = getStartOfYear(today);
        periodEnd = new Date(today);
        break;
      default:
        periodStart = getStartOfMonth(today);
        periodEnd = new Date(today);
    }

    // Lọc data
    const periodData = dataSales.filter(sale => {
      const purchaseDate = new Date(sale.date_of_purchase);
      return purchaseDate >= periodStart && purchaseDate <= periodEnd;
    });

    // Nhóm dữ liệu theo ngày, tuần hoặc tháng tùy thuộc vào khoảng thời gian
    let groupedData = [];
    switch (selectedTimeRange) {
      case "Tuần này":
        groupedData = groupDataByDay(periodData);
        break;
      case "Tháng này":
        groupedData = groupDataByDay(periodData);
        break;
      case "Quý này":
        groupedData = groupDataByWeek(periodData);
        break;
      case "Năm nay":
        groupedData = groupDataByMonth(periodData);
        break;
      default:
        groupedData = groupDataByDay(periodData);
    }

    // Tính tổng doanh thu
    const totalRevenue = periodData.reduce((sum, sale) => sum + sale.price, 0);

    return {
      chartData: groupedData,
      totalRevenue,
      periodLabel: selectedTimeRange,
      hasData: periodData.length > 0
    };
  }, [dataSales, selectedTimeRange]);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Thống kê doanh thu {selectedTimeRange}</h2>

        <select
          className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 
          focus:ring-blue-500
          '
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>Tuần này</option>
          <option>Tháng này</option>
          <option>Quý này</option>
          <option>Năm nay</option>
        </select>
      </div>

      {processedData.hasData ? (
        <>
          <div className='w-full h-80'>
            <ResponsiveContainer>
              <AreaChart 
                data={processedData.chartData}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis 
                  dataKey='date' 
                  stroke='#9CA3AF'
                />
                <YAxis stroke='#9CA3AF' />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                  itemStyle={{ color: "#E5E7EB" }}
                  formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                />
                <Legend />
                <Area 
                  type='monotone' 
                  dataKey='sales' 
                  stroke='#8B5CF6' 
                  fill='#8B5CF6' 
                  fillOpacity={0.3} 
                  name='Doanh thu'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-gray-200">
            <p>
              {`Tổng doanh thu ${processedData.periodLabel}: `}
              <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(processedData.totalRevenue)}
              </span>
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-400 text-center">
          <p className="text-xl">Không có dữ liệu thống kê trong {selectedTimeRange.toLowerCase()}</p>
        </div>
      )}
    </motion.div>
  );
}