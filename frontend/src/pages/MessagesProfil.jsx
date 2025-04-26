import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import SidebarChatProfil from "../components/SidebarChatProfil";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import { ChevronRight } from "lucide-react";

const MessagesProfil = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const { initSocket, setOnlineUsersListener, socket } = useChatStore();

  useEffect(() => {
    if (authUser?._id && !socket) {
      initSocket(authUser);
      setOnlineUsersListener();
    }
  }, [authUser, initSocket, socket]);

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
  const { socket, selectedUser, setSelectedUser, users } = useChatStore();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    // Reset selected user saat mount
    setSelectedUser(null);
  }, [setSelectedUser]);

  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const distance = endX - startX;
      if (distance > 80) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const targetUser = users.find((user) => user._id === id);

  return (
    <div className="fixed inset-0 top-16 w-screen h-[calc(100vh-64px)] flex items-center justify-center bg-[#E6E6FA] z-10 py-2">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* <button
        onClick={() => setSidebarOpen(true)}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-40 
           bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition lg:hidden"
      >
        <ChevronRight className="w-7 h-7 text-gray-800" />
      </button> */}

      <div className="relative w-full max-w-6xl h-full flex border border-white bg-[#E6E6FA] rounded-3xl shadow-2xl overflow-hidden">
        {/* SIDEBAR */}
        <SidebarChatProfil
          socket={socket}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatContainer socket={socket} />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6 animate-fadeIn">
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
                    ? 🎉 Ayo mulai ngobrol dan buat harimu lebih menyenangkan!
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
