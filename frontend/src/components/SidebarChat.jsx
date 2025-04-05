import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";


const SidebarChat = () => {
  const queryClient = useQueryClient();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, onlineUsers} =
    useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const counts = {};

      for (const user of users) {
        try {
          const res = await axiosInstance.get(
            `/notifications/messages/unread-count/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          counts[user._id] = res.data.count;
        } catch (error) {
          console.error("Gagal fetch unread count:", error);
        }
      }

      setUnreadCounts(counts);
    };

    if (users.length > 0) {
      fetchUnreadCounts();
    }
  }, [users]);


  useEffect(() => {
    getUsers();
  }, [getUsers]); // Hanya jalankan sekali, menghindari re-fetching berlebihan

  const filteredUsers = useMemo(
    () =>
      showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users,
    [users, onlineUsers, showOnlineOnly]
  );

  const handleSelectUser = useCallback(
    async (user) => {
      try {
        // Panggil API untuk mark semua pesan dari sender ini sebagai read
        await axiosInstance.put(`/notifications/message/read/${user._id}`);

        // Set user yang sedang dipilih
        setSelectedUser(user);

        // Hapus badge count-nya (set jadi 0)
        setUnreadCounts((prev) => ({
          ...prev,
          [user._id]: 0,
        }));
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [setSelectedUser]
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white flex flex-col transition-all duration-200 bg-gray-400">
      <div className="border-b border-white w-full p-5 bg-[#3FA3CE] text-white">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-sm text-green-300 font-medium">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-[#A8A8A8] transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-[#828282] ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {unreadCounts[user._id] > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCounts[user._id]}
                </span>
              )}
              
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate text-[#145C75]">
                {user.name}
              </div>
              <div className="text-sm text-green-200">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default SidebarChat;
