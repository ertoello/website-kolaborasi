import { motion } from "framer-motion";
import { useLoading } from "./LoadingContext";

const LoadingModal = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center"
      >
        <div className="w-16 h-16 border-4 border-t-[#145C75] border-b-[#78C1E4] border-l-[#3FA3CE] border-r-[#F4F4F4] rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-semibold text-[#145C75]">
          Mohon Tunggu...
        </h2>
        <p className="text-sm text-gray-500 mt-2">Sedang memuat halaman...</p>
      </motion.div>
    </div>
  );
};

export default LoadingModal;