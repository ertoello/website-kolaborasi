import { useState } from "react";
import {
  Home,
  UserPlus,
  Bell,
  MessageCircle,
} from "lucide-react";
import ProfileCard from "./ProfileCard";
import NavItem from "./NavItem";
import SettingsDropdown from "./SettingsDropdown";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar({ user, onLogout }) {
  const [sidebarOpen] = useState(true);
  const [setRefreshing] = useState(false);

  const refreshSidebar = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div
      className={`bg-secondary transition-all duration-300 rounded-lg shadow-lg ${
        sidebarOpen ? "w-72" : "w-20"
      } min-h-screen h-auto flex flex-col`}
    >
      {/* Profile Card */}
      <ProfileCard user={user} sidebarOpen={sidebarOpen} />

      {/* Navigation Links */}
      <nav className="border-t border-base-100 p-4">
        <ul className="space-y-2">
          <NavItem
            to="/"
            icon={<Home size={20} />}
            label="Home"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            to="/network"
            icon={<UserPlus size={20} />}
            label="My Network"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            to="/notifications"
            icon={<Bell size={20} />}
            label="Notifications"
            sidebarOpen={sidebarOpen}
            hasBadge
          />
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-base-100 p-4">
        <ThemeToggle sidebarOpen={sidebarOpen} />
        <SettingsDropdown onLogout={onLogout} sidebarOpen={sidebarOpen} />
        <button className="mt-3 flex items-center py-2 px-4 w-full rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
          <MessageCircle size={20} />
          {sidebarOpen && <span className="ml-3">Open Chat</span>}
        </button>
      </div>
    </div>
  );
}
