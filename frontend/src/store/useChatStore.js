import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client"; // Import socket.io-client

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  onlineUsers: [], // Menyimpan daftar pengguna yang online
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: null, // State socket

  initSocket: (authUser) => {
    if (!authUser?._id) return; // Pastikan user sudah login sebelum menghubungkan socket

    if (get().socket) return; // Hindari membuat socket baru jika sudah ada

    const socket = io("http://localhost:5000", {
      query: { userId: authUser._id }, // Kirim ID user ke server saat koneksi dibuat
    });

    // const socket = io("https://website-kolaborasi-production.up.railway.app", {
    //   query: { userId: authUser._id },
    // });

    set({ socket });

    socket.on("connect", () => {
      console.log("Socket terhubung dengan ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket terputus!");
    });

    // Perbarui daftar pengguna online secara otomatis
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    console.log("Socket diinisialisasi untuk user:", authUser._id);
  },

  setOnlineUsersListener: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/connections");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getUserById: async (userId) => {
    try {
      const res = await axios.get(`/connections/${userId}`);
      set({ selectedUser: res.data }); // Hanya simpan 1 user berdasarkan ID
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, socket } = get();
    if (!socket) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });

      // Kirim pesan ke socket
      socket.emit("sendMessage", res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, socket } = get();
    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = get();
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
