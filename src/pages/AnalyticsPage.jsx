import { useEffect, useState } from "react";
import LineRevenue from "../components/analytics/LineRevenue";
import LineUserRetention from "../components/analytics/LineUserRetention";
import OverviewCards from "../components/analytics/OverviewCards";
import PieChannelPerformance from "../components/analytics/PieChannelPerformance";

export default function AnalyticsPage() {
  // Replace fetches with mock data
  const [salesData, setSalesData] = useState([
    { id: 1, user_id: 1, course_id: 1, price: 29.99, purchase_date: "2023-10-01", payment_method: "Credit Card" },
    { id: 2, user_id: 2, course_id: 3, price: 49.99, purchase_date: "2023-10-02", payment_method: "PayPal" },
    { id: 3, user_id: 3, course_id: 2, price: 19.99, purchase_date: "2023-10-03", payment_method: "Credit Card" },
    { id: 4, user_id: 4, course_id: 5, price: 39.99, purchase_date: "2023-10-05", payment_method: "Bank Transfer" },
    { id: 5, user_id: 5, course_id: 4, price: 25.99, purchase_date: "2023-10-07", payment_method: "Credit Card" },
    { id: 6, user_id: 6, course_id: 1, price: 29.99, purchase_date: "2023-10-10", payment_method: "PayPal" },
    { id: 7, user_id: 7, course_id: 3, price: 49.99, purchase_date: "2023-10-12", payment_method: "Credit Card" },
    { id: 8, user_id: 8, course_id: 2, price: 19.99, purchase_date: "2023-10-15", payment_method: "Bank Transfer" },
  ]);
  
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", registration_source: "Direct", created_at: "2023-09-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", registration_source: "Google", created_at: "2023-09-05" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", registration_source: "Facebook", created_at: "2023-09-10" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", registration_source: "Direct", created_at: "2023-09-15" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", registration_source: "Twitter", created_at: "2023-09-20" },
    { id: 6, name: "Eva Wilson", email: "eva@example.com", registration_source: "Google", created_at: "2023-09-25" },
    { id: 7, name: "Frank Miller", email: "frank@example.com", registration_source: "Facebook", created_at: "2023-09-30" },
    { id: 8, name: "Grace Taylor", email: "grace@example.com", registration_source: "Direct", created_at: "2023-10-01" },
  ]);
  
  const [logs, setLogs] = useState([
    { id: 1, user_id: 1, action: "login", timestamp: "2023-10-01 08:30:00" },
    { id: 2, user_id: 1, action: "view_course", timestamp: "2023-10-01 08:35:00" },
    { id: 3, user_id: 2, action: "login", timestamp: "2023-10-01 09:00:00" },
    { id: 4, user_id: 3, action: "login", timestamp: "2023-10-01 10:15:00" },
    { id: 5, user_id: 1, action: "login", timestamp: "2023-10-02 08:20:00" },
    { id: 6, user_id: 2, action: "login", timestamp: "2023-10-02 09:05:00" },
    { id: 7, user_id: 4, action: "login", timestamp: "2023-10-02 11:30:00" },
    { id: 8, user_id: 5, action: "login", timestamp: "2023-10-03 08:00:00" },
    { id: 9, user_id: 1, action: "login", timestamp: "2023-10-03 08:45:00" },
    { id: 10, user_id: 2, action: "login", timestamp: "2023-10-03 09:10:00" }
  ]);

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
