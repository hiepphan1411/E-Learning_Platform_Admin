import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/commons/StatCard";
import PieUserStatistic from "../components/overview/PieUserStatistic";
import ColUserNewStatistic from "../components/overview/ColUserNewStatistic";
import LineVisitStatistic from "../components/overview/LineVisitStatistic";
import { useEffect, useState } from "react";

const OverviewPage = () => {
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
      createdAt: new Date().toISOString().split("T")[0], // Today
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
      createdAt: new Date().toISOString().split("T")[0], // Today
      source: "Facebook",
      typeUser: "Học viên",
      status: "Chờ xác nhận",
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
      status: "Hoạt động",
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
    }
  ]);
  
  const [logs, setLogs] = useState([
    { id: 1, user_id: 1, action: "login", timestamp: "2023-10-17 08:30:00" },
    { id: 2, user_id: 1, action: "view_dashboard", timestamp: "2023-10-17 08:35:00" },
    { id: 3, user_id: 2, action: "login", timestamp: "2023-10-17 09:00:00" },
    { id: 4, user_id: 2, action: "view_course", timestamp: "2023-10-17 09:05:00" },
    { id: 5, user_id: 3, action: "login", timestamp: "2023-10-17 10:15:00" },
    { id: 6, user_id: 4, action: "login", timestamp: "2023-10-17 10:30:00" },
    { id: 7, user_id: 4, action: "purchase_course", timestamp: "2023-10-17 10:40:00" },
    { id: 8, user_id: 5, action: "login", timestamp: "2023-10-17 11:00:00" },
    { id: 9, user_id: 5, action: "view_course", timestamp: "2023-10-17 11:10:00" },
    { id: 10, user_id: 1, action: "logout", timestamp: "2023-10-17 12:00:00" },
    // Yesterday's logs
    { id: 11, user_id: 1, action: "login", timestamp: "2023-10-16 08:30:00" },
    { id: 12, user_id: 2, action: "login", timestamp: "2023-10-16 09:15:00" },
    { id: 13, user_id: 3, action: "login", timestamp: "2023-10-16 10:00:00" },
    // Previous day logs
    { id: 14, user_id: 1, action: "login", timestamp: "2023-10-15 08:45:00" },
    { id: 15, user_id: 2, action: "login", timestamp: "2023-10-15 09:30:00" },
  ]);

  const [stats, setStats] = useState({
    totalUsers: users.length,
    newUsersToday: users.filter(user => user.createdAt === new Date().toISOString().split("T")[0]).length,
    onlineUsers: 3,
  });

  // Thống kê
  useEffect(() => {
    if (users.length > 0 && logs.length > 0) {
      const totalUsers = users.length;
      
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter(user => user.createdAt === today).length;
      
      // Simulate online users (in a real app, this would be from recent logs)
      const onlineUsers = 3;

      setStats({
        totalUsers,
        newUsersToday,
        onlineUsers
      });
    }
  }, [users, logs]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg font-medium text-gray-700">
              Đang tải dữ liệu...
            </p>
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
                icon={Zap}
                value={stats.totalUsers.toString()}
                color="#6366F1"
              />
              <StatCard
                name="Đăng ký mới hôm nay"
                icon={Users}
                value={stats.newUsersToday.toString()}
                color="#8B5CF6"
              />
              <StatCard
                name="Đang online"
                icon={ShoppingBag}
                value={stats.onlineUsers.toString()}
                color="#EC4899"
              />
              <StatCard
                name="Tỷ lệ hoàn thành khóa học"
                icon={BarChart2}
                value="12.5%"
                color="#10B981"
              />
            </motion.div>
            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LineVisitStatistic logs={logs}/>
              <PieUserStatistic users={users}/>
              <ColUserNewStatistic users={users}/>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
export default OverviewPage;
