// components/navbar/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Moon, Sun, ChevronDown, Menu, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import user_image from "../../assets/users.png";
import Sidebar from "../sidebar/Sidebar";
import { useTheme } from "../../custom hooks/Hooks";
import logo from "../../assets/logo.png";

function Navbar() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      // Show success message
      toast.success("You have been logged out successfully");

      // Redirect to login page
      navigate("/login");

      // Close dropdown if open
      setShowProfileDropdown(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      <header className="header sticky top-0 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all z-20">
        {/* Left section: HighLite Logo */}
        <div className="flex items-center gap-4 md:gap-6 pr-3 lg:hidden">
          {/* Header with Logo and Brand */}
          <div className="flex items-center justify-between h-16 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
            >
              <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-500"></div>
                <img
                  src={logo}
                  alt="HighLite Logistics"
                  className={`relative h-12 w-12 min-w-12 p-2 object-contain rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-300 dark:to-gray-500 border border-gray-200/50 dark:border-gray-700/50 group-hover:scale-105 transition-all duration-300`}
                />
              </div>
              <div className="max-380px:hidden">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">
                    HighLite
                  </h1>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Logistics
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div></div>

        {/* Right section: Theme toggle, profile, and mobile menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
            <img
              src={user_image}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
            />

            {/* Desktop Profile Dropdown */}
            <div
              className="hidden lg:flex items-center gap-2 relative"
              ref={profileRef}
            >
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Tunji Akande
                </p>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 dark:text-gray-400 transition-transform ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
                  <div className="p-1">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Tunji Akande
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        tunji@highlitelogistics.com
                      </p>
                      <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        admin
                      </p>
                    </div>

                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/consultations"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Consultations
                    </NavLink>

                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed lg:hidden z-40 transition-transform duration-300 ease-in-out inset-y-0 left-0">
          <Sidebar onClose={() => setMobileSidebarOpen(false)} mobileVersion />
        </div>
      )}
    </>
  );
}

export default Navbar;
