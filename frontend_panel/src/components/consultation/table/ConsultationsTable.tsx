// components/consultations/table/ConsultationsTable.tsx
import { Pagination } from "antd";
import {
  Loader,
  Mail,
  Building,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Phone,
} from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import {
  Consultation,
  ConsultationStatus,
  ConsultationService,
} from "../../../types/consultation/consultation.types";
import { formatDate } from "../../../utilities/utils/Utils";

interface ConsultationsTableProps {
  consultations: Consultation[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onConsultationClick: (consultation: Consultation) => void;
  loading: boolean;
  totalConsultations?: number;
  pageLimit?: number;
  onStatusUpdate: (
    consultationId: string,
    status: ConsultationStatus,
    adminNotes?: string,
  ) => void;
  onSendMessage: (consultationId: string, message: string) => void;
  onDelete: (consultationId: string) => void;
  isAdmin?: boolean;
  getServiceIcon: (service: ConsultationService) => string;
  statusUpdateLoading?: string | null; // Add this
  deleteLoading?: string | null; // Add this
}

function ConsultationsTable({
  consultations,
  currentPage,
  onPageChange,
  onConsultationClick,
  loading,
  totalConsultations = 0,
  pageLimit = 20,
  onStatusUpdate,
  onSendMessage,
  onDelete,
  isAdmin = false,
  getServiceIcon,
}: ConsultationsTableProps) {
  const { theme } = useTheme();

  // Get status color
  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "contacted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-3 h-3" />;
      case "reviewed":
        return <Clock className="w-3 h-3" />;
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      case "contacted":
        return <MessageSquare className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Get status text
  const getStatusText = (status: ConsultationStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "No message";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle row click
  const handleRowClick = (consultation: Consultation, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isActionButton =
      target.closest("button") ||
      target.closest(".action-button") ||
      target.tagName === "BUTTON";

    if (!isActionButton) {
      onConsultationClick(consultation);
    }
  };

  // Handle action button click
  const handleActionClick = (
    consultation: Consultation,
    action: "view" | "message" | "approve" | "reject" | "delete",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    if (action === "view") {
      onConsultationClick(consultation);
    } else if (action === "message") {
      onSendMessage(consultation._id, "Follow-up message");
    } else if (action === "approve") {
      onStatusUpdate(
        consultation._id,
        "approved",
        "Auto-approved via quick action",
      );
    } else if (action === "reject") {
      onStatusUpdate(
        consultation._id,
        "rejected",
        "Auto-rejected via quick action",
      );
    } else if (action === "delete") {
      onDelete(consultation._id);
    }
  };

  return (
    <div className="w-full">
      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading consultations...
          </p>
        </div>
      ) : (
        <div
          className={`rounded-xl overflow-hidden border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`${
                      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                    } border-b border-gray-200 dark:border-gray-700`}
                  >
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Client
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Service & Budget
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Message
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Status & Date
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No consultations found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                            No consultation requests match your current filters.
                            Try adjusting your search criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    consultations.map((consultation) => (
                      <tr
                        key={consultation._id}
                        className={`border-b border-gray-200 dark:border-gray-700 hover:${
                          theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                        } transition-colors cursor-pointer`}
                        onClick={(e) => handleRowClick(consultation, e)}
                      >
                        <td className="p-4">
                          <div className="max-w-xs">
                            <div className="font-medium text-gray-900 dark:text-white mb-1">
                              {consultation.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <Mail className="w-3 h-3" />
                              {consultation.email}
                            </div>
                            {consultation.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <Phone className="w-3 h-3" />
                                {consultation.phone}
                              </div>
                            )}
                            {consultation.company && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Building className="w-3 h-3" />
                                {consultation.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {getServiceIcon(consultation.service)}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {consultation.service}
                              </span>
                            </div>
                            {consultation.budget && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Budget:</span>{" "}
                                {consultation.budget}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {truncateText(consultation.message, 120)}
                          </p>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            ID: {consultation.consultation_id}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}
                            >
                              {getStatusIcon(consultation.status)}
                              {getStatusText(consultation.status)}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {formatDate(consultation.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 action-button">
                            <button
                              onClick={(e) =>
                                handleActionClick(consultation, "view", e)
                              }
                              className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {isAdmin && (
                              <button
                                onClick={(e) =>
                                  handleActionClick(consultation, "delete", e)
                                }
                                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {consultations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No consultations found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    No consultation requests match your current filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {consultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className={`border rounded-lg p-4 ${
                      theme === "dark"
                        ? "border-gray-700 hover:bg-gray-700/50"
                        : "border-gray-200 hover:bg-gray-50"
                    } transition-colors cursor-pointer`}
                    onClick={(e) => handleRowClick(consultation, e)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(consultation.status)}`}
                          >
                            {getStatusIcon(consultation.status)}
                            {getStatusText(consultation.status)}
                          </span>
                          <span className="text-lg">
                            {getServiceIcon(consultation.service)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {consultation.name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {consultation.email}
                          </p>
                          {consultation.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {consultation.phone}
                            </p>
                          )}
                          {consultation.company && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {consultation.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 action-button">
                        <button
                          onClick={(e) =>
                            handleActionClick(consultation, "view", e)
                          }
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={(e) =>
                              handleActionClick(consultation, "delete", e)
                            }
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Service & Budget */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {consultation.service}
                      </div>
                      {consultation.budget && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Budget:</span>{" "}
                          {consultation.budget}
                        </div>
                      )}
                    </div>

                    {/* Message Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {truncateText(consultation.message, 200)}
                      </p>
                    </div>

                    {/* Date & ID */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(consultation.createdAt)}</span>
                      </div>
                      <div className="text-xs font-mono">
                        ID: {consultation.consultation_id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {consultations.length > 0 && totalConsultations > pageLimit && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(currentPage - 1) * pageLimit + 1} to{" "}
                  {Math.min(currentPage * pageLimit, totalConsultations)} of{" "}
                  {totalConsultations} requests
                </div>
                <Pagination
                  current={currentPage}
                  pageSize={pageLimit}
                  total={totalConsultations}
                  onChange={onPageChange}
                  showSizeChanger={false}
                  showLessItems
                  className={`pagination-custom ${
                    theme === "dark"
                      ? "dark-pagination [&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-white [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item:hover]:bg-gray-600 [&_.ant-pagination-item-active:hover]:bg-blue-700 [&_.ant-pagination-prev_button]:text-white [&_.ant-pagination-next_button]:text-white [&_.ant-pagination-disabled_button]:text-gray-500 [&_.ant-pagination-jump-next]:text-white [&_.ant-pagination-jump-prev]:text-white"
                      : "[&_.ant-pagination-item:hover]:bg-gray-100 [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item-active:hover]:bg-blue-700"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsultationsTable;
