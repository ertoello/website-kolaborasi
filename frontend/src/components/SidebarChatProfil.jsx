import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const SidebarChatProfil = ({ isSidebarOpen, setSidebarOpen }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    onlineUsers,
  } = useChatStore();
  const navigate = useNavigate();
  const [unreadCounts, setUnreadCounts] = useState({});


  useEffect(() => {
    getUsers();
  }, [getUsers]);

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


  const filteredUsers = useMemo(() => {
    return users.filter((user) => user._id === id);
  }, [users, id]);

  const handleSelectUser = useCallback(
    (user) => {
      setSelectedUser(user);
      navigate(`/messages/${user._id}`);
      setSidebarOpen(false); // tutup sidebar saat klik di mobile
    },
    [setSelectedUser, navigate, setSidebarOpen]
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100%-4rem)] w-full bg-gray-400 z-40
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:top-0 lg:h-full lg:translate-x-0 lg:w-72
      `}
    >
      <div className="border-b border-white w-full p-5 bg-[#3FA3CE] text-white">
        <div className="flex items-center gap-2">
          <Users className="size-10" />
          <span className="font-medium text-center">
            Silahkan Chat Dengan Teman Anda
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`w-full px-6 py-5 flex flex-col items-center text-center gap-3 hover:bg-[#A8A8A8] transition-colors
          ${
            selectedUser?._id === user._id
              ? "bg-[#828282] ring-1 ring-base-300"
              : ""
          }
        `}
            >
              {/* Avatar dan status */}
              <div className="relative">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.name}
                  className="w-20 h-20 object-cover rounded-full"
                />
                {unreadCounts[user._id] > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full min-w-[20px] text-center">
                    {unreadCounts[user._id]}
                  </span>
                )}

                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Nama dan status */}
              <div className="min-w-0">
                <div className="font-semibold text-base text-[#145C75] truncate w-32">
                  {user.name}
                </div>
                <div
                  className={`text-sm ${
                    onlineUsers.includes(user._id)
                      ? "text-green-200"
                      : "text-gray-300"
                  }`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No user found</div>
        )}
      </div>
    </aside>
  );
};

export default SidebarChatProfil;

