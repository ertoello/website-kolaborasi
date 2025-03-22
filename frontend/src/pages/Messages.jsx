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
      initSocket(authUser); // Inisialisasi socket hanya jika belum ada koneksi
      setOnlineUsersListener(); // Pastikan listener aktif untuk update online status
    }
  }, [authUser, initSocket, socket]);

  if (!authUser?._id) {
    return <div>Loading...</div>;
  }

  return <MessagesContent />;
};

const MessagesContent = () => {
  const { socket, selectedUser } = useChatStore();

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center py-2 px-2">
        <div className="bg-[#78C1E4] rounded-xl shadow-cl w-full max-w-6xl h-lvh">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SidebarChat socket={socket} />
            {selectedUser ? (
              <ChatContainer socket={socket} />
            ) : (
              <NoChatSelected />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
