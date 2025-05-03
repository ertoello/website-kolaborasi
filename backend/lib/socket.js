import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      // "https://website-kolaborasi.vercel.app",
      "https://w3lc3pgc-5173.asse.devtunnels.ms", // tambahkan ini
    ],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }

// Fungsi untuk mendapatkan socket ID penerima
export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

// Event ketika user terhubung ke socket
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  try {
    // Ambil userId dari query yang dikirim frontend
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.warn("⚠️ Warning: No userId received from frontend!");
      return;
    }

    // Simpan userId dan socket ID ke dalam userSocketMap
    userSocketMap[userId] = socket.id;
    console.log(`🔵 User ${userId} is now online.`);

    // Kirim daftar user yang online ke semua client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Event untuk permintaan daftar user online
    socket.on("requestOnlineUsers", () => {
      socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Event ketika user disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      // Hapus user dari daftar online jika socket ID cocok
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log(`🔴 User ${userId} removed from online list.`);
      }

      // Perbarui daftar user online untuk semua client
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } catch (error) {
    console.error("❌ Error in socket connection:", error);
  }
});

export { io, app, server };
