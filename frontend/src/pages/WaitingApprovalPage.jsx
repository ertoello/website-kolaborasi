import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WaitingApprovalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#2B7A98] mb-4">
          Menunggu Konfirmasi
        </h2>
        <p className="text-gray-600 mb-6">
          Akun kamu telah terverifikasi, tetapi masih menunggu persetujuan dari
          pengurus desa. Kami akan menghubungi kamu setelah proses selesai.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#3FA3CE] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#2B7A98] transition duration-300"
        >
          Kembali ke Beranda
        </button>
      </motion.div>
    </div>
  );
};

export default WaitingApprovalPage;
