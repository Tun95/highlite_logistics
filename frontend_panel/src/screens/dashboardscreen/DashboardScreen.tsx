import { Helmet } from "react-helmet-async";
import Sidebar from "../../common/sidebar/Sidebar";
import Navbar from "../../common/navbar/Navbar";
import CryptoAdminDashboard from "../../components/dashboard/CryptoAdminDashboard";

function DashboardScreen() {
  return (
    <div>
      <Helmet>
        <title>Crypto Dashboard | HighLite Logistics</title>
      </Helmet>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
        {/* Sidebar - hidden on screens smaller than 900px */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="px-2 flex-1 max-480px:p-0">
            <CryptoAdminDashboard />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
