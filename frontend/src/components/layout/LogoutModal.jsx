import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Warna khas website (ubah sesuai brand)
  const primaryColor = "#0088cc"; // Contoh: warna biru khas
  const dangerColor = "#ff4d4d"; // Warna merah untuk tombol logout

  // Fungsi untuk disconnect socket
  const disconnectSocket = () => {
    if (window.socket?.connected) {
      window.socket.disconnect();
    }
  };

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.href = "/login"; // Redirect ke halaman login setelah logout
    },
  });

  // Fungsi logout dengan modal
  const handleLogout = () => {
    disconnectSocket();
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    logout();
  };

  return (
    <>
      {/* Tombol Logout */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 text-gray-700 border-2 border-transparent rounded-lg transition-all duration-300 
             hover:text-gray-700 hover:border-gray-700 active:bg-gray-700 active:text-white"
      >
        <LogOut size={24} />
      </button>

      {/* Modal Konfirmasi Logout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-center border border-white/20"
            >
              <h2 className="text-xl font-bold text-gray-100">
                Konfirmasi Logout
              </h2>
              <p className="text-gray-300 mt-2">
                Anda yakin ingin keluar? Semua sesi akan diakhiri.
              </p>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg shadow-md transition-all text-white"
                  style={{
                    background: `linear-gradient(135deg, ${dangerColor},rgb(239, 152, 152))`,
                    boxShadow: `0px 4px 15px rgba(255, 77, 77, 0.4)`,
                  }}
                >
                  Ya, Keluar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-lg transition-all text-white"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, #00aaff)`,
                    boxShadow: `0px 4px 15px rgba(0, 136, 204, 0.4)`,
                  }}
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoutModal;
