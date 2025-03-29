import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ sidebarOpen }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center py-2 px-4 w-full rounded-md bg-gray-200 dark:bg-gray-800 dark:text-white transition-colors"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      {sidebarOpen && (
        <span className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
}
