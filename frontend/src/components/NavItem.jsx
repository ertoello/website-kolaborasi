import { Link } from "react-router-dom";

export default function NavItem({ to, icon, label, sidebarOpen, hasBadge }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center py-3 px-4 rounded-md hover:bg-primary hover:text-white transition-all relative"
      >
        {icon}
        {sidebarOpen && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
}
