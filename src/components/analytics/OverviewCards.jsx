import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";
import { useEffect, useState } from "react";

export default function OverviewCards({salesData, users, logs}) {
  const [overviewData, setOverviewData] = useState([]);
  
  useEffect(() => {
    if (salesData && users.length > 0 && logs.length > 0) {
      const getCurrentMonth = () => new Date().getMonth();
      const getPreviousMonth = () => (getCurrentMonth() === 0 ? 11 : getCurrentMonth() - 1);
      const getCurrentYear = () => new Date().getFullYear();
      const getPreviousYear = () => getCurrentMonth() === 0 ? getCurrentYear() - 1 : getCurrentYear();
      
      const filterByMonth = (data, month, year) => {
        return data.filter(item => {
          const date = new Date(item.date_of_purchase);
          return date.getMonth() === month && date.getFullYear() === year;
        });
      };
      
      const currentMonthSales = filterByMonth(salesData, getCurrentMonth(), getCurrentYear());
      const previousMonthSales = filterByMonth(salesData, getPreviousMonth(), getPreviousYear());
      
      const currentMonthLogs = filterByMonth(logs, getCurrentMonth(), getCurrentYear());
      const previousMonthLogs = filterByMonth(logs, getPreviousMonth(), getPreviousYear());
      
      //Trừ thuế 10%
      const calculateProfit = (sales) => {
        const totalSales = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
        return totalSales * 0.9;
      };
      
      const currentProfit = calculateProfit(currentMonthSales);
      const previousProfit = calculateProfit(previousMonthSales);
      
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };
      
      // Format tiền
      const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(Math.round(num));
      };
      
      const newOverviewData = [
        { 
          name: "Lợi nhuận", 
          value: formatNumber(currentProfit), 
          change: parseFloat(calculateChange(currentProfit, previousProfit).toFixed(1)), 
          icon: DollarSign 
        },
        { 
          name: "Người dùng", 
          value: formatNumber(users.length), 
          change: parseFloat(calculateChange(users.length, users.length - 5).toFixed(1)), 
          icon: Users 
        },
        { 
          name: "Hóa đơn tháng này", 
          value: formatNumber(currentMonthSales.length), 
          change: parseFloat(calculateChange(currentMonthSales.length, previousMonthSales.length).toFixed(1)), 
          icon: ShoppingBag 
        },
        { 
          name: "Lượt xem trang", 
          value: formatNumber(currentMonthLogs.length), 
          change: parseFloat(calculateChange(currentMonthLogs.length, previousMonthLogs.length).toFixed(1)), 
          icon: Eye 
        },
      ];
      
      setOverviewData(newOverviewData);
    }
  }, [salesData, users, logs]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg
            rounded-xl p-6 border border-gray-700
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-gray-100">
                {item.value}
              </p>
            </div>

            <div
              className={`
              p-3 rounded-full bg-opacity-20 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }
              `}
            >
              <item.icon
                className={`size-6  ${
                  item.change >= 0 ? "text-green-900" : "text-red-900"
                }`}
              />
            </div>
          </div>
          <div
            className={`
              mt-4 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }
            `}
          >
            {item.change >= 0 ? (
              <ArrowUpRight size="20" />
            ) : (
              <ArrowDownRight size="20" />
            )}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(item.change)}%
            </span>
            <span className="ml-2 text-sm text-gray-400">vs tháng trước</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
