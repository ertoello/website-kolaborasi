import React from "react";
import { Handshake, FileText, Users, Star, PlusCircle } from "lucide-react";

const MobileBottomNavbar = ({ onLeftSidebarToggle, onRightSidebarToggle, setShowMobilePost }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#3FA3CE] shadow-md border-t flex justify-around items-center p-1 lg:hidden z-40">
      <button
        onClick={onLeftSidebarToggle}
        className="flex flex-col items-center text-sm text-gray-700"
      >
        <div className="flex items-center">
          <FileText className="w-6 h-6" />
          <Handshake className="w-6 h-6" />
        </div>
        <span className="mt-1 text-xs">Syarat Berkolaborasi</span>
      </button>

      {/* New Post Button */}
      <button onClick={() => setShowMobilePost(true)} className="...">
        <PlusCircle className="w-6 h-6" />
        <span className="text-xs">Posting</span>
      </button>

      <button
        onClick={onRightSidebarToggle}
        className="flex flex-col items-center text-sm text-gray-700"
      >
        <div className="flex items-center">
          <Users className="w-6 h-6" />
          <Star className="w-6 h-6" />
        </div>
        <span className="mt-1 text-xs">Rekomendasi Teman</span>
      </button>
    </div>
  );
};

export default MobileBottomNavbar;
