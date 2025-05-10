import { useEffect, useState } from "react";
import LineRevenue from "../components/analytics/LineRevenue";
import LineUserRetention from "../components/analytics/LineUserRetention";
import OverviewCards from "../components/analytics/OverviewCards";
import PieChannelPerformance from "../components/analytics/PieChannelPerformance";

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  // Fetch user_courses
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
      })
      .catch((error) => {
        console.error("Error fetching user courses:", error);
      });
  }, []);
  //Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/api/all-data/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <OverviewCards salesData={salesData} users={users} logs={logs}/>
      <LineRevenue salesData={salesData}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PieChannelPerformance users={users}/>
        <LineUserRetention logs={logs}/>
      </div>
    </main>
  );
}
