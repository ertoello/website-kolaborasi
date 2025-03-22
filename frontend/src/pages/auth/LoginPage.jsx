import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import FloatingShape from "../../components/FloatingShape";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <FloatingShape
        color="bg-[#3FA3CE]" // Biru Muda
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#EF8B8B]" // Merah Muda Pastel
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#145C75]" // Biru Tua
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FFFFFF] p-8 rounded-2xl shadow-lg w-full max-w-4xl flex"
      >
        {/* Sembunyikan di Mobile */}
        <div className="relative w-1/2 p-6 flex flex-col justify-center rounded-2xl text-[#3E3E3E] hidden md:flex">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('/logo.png')" }}
          />
          <div className="absolute inset-0 bg-[#3FA3CE] opacity-50 rounded-2xl" />
          <div className="relative z-10">
            <div className="relative bg-white bg-opacity-50 rounded-2xl shadow-2xl p-6 text-center">
              <h2 className="text-lg md:text-xl font-bold text-[#145C75] drop-shadow-lg">
                Bangun Koneksi, Wujudkan Ide, dan Kembangkan Komunitas Digital
              </h2>
            </div>
            <p className="mt-4 text-center font-medium">
              Transformasi Digital Desa dalam Satu Genggaman. Selamat datang di
              Beopoeng Platform, solusi digital yang menghubungkan masyarakat
              desa dengan teknologi.
            </p>
          </div>
        </div>

        {/* Form Login */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 sm:px-10">
            <LoginForm />
          </div>
          <div className="mt-6 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D7D7D7]"></div>
            </div>
            <div className="relative inline-block px-3 bg-white text-[#828282] text-sm">
              Belum punya akun?
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/Signup"
              className="inline-block py-3 px-6 text-lg font-medium text-white bg-gradient-to-r from-[#2B7A98] to-[#145C75] rounded-lg shadow-lg hover:shadow-xl hover:from-[#145C75] hover:to-[#2B7A98] transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
