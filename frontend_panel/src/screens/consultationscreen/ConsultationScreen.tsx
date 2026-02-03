// screens/ConsultationScreen.tsx
import { Helmet } from "react-helmet-async";
import Sidebar from "../../common/sidebar/Sidebar";
import Navbar from "../../common/navbar/Navbar";
import Consultation from "../../components/consultation/Consultation";

function ConsultationScreen() {
  return (
    <div>
      <Helmet>
        <title>Consultations | BuilditLab Admin</title>
        <meta name="description" content="Manage client consultation requests and communication" />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
        {/* Sidebar - hidden on screens smaller than 900px */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          <Navbar />
          <main className="flex-1 p-8 max-900px:p-4 max-480px:p-2">
            <Consultation />
          </main>
        </div>
      </div>
    </div>
  );
}

export default ConsultationScreen;