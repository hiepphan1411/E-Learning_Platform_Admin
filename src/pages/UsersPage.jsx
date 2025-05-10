import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import UsersTable from "../components/users/UsersTable";
import LineUserGrowth from "../components/users/LineUserGrowth";
import PieUsersAge from "../components/users/PieUsersAge";
import StatCard from "../components/commons/StatCard";
import { em } from "framer-motion/client";

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  // Replace fetch with mock data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      birthDate: "1990-01-15",
      username: "admin",
      email: "admin@higi.edu.vn",
      type: 1,
      pass: "admin123",
      createdAt: "2023-01-01",
      source: "Direct",
      typeUser: "Quản trị viên",
      status: "Hoạt động",
      avatar: "../avatarAdmin.png",
    },
    {
      id: 2,
      name: "John Smith",
      birthDate: "1985-05-20",
      username: "john_smith",
      email: "john@higi.edu.vn",
      type: 0,
      pass: "john123",
      createdAt: "2023-10-15",
      source: "Google",
      typeUser: "Học viên",
      status: "Hoạt động",
      avatar: "../user-avatars/john.jpg",
    },
    {
      id: 3,
      name: "Emma Garcia",
      birthDate: "1992-11-30",
      username: "emma_garcia",
      email: "emma@higi.edu.vn",
      type: 0,
      pass: "emma123",
      createdAt: "2023-10-17",
      source: "Facebook",
      typeUser: "Học viên",
      status: "Hoạt động",
      avatar: "../user-avatars/emma.jpg",
    },
    {
      id: 4,
      name: "Alex Chen",
      birthDate: "1988-07-12",
      username: "alex_chen",
      email: "alex@higi.edu.vn",
      type: 0,
      pass: "alex123",
      createdAt: "2023-10-10",
      source: "Twitter",
      typeUser: "Học viên",
      status: "Vô hiệu hóa",
      avatar: "../user-avatars/alex.jpg",
    },
    {
      id: 5,
      name: "Sarah Lee",
      birthDate: "1995-03-25",
      username: "sarah_lee",
      email: "sarah@higi.edu.vn",
      type: 0,
      pass: "sarah123",
      createdAt: "2023-09-28",
      source: "Google",
      typeUser: "Học viên",
      status: "Hoạt động",
      avatar: "../user-avatars/sarah.jpg",
    },
    {
      id: 6,
      name: "Michael Wong",
      birthDate: "1982-09-05",
      username: "michael_wong",
      email: "michael@higi.edu.vn",
      type: 0,
      pass: "michael123",
      createdAt: "2023-08-15",
      source: "Direct",
      typeUser: "Học viên",
      status: "Vô hiệu hóa",
      avatar: "../user-avatars/michael.jpg",
    },
    {
      id: 7,
      name: "Maria Rodriguez",
      birthDate: "1991-12-10",
      username: "maria_rodriguez",
      email: "maria@higi.edu.vn",
      type: 1,
      pass: "maria123",
      createdAt: "2023-03-20",
      source: "Direct",
      typeUser: "Quản trị viên",
      status: "Hoạt động",
      avatar: "../user-avatars/maria.jpg",
    }
  ]);

  const [userStats, setUserStats] = useState({
    totalUsers: 7,
    newUsersMonth: 3,
    activeUsers: 5,
    blockedUsers: 2,
  });
  
  // Calculate user statistics from mock data
  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const totalUsers = users.length;
    const newUsersMonth = users.filter(user => {
      const createdDate = user.createdAt !== "N/A" ? new Date(user.createdAt) : null;
      return createdDate && createdDate >= firstDayOfMonth;
    }).length;
    
    const activeUsers = users.filter(user => 
      user.status === "Hoạt động" || user.status === "Active"
    ).length;
    
    const blockedUsers = users.filter(user => 
      user.status === "Vô hiệu hóa" || user.status === "Blocked"
    ).length;
    
    setUserStats({
      totalUsers,
      newUsersMonth,
      activeUsers,
      blockedUsers,
    });
  }, [users]);

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
