import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { handleLogin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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
      })
      .catch((err) => {
        console.error("fetch() error:", err);
      });
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    const savedRememberMe = localStorage.getItem("adminRememberMe") === "true";
    
    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    const user = users.find(
      (user) => user.email === email && user.pass === password
    );
    console.log("User found:", user);
    if (user) {
      if (user.typeUser === "Quản trị viên") {
        if (rememberMe) {
          localStorage.setItem("adminEmail", email);
          localStorage.setItem("adminRememberMe", "true");
          localStorage.setItem("adminUserData", JSON.stringify(user));
        } else {
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("adminRememberMe");

          sessionStorage.setItem("adminUserData", JSON.stringify(user));
        }
        
        handleLogin(user);
      } else {
        setError("Bạn không có quyền truy cập vào trang quản trị");
      }
    } else {
      setError("Email hoặc mật khẩu không chính xác");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-gray-900"
      style={{ backgroundImage: "url(../bgLogin.jpg)" }}
    >
      <div className="flex min-h-screen">
        <div className="hidden md:flex md:w-1/2 p-12 items-center justify-center">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl font-bold mb-6">
              <span className="text-blue-400">HiGi</span> Trang quản trị
            </h1>
            <p className="text-lg">
              Trang này chỉ dành riêng cho quản lý! Vui lòng đăng nhập với tài
              khoản được cấp quyền quản trị để truy cập hệ thống quản lý nội
              dung và người dùng của nền tảng học trực tuyến HiGi.{" "}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-opacity-90">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700 bg-opacity-90">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    <span className="text-blue-400">HiGi</span>Admin
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Nền tảng học tập trực tuyến
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500 text-white p-2 rounded">
                  {error}
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-700"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Đăng nhập
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-400">
              <p>© Bản quyền thuộc về HiGi 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
