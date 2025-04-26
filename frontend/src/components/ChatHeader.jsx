import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-white bg-[#3FA3CE]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePicture || "/avatar.png"}
                alt={selectedUser?.name || "User"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.name || "Unknown"}</h3>
            <p className="text-sm text-base-content/70 text-green-300">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Tombol X hanya muncul di layar besar */}
        <button
          onClick={() => setSelectedUser(null)}
          className="hidden lg:block"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
