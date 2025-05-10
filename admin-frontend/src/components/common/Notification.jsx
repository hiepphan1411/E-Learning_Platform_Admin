import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const Notification = ({ show, type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    let timer;
    if (show) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, onClose, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-800",
          borderColor: "border-green-500",
          icon: <CheckCircle className="text-green-400" size={20} />,
          textColor: "text-green-200",
        };
      case "error":
        return {
          bgColor: "bg-red-800",
          borderColor: "border-red-500",
          icon: <AlertCircle className="text-red-400" size={20} />,
          textColor: "text-red-200",
        };
      case "warning":
        return {
          bgColor: "bg-yellow-800",
          borderColor: "border-yellow-500",
          icon: <AlertTriangle className="text-yellow-400" size={20} />,
          textColor: "text-yellow-200",
        };
      case "info":
      default:
        return {
          bgColor: "bg-blue-800",
          borderColor: "border-blue-500",
          icon: <Info className="text-blue-400" size={20} />,
          textColor: "text-blue-200",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-4 right-4 z-50 flex justify-end pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg p-4 pr-10 max-w-md pointer-events-auto`}
          >
            <div className="flex items-start gap-3">
              {styles.icon}
              <p className={`${styles.textColor} font-medium`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
