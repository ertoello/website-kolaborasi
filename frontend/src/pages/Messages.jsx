import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SidebarChat from "../components/SidebarChat";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

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

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#E6E6FA] rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex border border-white overflow-hidden">
        <SidebarChat
          socket={socket}
          className="transition-all duration-300 hover:scale-105 ease-out"
        />
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatContainer
              socket={socket}
              className="transition-opacity duration-300 ease-in-out animate-fadeIn"
            />
          ) : (
            <NoChatSelected className="opacity-75 text-gray-500 animate-fadeIn" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
