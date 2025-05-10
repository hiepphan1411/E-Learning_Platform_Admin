import { motion } from "framer-motion";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import StatCard from "../components/commons/StatCard";
import LineSalesOverview from "../components/sales/LineSalesOverview";
import PieSaleCategory from "../components/sales/PieSaleCategory";
import ColTrendSales from "../components/sales/ColTrendSales";
import { useEffect, useState } from "react";

export default function SalesPage() {
  // Replace fetch with mock data
  const [salesData, setSalesData] = useState([
    {
      id: 1,
      user_id: 2,
      course_id: 1,
      price: 299000,
      date_of_purchase: "2023-10-01",
      payment_method: "Credit Card",
      course_name: "JavaScript Fundamentals",
      category: "Programming"
    },
    {
      id: 2,
      user_id: 3,
      course_id: 2,
      price: 399000,
      date_of_purchase: "2023-10-03",
      payment_method: "PayPal",
      course_name: "Python for Beginners",
      category: "Programming"
    },
    {
      id: 3,
      user_id: 4,
      course_id: 3,
      price: 499000,
      date_of_purchase: "2023-10-05",
      payment_method: "Credit Card",
      course_name: "React Masterclass",
      category: "Web Development"
    },
    {
      id: 4,
      user_id: 5,
      course_id: 4,
      price: 349000,
      date_of_purchase: "2023-10-07",
      payment_method: "Bank Transfer",
      course_name: "Digital Marketing Essentials",
      category: "Marketing"
    },
    {
      id: 5,
      user_id: 2,
      course_id: 5,
      price: 449000,
      date_of_purchase: "2023-10-10",
      payment_method: "Credit Card",
      course_name: "UX Design Principles",
      category: "Design"
    },
    {
      id: 6,
      user_id: 3,
      course_id: 6,
      price: 529000,
      date_of_purchase: "2023-09-15",
      payment_method: "PayPal",
      course_name: "Data Analysis with R",
      category: "Data Science"
    },
    {
      id: 7,
      user_id: 5,
      course_id: 7,
      price: 459000,
      date_of_purchase: "2023-09-20",
      payment_method: "Credit Card",
      course_name: "Flutter Mobile App Development",
      category: "Mobile Development"
    }
  ]);
  
  const [salesStats, setSalesStats] = useState({
    totalRevenue: "2,584,000",
    conversionRate: "2,325,600",
    salesGrowth: "15.2%",
  });
  
  // Calculate sales stats from mock data
  useEffect(() => {
    // Tính tổng doanh thu
    const totalRevenue = salesData.reduce((sum, item) => sum + (item.price || 0), 0);
    
    // Tính doanh thu sau khi trừ thuế 10%
    const afterTax = totalRevenue * 0.9;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = currentDate.getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthSales = salesData
      .filter(item => {
        const purchaseDate = new Date(item.date_of_purchase);
        return purchaseDate.getMonth() === currentMonth && 
               purchaseDate.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + (item.price || 0), 0);
      
    const previousMonthSales = salesData
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
  }, [salesData]);

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
