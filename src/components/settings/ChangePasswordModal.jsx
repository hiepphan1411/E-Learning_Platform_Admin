import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', duration: 0.5 } },
    exit: { opacity: 0, y: 50, scale: 0.95 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    console.log('Submitting password change', { currentPassword, newPassword });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return createPortal(
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
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Thay đổi mật khẩu</h2>
        
        {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
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
    </motion.div>,
    document.body
  );
}
