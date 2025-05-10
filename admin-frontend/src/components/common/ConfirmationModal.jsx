import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }
  };
  
  const getTypeStyles = () => {
    switch(type) {
      case "danger":
        return {
          icon: <AlertTriangle className="text-red-500 mb-4" size={32} />,
          confirmButton: "bg-red-600 hover:bg-red-700",
          hoverColor: "#B91C1C", 
        };
      case "warning":
        return {
          icon: <AlertTriangle className="text-yellow-500 mb-4" size={32} />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700",
          hoverColor: "#B45309", 
        };
      default:
        return {
          icon: null,
          confirmButton: "bg-indigo-600 hover:bg-indigo-700",
          hoverColor: "#4338CA", 
        };
    }
  };

  const { icon, confirmButton, hoverColor } = getTypeStyles();
  
  return createPortal(
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose}></div>
      <motion.div 
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          {icon}
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <p className="text-gray-300 mb-6">{message}</p>
          
          <div className="flex space-x-3 pt-4">
            <motion.button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex-1"
              whileHover={{ backgroundColor: "#4B5563" }}
              whileTap={{ scale: 0.95 }}
            >
              {cancelText}
            </motion.button>
            <motion.button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`${confirmButton.split(' ')[0]} text-white font-medium py-2 px-4 rounded transition duration-200 flex-1`}
              whileHover={{ backgroundColor: hoverColor }}
              whileTap={{ scale: 0.95 }}
            >
              {confirmText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
