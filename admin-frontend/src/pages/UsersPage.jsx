import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import UsersTable from "../components/users/UsersTable";
import LineUserGrowth from "../components/users/LineUserGrowth";
import PieUsersAge from "../components/users/PieUsersAge";
import StatCard from "../components/commons/StatCard";
import { em } from "framer-motion/client";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersMonth: 0,
    activeUsers: 0,
    blockedUsers: 0,
  });
  
  // Fetch dữ liệu từ API
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/all-data/users") 
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("fetch() got:", data);
        const formattedData = data.map((user) => ({
          id: user.id || user._id,
          name: user.name || "Unknown User",
          birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "N/A",
          username: user.account?.user_name || "N/A",
          email: user.email || "N/A",
          type: user.account?.type || 0,
          pass: user.account?.password || "N/A",
          createdAt: user.account?.createAt ? new Date(user.account.createAt).toISOString().split("T")[0] : "N/A",
          source: user.account?.To || "Direct",
          typeUser: user.typeUser || "Học viên",
          status: user.status || "N/A",
          avatar: user.avatarData || "../avatarAdmin.png",
          _original: user,
        }));
        setUsers(formattedData);
        
        // Tính thống kê
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const totalUsers = formattedData.length;
        const newUsersMonth = formattedData.filter(user => {
          const createdDate = user.createdAt !== "N/A" ? new Date(user.createdAt) : null;
          return createdDate && createdDate >= firstDayOfMonth;
        }).length;
        
        const activeUsers = formattedData.filter(user => 
          user.status === "Hoạt động" || user.status === "Active"
        ).length;
        
        const blockedUsers = formattedData.filter(user => 
          user.status === "Vô hiệu hóa" || user.status === "Blocked"
        ).length;
        
        setUserStats({
          totalUsers,
          newUsersMonth,
          activeUsers,
          blockedUsers,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("fetch() error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Tổng người dùng"
              icon={UsersIcon}
              value={userStats.totalUsers.toLocaleString()}
              color="#6366F1"
            />
            <StatCard
              name="Người dùng mới tháng này"
              icon={UserPlus}
              value={userStats.newUsersMonth.toLocaleString()}
              color="#10B981"
            />
            <StatCard
              name="Tài khoản Active"
              icon={UserCheck}
              value={userStats.activeUsers.toLocaleString()}
              color="#F59E0B"
            />
            <StatCard
              name="Tài khoản bị khóa"
              icon={UserX}
              value={userStats.blockedUsers.toLocaleString()}
              color="#EF4444"
            />
          </motion.div>

          <UsersTable users={users} />

          {/* USER CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <LineUserGrowth users={users} />
            <PieUsersAge users={users} />
          </div>
        </>
      )}
    </main>
  );
}
