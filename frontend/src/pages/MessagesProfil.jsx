import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom"; // ✅ Tambahkan ini!
import { FaComments } from "react-icons/fa"; // Tambahkan ikon chat
import SidebarChatProfil from "../components/SidebarChatProfil";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

const MessagesProfil = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const { initSocket, setOnlineUsersListener, socket, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    if (authUser?._id && !socket) {
      initSocket(authUser);
      setOnlineUsersListener();
    }
  }, [authUser, initSocket, socket]);

  useEffect(() => {
    // Reset selected user when component mounts
    setSelectedUser(null);
  }, [setSelectedUser]);

  if (!authUser?._id) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold text-gray-700 animate-pulse">
        Loading...
      </div>
    );
  }

  return <MessagesContent authUser={authUser} />;
};

const MessagesContent = ({ authUser }) => {
  // ✅ Pastikan authUser diteruskan
  const { socket, selectedUser, users } = useChatStore(); // ✅ Tambahkan users!
  const { id } = useParams();

  // Temukan user yang ingin dia chat berdasarkan ID dari URL
  const targetUser = users.find((user) => user._id === id);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#E6E6FA] rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex border border-white overflow-hidden">
        <SidebarChatProfil
          socket={socket}
          className="transition-all duration-300 hover:scale-105 ease-out"
        />
        <div className="flex-1 flex flex-col">
          {selectedUser ? ( // ✅ Perbaiki kesalahan tanda kurung
            <ChatContainer
              socket={socket}
              className="transition-opacity duration-300 ease-in-out animate-fadeIn"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6">
              <div>
                <div className="flex justify-center">
                  <FaComments className="text-[#3FA3CE] text-6xl mb-4 animate-bounce" />
                </div>
                <h1 className="text-2xl font-bold text-[#3FA3CE]">
                  Hai, {authUser.name}! 👋
                </h1>
                {targetUser ? (
                  <p className="text-lg text-gray-600 mt-2">
                    Kamu siap untuk memulai percakapan seru dengan{" "}
                    <span className="text-[#3FA3CE] font-semibold">
                      {targetUser.name}
                    </span>
                    ? 🎉 Ayo mulai ngobrol dan buat hari lebih menyenangkan!
                  </p>
                ) : (
                  <p className="text-lg text-gray-600 mt-2">
                    Pilih seseorang dari daftar kontak dan mulailah berbincang!
                    Jangan biarkan hari ini berlalu tanpa obrolan menarik! 🚀
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesProfil;
