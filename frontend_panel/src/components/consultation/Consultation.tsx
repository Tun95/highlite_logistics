// components/consultations/Consultation.tsx
import { useEffect, useState } from "react";
import { useTheme } from "../../custom hooks/Hooks";
import { toast } from "sonner";
import { Filter, Search, MessageSquare } from "lucide-react";
import { useAppContext } from "../../custom hooks/Hooks";
import { consultationAdminService } from "../../services/consultationService";
import {
  Consultation as ConsultationType,
  AdminConsultationFilters,
  ConsultationStatus,
  ConsultationService,
  ConsultationStats,
} from "../../types/consultation/consultation.types";
import ConsultationsTable from "./table/ConsultationsTable";
import ConsultationDetailSidebar from "./details/ConsultationDetailSidebar";
import SendMessageModal from "./modal/SendMessageModal";

interface FilterState {
  search: string;
  service: string;
  status: string;
}

function Consultation() {
  const { theme } = useTheme();
  const { state } = useAppContext();
  const currentUser = state.userInfo;

  const [consultations, setConsultations] = useState<ConsultationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null,
  ); // Track which consultation is updating status
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track which consultation is being deleted
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [pageLimit] = useState(20);
  const [stats, setStats] = useState<ConsultationStats>({});

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    service: "all",
    status: "all",
  });

  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalSending, setModalSending] = useState(false); // For modal send button

  // Check if current user is admin/editor
  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "editor";

  useEffect(() => {
    fetchConsultations(1);
  }, []);

  const fetchConsultations = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: AdminConsultationFilters = {
        page,
        limit: pageLimit,
      };

      if (filters.search) apiFilters.search = filters.search;
      if (filters.service && filters.service !== "all") {
        apiFilters.service = filters.service as ConsultationService;
      }
      if (filters.status && filters.status !== "all") {
        apiFilters.status = filters.status as ConsultationStatus;
      }

      const response =
        await consultationAdminService.getAllConsultations(apiFilters);

      setConsultations(response.data.consultations);
      setCurrentPage(response.data.pagination.current_page);
      setTotalConsultations(response.data.pagination.total_items);
      setStats(response.data.stats || {});
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch consultations";
      setError(errorMessage);
      console.error("Error fetching consultations:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchConsultations(1);
  }, [filters]);

  const handleSearchChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleServiceChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, service: value }));
  };

  const handleStatusChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    fetchConsultations(page);
  };

  const handleConsultationUpdate = (
    updatedConsultation: ConsultationType,
  ): void => {
    setConsultations((prev) =>
      prev.map((consultation) =>
        consultation._id === updatedConsultation._id
          ? updatedConsultation
          : consultation,
      ),
    );
    if (
      selectedConsultation &&
      selectedConsultation._id === updatedConsultation._id
    ) {
      setSelectedConsultation(updatedConsultation);
    }
  };

  const handleRowClick = (consultation: ConsultationType): void => {
    setSelectedConsultation(consultation);
  };

  const handleCloseSidebar = (): void => {
    setSelectedConsultation(null);
  };

  const handleClearAllFilters = (): void => {
    setFilters({
      search: "",
      service: "all",
      status: "all",
    });
  };

  const handleStatusUpdate = async (
    consultationId: string,
    status: string,
    adminNotes?: string,
  ) => {
    try {
      setStatusUpdateLoading(consultationId);
      const response = await consultationAdminService.updateStatus(
        consultationId,
        {
          status: status as ConsultationStatus,
          admin_notes: adminNotes,
        },
      );
      handleConsultationUpdate(response.data.consultation);
      toast.success(`Status updated to ${status} successfully!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleSendMessage = async (consultationId: string, message: string) => {
    try {
      setModalSending(true);
      const response = await consultationAdminService.sendAdminMessage(
        consultationId,
        { message },
      );
      handleConsultationUpdate(response.data.consultation);
      toast.success("Message sent successfully!");
      setShowMessageModal(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setModalSending(false);
    }
  };

  const handleDeleteConsultation = async (consultationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this consultation? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(consultationId);
      await consultationAdminService.deleteConsultation(consultationId);
      setConsultations((prev) =>
        prev.filter((consultation) => consultation._id !== consultationId),
      );
      if (selectedConsultation && selectedConsultation._id === consultationId) {
        setSelectedConsultation(null);
      }
      setTotalConsultations((prev) => prev - 1);
      toast.success("Consultation deleted successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete consultation";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRetry = (): void => {
    fetchConsultations(currentPage);
  };

  // Get service icon
  const getServiceIcon = (service: ConsultationService): string => {
    switch (service) {
      case "Web Development":
        return "💻";
      case "Mobile App Development":
        return "📱";
      case "UI/UX Design":
        return "🎨";
      case "Software Consulting":
        return "💼";
      case "Digital Transformation":
        return "🔄";
      case "Custom Software":
        return "⚙️";
      default:
        return "📋";
    }
  };

  // Replace the error section in Consultation.tsx with this:
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div
          className={`w-full max-w-md rounded-xl p-6 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-red-900/20" : "bg-red-50"}`}
            >
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
            Failed to Load Data
          </h3>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
            There was an issue loading consultations
          </p>

          {/* Error Details Box */}
          <div
            className={`mb-6 p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-600 dark:text-red-400 font-medium">
                Error:
              </span>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {error}
              </span>
            </div>
          </div>

          {/* Retry Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRetry}
              className="h-10 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      {/* Header with Stats */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Consultations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage client consultation requests. Total: {totalConsultations}{" "}
              requests
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 flex items-center gap-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Send Message Button */}
            {selectedConsultation && (
              <button
                onClick={() => setShowMessageModal(true)}
                className="h-10 flex items-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare size={18} />
                Send Message
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              status: "pending" as const,
              label: "Pending",
              color:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            },
            {
              status: "reviewed" as const,
              label: "Reviewed",
              color:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            },
            {
              status: "approved" as const,
              label: "Approved",
              color:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            },
            {
              status: "rejected" as const,
              label: "Rejected",
              color:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            },
            {
              status: "contacted" as const,
              label: "Contacted",
              color:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            },
          ].map((stat) => (
            <div key={stat.status} className={`p-3 rounded-lg ${stat.color}`}>
              <div className="text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold">
                {stats[stat.status] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Consultations
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name, email, company, or ID..."
                  className="w-full h-10 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service
              </label>
              <select
                value={filters.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Software Consulting">Software Consulting</option>
                <option value="Digital Transformation">
                  Digital Transformation
                </option>
                <option value="Custom Software">Custom Software</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="contacted">Contacted</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.search ||
            filters.service !== "all" ||
            filters.status !== "all") && (
            <div className="mt-4">
              <button
                onClick={handleClearAllFilters}
                className="h-10 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Consultations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ConsultationsTable
          consultations={consultations}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onConsultationClick={handleRowClick}
          loading={loading}
          totalConsultations={totalConsultations}
          pageLimit={pageLimit}
          onStatusUpdate={handleStatusUpdate}
          onSendMessage={handleSendMessage}
          onDelete={handleDeleteConsultation}
          isAdmin={isAdmin}
          getServiceIcon={getServiceIcon}
          statusUpdateLoading={statusUpdateLoading}
          deleteLoading={deleteLoading}
        />
      </div>

      {/* Consultation Detail Sidebar */}
      {selectedConsultation && (
        <ConsultationDetailSidebar
          consultation={selectedConsultation}
          currentPage={currentPage}
          fetchConsultations={fetchConsultations}
          onClose={handleCloseSidebar}
          onConsultationUpdate={handleConsultationUpdate}
          isAdmin={isAdmin}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteConsultation}
          onSendMessage={handleSendMessage}
          onOpenMessageModal={() => setShowMessageModal(true)}
          statusUpdateLoading={statusUpdateLoading === selectedConsultation._id}
          deleteLoading={deleteLoading === selectedConsultation._id}
        />
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedConsultation && (
        <SendMessageModal
          consultation={selectedConsultation}
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
          loading={modalSending}
        />
      )}
    </div>
  );
}

export default Consultation;
