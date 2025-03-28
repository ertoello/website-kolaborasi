import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const SidebarChatProfil = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const queryClient = useQueryClient();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, onlineUsers} =
    useChatStore();
  const navigate = useNavigate(); // Untuk navigasi

  useEffect(() => {
    getUsers();
  }, [getUsers]); // Ambil daftar user saat komponen dimuat

  // Hanya ambil user yang ID-nya sesuai dengan URL
  const filteredUsers = useMemo(() => {
    return users.filter((user) => user._id === id);
  }, [users, id]);

  // Fungsi untuk memilih user saat diklik
  const handleSelectUser = useCallback(
    (user) => {
      setSelectedUser(user); // Set selected user di state global
      navigate(`/messages/${user._id}`); // Navigasi ke halaman user
    },
    [setSelectedUser, navigate]
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white flex flex-col transition-all duration-200 bg-gray-400">
      <div className="border-b border-white w-full p-5 bg-[#3FA3CE] text-white">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-[#A8A8A8] transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-[#828282] ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
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
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No user found</div>
        )}
      </div>
    </aside>
  );
};

export default SidebarChatProfil;
