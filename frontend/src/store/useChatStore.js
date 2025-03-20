import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client"; // Import socket.io-client

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  onlineUsers: [], // Tambahkan state untuk menyimpan user yang online
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: null, // Tambahkan state socket

  initSocket: () => {
    const socket = io("http://localhost:5000"); // Ganti dengan URL backend-mu
    set({ socket });

    socket.on("connect", () => {
      console.log("Socket terhubung!");
    });

    socket.on("disconnect", () => {
      console.log("Socket terputus!");
    });

    // Event listener untuk mendapatkan user yang online
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
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
