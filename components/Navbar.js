import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed bottom-0 w-full flex justify-around bg-gray-100 p-3 border-t">
      {["dashboard", "devices", "logs", "alerts", "reports", "users"].map((tab) => (
        <NavLink
          key={tab}
          to={`/${tab}`}
          className={({ isActive }) =>
            `text-sm ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
          }
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </NavLink>
      ))}
    </div>
  );
}
