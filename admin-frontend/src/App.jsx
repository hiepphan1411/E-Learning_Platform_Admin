import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { TitleProvider } from "./hooks/TitleProvider";
import OverviewPage from "./pages/OverviewPage";
import CoursesPage from "./pages/CoursesPage";
import SalesPage from "./pages/SalesPage";
import CertificatesPage from "./pages/CertificatesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingPage from "./pages/SettingPage";
import UsersPage from "./pages/UsersPage";
import Login from "./pages/Login";
import { useState, createContext } from "react";
import { useEffect } from "react";

export const AuthContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [isAuthenticated, userData]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isAuthenticated, userData, handleLogin, handleLogout }}>
        <TitleProvider>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
              <Route index element={<OverviewPage />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingPage />} />
            </Route>
          </Routes>
        </TitleProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;