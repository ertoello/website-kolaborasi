import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // Import ikon

const VerifiedUsers = ({ authUser, allUsers }) => {
  const navigate = useNavigate();

  // Hanya user dengan role 'admin' yang bisa melihat komponen ini
  if (authUser?.role !== "admin") return null;

  return (
    <div className="col-span-3 lg:col-span-3 block">
      <div className="bg-[#FFFFFF] rounded-lg shadow-md p-4 border border-[#D7D7D7]">
        {/* 🔹 Header */}
        <h2 className="text-base font-bold text-gray-800 text-center mb-2">
          Daftar Warga Terverifikasi
        </h2>
        <p className="text-sm text-[#525252] text-center mb-3">
          Total:{" "}
          <span className="font-semibold text-[#3FA3CE]">
            {allUsers?.length || "Error"}
          </span>{" "}
          Users
        </p>
        {/* 🔥 Button to User Management */}
        <button
          onClick={() => navigate("/dashboardadmin")}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition"
        >
          Kelola Pengguna
        </button>

        {/* 🔥 List of Users */}
        <div className="space-y-2">
          {allUsers?.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 bg-[#F4F4F4] p-2 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              {/* 🔹 Profile Picture */}
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full border border-[#A8A8A8] hover:scale-105 transition"
              />

              {/* 🔹 User Details */}
              <div className="flex-1">
                <p className="text-md font-semibold text-[#2B7A98] leading-tight">
                  {user.name}
                </p>
                <p className="text-sm text-[#3E3E3E] flex items-center gap-1 leading-tight">
                  <User size={14} /> {user.username}
                </p>
                <p className="text-sm text-[#828282] leading-tight">
                  {user.connections.length > 0 ? (
                    <span>{user.connections.length} Koneksi</span>
                  ) : (
                    <span className="text-[#CCCCCC]">Belum Ada Koneksi</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerifiedUsers;
