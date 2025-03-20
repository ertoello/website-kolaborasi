import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SidebarChat from "../components/SidebarChat";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { SocketProvider, useSocket } from "../SocketProvider";
import { useChatStore } from "../store/useChatStore";

const Messages = () => {
  const { selectedUser } = useChatStore();
  const queryClient = useQueryClient();

  // Ambil authUser dari cache React Query
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => {
      return queryClient.getQueryData(["authUser"]);
    },
    enabled: !!queryClient.getQueryData(["authUser"]),
  });

  if (!authUser?._id) {
    return <div>Loading...</div>;
  }

  return (
    <SocketProvider userId={authUser._id}>
      <MessagesContent />
    </SocketProvider>
  );
};

const MessagesContent = () => {
  const socket = useSocket();
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center py-2 px-2">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
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
