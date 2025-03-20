import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // { userId: [socketId1, socketId2] }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Ambil userId dari query saat koneksi dibuat
  const userId = socket.handshake.query.userId;
  console.log("Received userId from frontend:", userId); // Debugging apakah userId diterima

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
    console.log(
      `User ${userId} is now connected with socket:`,
      userSocketMap[userId]
    );
  } else {
    console.log("⚠️ Warning: No userId received from frontend!");
  }

  // Kirim daftar user yang online saat ada user baru masuk
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log("Current Online Users:", Object.keys(userSocketMap)); // Debugging daftar user online

  // Tangani permintaan daftar user online dari frontend
  socket.on("requestOnlineUsers", () => {
    console.log("Frontend requested online users list.");
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      if (userSocketMap[userId].length === 0) {
        console.log(
          `User ${userId} has no active sockets, removing from online list.`
        );
        delete userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(
      "Updated Online Users after disconnect:",
      Object.keys(userSocketMap)
    ); // Debugging daftar user online setelah disconnect
  });
});


export { io, app, server };
