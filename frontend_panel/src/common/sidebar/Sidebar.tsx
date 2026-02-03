// components/sidebar/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Handshake, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../../custom hooks/Hooks";
import logo from "../../assets/logo.png";

interface SidebarProps {
  onClose?: () => void;
  mobileVersion?: boolean;
}

const Sidebar = ({ onClose, mobileVersion = false }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Main menu items for HighLite Logistics
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Handshake,
      label: "Consultations",
      path: "/consultations",
    },
  ];

  const handleLogout = () => {
    try {
      // Show success message
      toast.success("You have been logged out successfully");

      // Redirect to login page
      navigate("/login");

      // Close sidebar if mobile
      if (mobileVersion && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div
      className={`h-screen w-72 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/95 border-r border-gray-200/50 dark:border-gray-700 transition-all z-40 flex flex-col backdrop-blur-sm ${
        mobileVersion
          ? "fixed left-0 top-0 shadow-2xl"
          : "sticky top-0 hidden lg:flex"
      }`}
    >
      {/* Header with Logo and Brand */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-700 flex-shrink-0 dark:bg-gray-800">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
          onClick={mobileVersion ? onClose : undefined}
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
          <div>
            <div className="flex items-baseline gap-2">
              <h1
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-primary-400" : "text-primary-700"
                }`}
              >
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

        {/* Close button for mobile */}
        {mobileVersion && onClose && (
          <button
            onClick={onClose}
            className="relative left-2 w-8 min-w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1.5">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Main Menu
            </p>
          </div>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={mobileVersion ? onClose : undefined}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-800"
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                      }
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section - User Info & Logout */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 flex-shrink-0">
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-primary-50/50 dark:from-gray-800/50 dark:to-primary-900/10 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">
                  TA
                </span>
              </div>
            </div>
            {/* Online status */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              Tunji Akande
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              tunji@highlitelogistics.com
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
              admin
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group"
        >
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
            <LogOut size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
