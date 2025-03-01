import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Search, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

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

  const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-3">
        {/* Logo dan Search Bar */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img className="h-10 rounded-full" src="/logopanjang.png" alt="Kolaborasi" />
          </Link>
          <div className="relative w-64 md:w-96">
            <input
              type="text"
              placeholder="Cari komunitas, ide, inovasi..."
              className="w-full bg-gray-100 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute top-2 right-3 text-gray-500" size={20} />
          </div>
        </div>
        {/* Navigasi Ikon */}
        <div className="flex items-center gap-6">
          {authUser ? (
            <>
              <Link to="/" className="nav-icon">
                <Home size={24} />
              </Link>
              <Link to="/network" className="nav-icon relative">
                <Users size={24} />
                {unreadConnectionRequestsCount > 0 && (
                  <span className="badge">{unreadConnectionRequestsCount}</span>
                )}
              </Link>
              <Link to="/messages" className="nav-icon">
                <MessageCircle size={24} />
              </Link>
              <div className="relative">
                <Link
                  to="/notifications"
                  className="nav-icon hover:text-blue-500 transition-all duration-300"
                >
                  <Bell size={26} />
                </Link>
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
              <Link to={`/profile/${authUser.username}`} className="nav-icon">
                <User size={24} />
              </Link>
              <button onClick={() => logout()} className="nav-icon">
                <LogOut size={24} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/signup" className="btn-secondary">Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
