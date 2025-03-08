import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const HalamanLupaPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: lupaPassword, isLoading } = useMutation({
    mutationFn: async (email) => {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tautan reset telah dikirim! Periksa email kamu.");
      setIsSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Terjadi kesalahan");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    lupaPassword(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-[#FFFFFF] bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden absolute left-1/3 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#78C1E4] to-[#3FA3CE] text-transparent bg-clip-text ">
          Lupa Kata Sandi
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-[#828282] mb-6 text-center">
              Masukkan alamat email kamu dan kami akan mengirimkan tautan untuk
              mengatur ulang kata sandi.
            </p>
            <Input
              icon={Mail}
              type="email"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2B7A98] to-[#145C75] text-white font-bold rounded-lg shadow-lg hover:from-[#3FA3CE] hover:to-[#66B2D6] focus:outline-none focus:ring-2 focus:ring-[#3FA3CE] focus:ring-offset-2 focus:ring-offset-[#A8A8A8] transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin mx-auto" />
              ) : (
                "Kirim Tautan Reset"
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-[#EF8B8B] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-[#D7D7D7] mb-6">
              Jika akun dengan email {email} ada, kamu akan menerima tautan
              reset kata sandi sebentar lagi.
            </p>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-[#525252] bg-opacity-50 flex justify-center">
        <Link
          to={"/login"}
          className="text-sm text-[#FF9999] hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Login
        </Link>
      </div>
    </motion.div>
  );
};

export default HalamanLupaPassword;
