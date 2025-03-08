import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password-nya beda! Cek lagi ya.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axiosInstance.post("/api/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message);
      toast.success(
        "Password berhasil diubah! Lagi dipindahin ke halaman login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Ada masalah pas reset password!"
      );
      toast.error(error.response?.data?.message || "Gagal reset password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#3E3E3E] bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#3FA3CE] to-[#2B7A98] text-transparent bg-clip-text">
            Ubah Password
          </h2>
          {error && <p className="text-[#BF5F5F] text-sm mb-4">{error}</p>}
          {message && <p className="text-[#66B2D6] text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type="password"
              placeholder="Masukin Password Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Ulangin Password Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#EF8B8B] to-[#C06C6C] text-white font-bold rounded-lg shadow-lg hover:from-[#FF9999] hover:to-[#BF5F5F] focus:outline-none focus:ring-2 focus:ring-[#EF8B8B] focus:ring-offset-2 focus:ring-offset-[#D7D7D7] transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Lagi Diproses..." : "Simpan Password Baru"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
