import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import {
  Bell,
  Home,
  LogOut,
  User,
  Users,
  Search,
  MessageCircle,
  XCircle,
} from "lucide-react"; // ✅ Tambahkan XCircle
import { useState } from "react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // ✅ Fungsi pencarian
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axiosInstance.get(`/users/search?query=${query}`);
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

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.data?.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-around items-center py-3">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              className="h-10 rounded-full"
              src="/logopanjang.png"
              alt="Kolaborasi"
            />
          </Link>
        </div>

        {/* ✅ Navigasi Ikon */}
        <div className="flex items-center justify-end w-full px-6">
          {authUser ? (
            <>
              {/* ✅ Search Bar dan Navigasi di Tengah */}
              <div className="flex items-center gap-6 mx-auto">
                {/* ✅ Search Bar */}
                <div className="relative w-64 md:w-80">
                  <input
                    type="text"
                    placeholder="Cari komunitas, ide, inovasi..."
                    className="w-full bg-gray-100 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search
                    className="absolute top-2 right-3 text-gray-500"
                    size={20}
                  />

                  {/* ✅ Dropdown hasil pencarian */}
                  {searchQuery.length > 2 && (
                    <div className="absolute bg-white shadow-lg w-full rounded-md mt-2 max-h-60 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="block px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
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

                {/* ✅ Ikon Navigasi */}
                <div className="flex items-center gap-4">
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
                  <Link to="/messages" className="nav-icon">
                    <MessageCircle size={26} />
                  </Link>
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

              {/* ✅ Profil & Logout */}
              <div className="flex items-center gap-4">
                <Link to={`/profile/${authUser.username}`}>
                  <img
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
                    src={authUser.profilePicture || "/avatar.png"}
                    alt={authUser.name}
                  />
                </Link>
                <button onClick={() => logout()} className="nav-icon">
                  <LogOut size={26} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-secondary">
                  Join Now
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
