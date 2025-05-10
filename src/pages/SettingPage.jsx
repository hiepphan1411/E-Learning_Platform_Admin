import { useState } from "react";
import { X } from "lucide-react";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import { motion, AnimatePresence } from "framer-motion"; 

export default function SettingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Giang Huỳnh",
    email: "gianghuynh@example.com",
    image: "../ZangHuynh.png"
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCloseModal();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <Profile 
          profileData={profileData} 
          handleOpenModal={handleOpenModal} 
        />
        <Notifications />
        <Security />
        <ConnectedAccounts />
        <DangerZone />
      </main>
      
      {/* Modal chỉnh sửa profile*/}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            style={{ backdropFilter: "blur(4px)" }}
          >
            <motion.div 
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6">Chỉnh sửa Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <motion.img
                      src={profileData.image}
                      alt="Profile"
                      className="rounded-full w-24 h-24 object-cover mb-2"
                      whileHover={{ scale: 1.05 }}
                    />
                    <motion.label 
                      className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </motion.label>
                  </div>
                  <p className="text-sm text-gray-400">Nhấp vào biểu tượng để thay đổi ảnh</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Tên</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex-1"
                    whileHover={{ backgroundColor: "#4B5563" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex-1"
                    whileHover={{ backgroundColor: "#4338CA" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lưu thay đổi
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}