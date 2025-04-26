import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Home,
  LogOut,
  User,
  Users,
  Search,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import LogoutModal from "./LogoutModal"; // Import komponen modal logout
import MobileNavbar from "./MobileNavbar"; // Import komponen

const Navbar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    initialData: null, // Bisa juga diisi dengan data default dari localStorage
  });

  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fungsi pencarian
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axiosInstance.get(
          `/users/search?query=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { data: unreadMessagesCount } = useQuery({
    queryKey: ["unreadMessagesCount"],
    queryFn: async () => {
      const response = await axiosInstance.get("/notifications/count/message");
      return response.data;
    },
    enabled: !!authUser,
  });

  const allowedTypes = ["like", "comment", "connectionAccepted"];

  const unreadNotificationCount = notifications?.data?.filter(
    (notif) => !notif.read && allowedTypes.includes(notif.type)
  )?.length;


  const unreadConnectionRequestsCount = connectionRequests?.data?.length;
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-around items-center py-3">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <img
              className="h-10 rounded-full"
              src="/logopanjang1.png"
              alt="Kolaborasi"
            />
          </Link>
        </div>

        {/* Navigasi Ikon */}
        <div className="flex items-center justify-end w-full md:px-6">
          {authUser ? (
            <>
              {/* Search Bar dan Navigasi */}
              <div className="flex items-center gap-6 mx-auto">
                <div className="relative w-auto md:w-80">
                  <input
                    type="text"
                    placeholder="Cari komunitas, ide, inovasi..."
                    className="w-full bg-gray-100 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search
                    className="absolute top-2 right-3 text-gray-500 hidden md:flex"
                    size={20}
                  />

                  {searchQuery.length > 2 && (
                    <div className="absolute bg-white shadow-lg w-full rounded-md mt-2 max-h-60 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
                          >
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={user.profilePicture || "/avatar.png"}
                              alt={user.name}
                            />
                            <span>
                              {user.name} (@{user.username})
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2 px-4 py-3 text-gray-600">
                          <XCircle size={20} className="text-gray-400" />
                          <span>Pencarian yang Anda cari tidak ditemukan</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ikon Navigasi */}
                <div className="items-center gap-4 hidden md:flex">
                  <Link to="/" className="nav-icon">
                    <Home size={26} />
                  </Link>
                  <Link to="/network" className="nav-icon relative">
                    <Users size={26} />
                    {unreadConnectionRequestsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadConnectionRequestsCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative">
                    <Link to="/messages" className="nav-icon">
                      <MessageCircle size={26} />
                    </Link>
                    {unreadMessagesCount?.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadMessagesCount.count}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Link to="/notifications" className="nav-icon">
                      <Bell size={26} />
                    </Link>
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <MobileNavbar
                authUser={authUser}
                unreadNotificationCount={unreadNotificationCount}
                unreadConnectionRequestsCount={unreadConnectionRequestsCount}
                unreadMessagesCount={unreadMessagesCount?.count}
              />
              {/* Profil & Logout */}
              <div className="flex items-center md:gap-3">
                {/* Home icon: tampil hanya di mobile */}
                <Link to="/" className="nav-icon block md:hidden">
                  <Home size={26} />
                </Link>
                {/* Profile icon: tampil hanya di desktop */}
                <Link
                  to={`/profile/${authUser.username}`}
                  className="hidden md:block"
                >
                  <img
                    className="h-10 w-10 min-w-[2.5rem] rounded-full object-cover border-2 border-gray-300"
                    src={authUser.profilePicture || "/avatar.png"}
                    alt={authUser.name}
                  />
                </Link>
                <LogoutModal /> {/* Gunakan LogoutModal di sini */}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                {/* Tombol Sign In */}
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 
      ${
        location.pathname === "/login"
          ? "text-white bg-[#3FA3CE] shadow-md" // Jika aktif
          : "text-[#3FA3CE] border-2 border-[#3FA3CE] shadow-sm hover:bg-[#3FA3CE] hover:text-white" // Jika tidak aktif
      }`}
                >
                  <span>Sign In</span>
                </Link>

                {/* Tombol Join Now */}
                <Link
                  to="/signup"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 
      ${
        location.pathname === "/signup"
          ? "text-white bg-gray-400 shadow-md" // Jika aktif
          : "text-gray-700 border-2 border-gray-400 shadow-sm hover:bg-gray-400 hover:text-white" // Jika tidak aktif
      }`}
                >
                  <span>Join Now</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
