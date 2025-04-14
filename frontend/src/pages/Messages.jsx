import { useEffect, useState} from "react";
import { useQueryClient } from "@tanstack/react-query";
import SidebarChat from "../components/SidebarChat";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Messages = () => {
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

  return <MessagesContent />;
};

const MessagesContent = () => {
  const { socket, selectedUser } = useChatStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    // Jika layar kecil (mobile), buka sidebar langsung
    if (window.innerWidth < 1024) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 top-16 w-screen h-[calc(100vh-64px)] flex items-center justify-center bg-[#E6E6FA] z-10 py-2">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-40 
        bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition lg:hidden"
      >
        <ChevronRight className="w-7 h-7 text-gray-800" />
      </button>

      <div className="relative w-full max-w-6xl h-full flex border border-white bg-[#E6E6FA] rounded-3xl shadow-2xl overflow-hidden">
        <SidebarChat
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <NoChatSelected className="opacity-75 text-gray-500 animate-fadeIn" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
