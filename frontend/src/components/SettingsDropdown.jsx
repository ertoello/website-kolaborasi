import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, LogOut, Edit } from "lucide-react";

export default function SettingsDropdown({ onLogout, sidebarOpen }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="flex items-center py-2 px-4 w-full rounded-md bg-gray-200 transition-colors mt-2"
      >
        <Settings size={20} />
        {sidebarOpen && <span className="ml-3">Settings</span>}
      </button>

      {settingsOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-md p-2">
          <Link
            to="/edit-profile"
            className="block px-4 py-2 hover:bg-gray-200 rounded-md"
          >
            <Edit size={16} className="inline-block mr-2" /> Edit Profile
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
          >
            <LogOut size={16} className="inline-block mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
