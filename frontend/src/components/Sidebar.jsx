import { useState } from "react";
import { Home, UserPlus, Bell, MessageCircle } from "lucide-react";
import ProfileCard from "./ProfileCard";
import NavItem from "./NavItem";
import SettingsDropdown from "./SettingsDropdown";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate(); // Tambahkan ini
  const [sidebarOpen] = useState(true);
  const [setRefreshing] = useState(false);

  const refreshSidebar = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div
      className={`bg-[#78C1E4] transition-all duration-300 rounded-xl shadow-xl  ${
        sidebarOpen ? "w-auto" : "w-20"
      } flex flex-col p-2`}
    >
      {/* Profile Card */}
      <ProfileCard user={user} sidebarOpen={sidebarOpen} />

      {/* Navigation Links */}
      <nav className="border-t border-[#D7D7D7]">
        <ul>
          <NavItem
            to="/"
            icon={<Home size={18} />}
            label="Home"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            to="/network"
            icon={<UserPlus size={18} />}
            label="My Network"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            to="/notifications"
            icon={<Bell size={18} />}
            label="Notifications"
            sidebarOpen={sidebarOpen}
            hasBadge
          />
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#D7D7D7] pt-3 mt-3">
        {/* <ThemeToggle sidebarOpen={sidebarOpen} /> */}
        <SettingsDropdown onLogout={onLogout} sidebarOpen={sidebarOpen} />
        <button
          className="mt-3 flex items-center py-3 px-4 w-full rounded-lg bg-[#3FA3CE] text-white hover:bg-[#145C75] transition-all"
          onClick={() => navigate("/messages")}
        >
          <MessageCircle size={20} />
          {sidebarOpen && <span className="ml-3 text-md">Open Chat</span>}
        </button>
      </div>
    </div>
  );
}
