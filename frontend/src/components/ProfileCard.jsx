import { Link } from "react-router-dom";
import OnlineStatus from "./OnlineStatus";

export default function ProfileCard({ user, sidebarOpen }) {
  return (
    <div className="p-4 text-center relative">
      <div
        className="h-16 rounded-t-lg bg-cover bg-center"
        style={{ backgroundImage: `url("${user.bannerImg || "/banner.png"}")` }}
      />
      <Link to={`/profile/${user.username}`} className="relative block">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-20 h-20 rounded-full mx-auto mt-[-40px] border-4 border-white shadow-lg transition-transform transform hover:scale-105"
        />
        <OnlineStatus />
      </Link>
      {sidebarOpen && (
        <>
          <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
          <p className="text-info">{user.headline}</p>
          <p className="text-info text-xs">
            {user.connections.length} connections
          </p>
        </>
      )}
    </div>
  );
}
