import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Users, MessageCircle, Bell } from "lucide-react";

const MobileNavbar = ({
  authUser,
  unreadNotificationCount,
  unreadConnectionRequestsCount,
  unreadMessagesCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      {/* Hamburger Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="p-2 relative">
          <Menu size={28} />
          {(unreadNotificationCount > 0 ||
            unreadConnectionRequestsCount > 0 ||
            unreadMessagesCount > 0) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {/* Jumlah total semua notif */}
              {(Number(unreadNotificationCount) || 0) +
                (Number(unreadConnectionRequestsCount) || 0) +
                (Number(unreadMessagesCount) || 0)}
            </span>
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <img
                className="h-10 rounded-full"
                src="/logopanjang1.png"
                alt="Kolaborasi"
              />
            </Link>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <Link
            to="/network"
            className="flex items-center gap-2 relative"
            onClick={() => setIsOpen(false)}
          >
            <Users size={24} /> Daftar Koneksi Anda
            {unreadConnectionRequestsCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                {unreadConnectionRequestsCount}
              </span>
            )}
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle size={24} /> Forum Diskusi
            {unreadMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                {unreadMessagesCount}
              </span>
            )}
          </Link>
          <Link
            to="/notifications"
            className="flex items-center gap-2 relative"
            onClick={() => setIsOpen(false)}
          >
            <Bell size={24} /> Notifikasi
            {unreadNotificationCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <img
              className="h-8 w-8 rounded-full object-cover border-2 border-gray-300"
              src={authUser?.profilePicture || "/avatar.png"}
              alt={authUser?.name}
            />
            Profil & Portofolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
