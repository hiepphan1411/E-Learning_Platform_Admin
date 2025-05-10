import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

export default function DangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAccount = () => {
    // Implement the actual account deletion logic here
    console.log("Account deletion confirmed");
  };

  return (
    <>
      <motion.div
        className="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center mb-4">
          <Trash2 className="text-red-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-100">Xóa tài khoản</h2>
        </div>
        <p className="text-gray-300 mb-4">
          Việc xóa tài khoản sẽ xóa tất cả dữ liệu liên quan đến tài khoản của bạn. Bạn sẽ không thể khôi phục lại tài khoản này sau khi xóa.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200"
        >
          Xóa tài khoản
        </button>
      </motion.div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Xác nhận xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị mất vĩnh viễn."
        confirmText="Xóa tài khoản"
        cancelText="Hủy"
        type="danger"
      />
    </>
  );
}
