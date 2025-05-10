import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/commons/StatCard";
import PieUserStatistic from "../components/overview/PieUserStatistic";
import ColUserNewStatistic from "../components/overview/ColUserNewStatistic";
import LineVisitStatistic from "../components/overview/LineVisitStatistic";
import { useEffect, useState } from "react";

const OverviewPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    onlineUsers: 0,
  });

  // Fetch dữ liệu từ API
  useEffect(() => {
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
          birthDate: user.birthDate
            ? new Date(user.birthDate).toISOString().split("T")[0]
            : "N/A",
          username: user.account?.user_name || "N/A",
          email: user.email || "N/A",
          type: user.account?.type || 0,
          pass: user.account?.password || "N/A",
          createdAt: user.account?.createAt
            ? new Date(user.account.createAt).toISOString().split("T")[0]
            : "N/A",
          source: user.account?.To || "Direct",
          typeUser: user.typeUser || "Học viên",
          status: user.status || "Chờ xác nhận",
          avatar: user.avatarData || "../avatarAdmin.png",
          _original: user,
        }));
        setUsers(formattedData);

        setLoading(false);
      })
      .catch((err) => {
        console.error("fetch() error:", err);
        setLoading(false);
      });
  }, []);
  //Fetch logs
  useEffect(() => {
    fetch("http://localhost:5000/api/all-data/log")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLogs(data);
      })
      .catch((error) => {
        console.error("Error fetching user courses:", error);
      });
  }, []);

  // Thống kê
  useEffect(() => {
    if (users.length > 0 && logs.length > 0) {
      const totalUsers = users.length;
      
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter(user => user.createdAt === today).length;
      
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const onlineUsers = logs.filter(log => 
        log.timestamp && new Date(log.timestamp) > new Date(fiveMinutesAgo)
      ).length;

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
