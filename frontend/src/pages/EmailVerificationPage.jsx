import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // React Query Mutation untuk verifikasi email
  const { mutate: verifyEmail, isLoading } = useMutation({
    mutationFn: async (verificationCode) => {
      const res = await axiosInstance.post("/auth/verify-email", {
        code: verificationCode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Email berhasil diverifikasi!");

      if (!data.user.isVerified) {
        // Jika akun belum disetujui, arahkan ke halaman "Menunggu Konfirmasi"
        navigate("/waiting-approval");
      } else {
        // Jika akun sudah disetujui, arahkan ke halaman utama
        navigate("/");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Verifikasi gagal!");
    },
  });

  // Handle perubahan input
  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    verifyEmail(verificationCode);
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#EAEAEA]">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#FFFFFF] rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#2B7A98]">
            Verifikasi Email
          </h2>
          <p className="text-center text-[#828282] mb-6">
            Masukkan 6-digit kode yang telah dikirimkan ke email kamu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-[#D7D7D7] text-[#3E3E3E] border-2 border-[#A8A8A8] rounded-lg focus:border-[#3FA3CE] focus:outline-none"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full bg-gradient-to-r from-[#3FA3CE] to-[#145C75] text-[#FFFFFF] font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#2B7A98] hover:to-[#145C75] focus:outline-none focus:ring-2 focus:ring-[#3FA3CE] focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi Email"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
