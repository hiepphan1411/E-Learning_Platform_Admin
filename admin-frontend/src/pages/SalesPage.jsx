import { motion } from "framer-motion";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import StatCard from "../components/commons/StatCard";
import LineSalesOverview from "../components/sales/LineSalesOverview";
import PieSaleCategory from "../components/sales/PieSaleCategory";
import ColTrendSales from "../components/sales/ColTrendSales";
import { useEffect, useState } from "react";

export default function SalesPage() {
  const [salesData, setSalesData] = useState([]);
  const [salesStats, setSalesStats] = useState({
    totalRevenue: "0",
    conversionRate: "0",
    salesGrowth: "0%",
  });
  
  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch("http://localhost:5000/api/all-data/user_courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSalesData(data);
        calculateSalesStats(data);
      })
      .catch((error) => {
        console.error("Error fetching user courses:", error);
      });
  }, []);
  
  // Tính toán các thống kê doanh số
  const calculateSalesStats = (data) => {
    // Tính tổng doanh thu
    const totalRevenue = data.reduce((sum, item) => sum + (item.price || 0), 0);
    
    // Tính doanh thu sau khi trừ thuế 10%
    const afterTax = totalRevenue * 0.9;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = currentDate.getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthSales = data
      .filter(item => {
        const purchaseDate = new Date(item.date_of_purchase);
        return purchaseDate.getMonth() === currentMonth && 
               purchaseDate.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + (item.price || 0), 0);
      
    const previousMonthSales = data
      .filter(item => {
        const purchaseDate = new Date(item.date_of_purchase);
        return purchaseDate.getMonth() === previousMonth && 
               purchaseDate.getFullYear() === previousYear;
      })
      .reduce((sum, item) => sum + (item.price || 0), 0);
    
    // Tính tỷ lệ tăng trưởng
    let growth = "0%";
    if (previousMonthSales > 0) {
      const growthRate = ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
      growth = growthRate < 0 ? "0%" : growthRate.toFixed(1) + "%";
    }
    
    setSalesStats({
      totalRevenue: totalRevenue.toLocaleString(),
      conversionRate: afterTax.toLocaleString(),
      salesGrowth: growth,
    });
  };

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {/* SALES STATS */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Tổng doanh thu"
          icon={DollarSign}
          value={salesStats.totalRevenue}
          color="#6366F1"
        />
        <StatCard
          name="Sau thuế (10%)"
          icon={CreditCard}
          value={salesStats.conversionRate}
          color="#F59E0B"
        />
        <StatCard
          name="Tỷ lệ tăng so với tháng trước"
          icon={TrendingUp}
          value={salesStats.salesGrowth}
          color="#EF4444"
        />
      </motion.div>
      <LineSalesOverview dataSales={salesData}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PieSaleCategory dataSales={salesData}/>
        <ColTrendSales dataSales={salesData}/>
      </div>
    </main>
  );
}
