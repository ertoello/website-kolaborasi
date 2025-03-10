import { useEffect, useState } from "react";

export default function OnlineStatus() {
  const [status, setStatus] = useState(navigator.onLine ? "online" : "offline");

  useEffect(() => {
    window.addEventListener("online", () => setStatus("online"));
    window.addEventListener("offline", () => setStatus("offline"));
  }, []);

  return (
    <span
      className={`absolute bottom-2 right-3 w-4 h-4 rounded-full ${
        status === "online" ? "bg-green-500" : "bg-gray-400"
      } border-2 border-white`}
    />
  );
}
