import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserCircle, Settings, LogOut } from "lucide-react";
import { AuthContext } from "../../App";

const PopupMenu = ({ onLogout }) => {
  const { handleLogout } = useContext(AuthContext);
  const handleLogoutClick = () => {
    onLogout();
    handleLogout();
  };
  return (
    <div
      className="absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-gray-800 border border-gray-700 z-40"
      style={{
        width: "200px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* <Link to="/profile" className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-200">
        <div className="flex items-center">
          <UserCircle className="w-5 h-5 mr-2 text-blue-400" />
          <span>Hồ sơ</span>
        </div>
      </Link> */}
      <Link
        to="/settings"
        className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-yellow-400" />
          <span>Cài đặt</span>
        </div>
      </Link>
      <div className="border-t border-gray-700 my-1"></div>
      <button
        onClick={handleLogoutClick}
        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center">
          <LogOut className="w-5 h-5 mr-2 text-red-400" />
          <span>Đăng xuất</span>
        </div>
      </button>
    </div>
  );
};

export default PopupMenu;
