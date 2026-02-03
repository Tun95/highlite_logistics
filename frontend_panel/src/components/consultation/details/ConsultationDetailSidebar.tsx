// components/consultations/details/ConsultationDetailSidebar.tsx
import {
  X,
  Save,
  Mail,
  Phone,
  Building,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Consultation,
  UpdateConsultationData,
  ConsultationStatus,
} from "../../../types/consultation/consultation.types";
import { formatDate, formatDateTime } from "../../../utilities/utils/Utils";
import { consultationAdminService } from "../../../services/consultationService";

interface ConsultationDetailSidebarProps {
  consultation: Consultation;
  currentPage?: number;
  fetchConsultations?: (page?: number) => Promise<void>;
  onClose: () => void;
  onConsultationUpdate?: (consultation: Consultation) => void;
  isAdmin: boolean;
  onStatusUpdate: (
    consultationId: string,
    status: ConsultationStatus,
    adminNotes?: string,
  ) => void;
  onDelete: (consultationId: string) => void;
  onSendMessage: (consultationId: string, message: string) => void;
  onOpenMessageModal?: () => void;
  statusUpdateLoading?: boolean;
  deleteLoading?: boolean;
}

function ConsultationDetailSidebar({
  consultation,
  onClose,
  currentPage,
  fetchConsultations,
  onConsultationUpdate,
  isAdmin,
  onStatusUpdate,
  onDelete,
  onSendMessage,
  onOpenMessageModal,
  statusUpdateLoading = false,
  deleteLoading = false,
}: ConsultationDetailSidebarProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAdminNotes, setShowAdminNotes] = useState(true);
  const [showAdminMessages, setShowAdminMessages] = useState(true);
  const [newAdminNotes, setNewAdminNotes] = useState(
    consultation.admin_notes || "",
  );
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");

  // Reset state when consultation prop changes
  useEffect(() => {
    setShowDeleteConfirm(false);
    setNewAdminNotes(consultation.admin_notes || "");
    setStatusUpdateNotes("");
  }, [consultation]);

  // Determine which status buttons should be disabled
  const getStatusButtonState = (status: ConsultationStatus) => {
    const currentStatus = consultation.status;

    // If already in this status, disable the button
    if (currentStatus === status) {
      return { disabled: true, hidden: false };
    }

    // Status flow logic:
    // - From pending: can go to reviewed, contacted, approved, rejected
    // - From reviewed: can go to contacted, approved, rejected
    // - From contacted: can go to approved, rejected
    // - From approved/rejected: no further status changes
    const allowedTransitions: Record<ConsultationStatus, ConsultationStatus[]> =
      {
        pending: ["reviewed", "contacted", "approved", "rejected"],
        reviewed: ["contacted", "approved", "rejected"],
        contacted: ["approved", "rejected"],
        approved: [], // No further changes from approved
        rejected: [], // No further changes from rejected
      };

    const canTransition =
      allowedTransitions[currentStatus]?.includes(status) || false;

    return {
      disabled: !canTransition,
      hidden: !canTransition && status !== currentStatus,
    };
  };

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
        return <AlertCircle className="w-4 h-4" />;
      case "reviewed":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "contacted":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get status text
  const getStatusText = (status: ConsultationStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get service icon
  const getServiceIcon = (service: string) => {
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

  // Save admin notes
  const handleSaveAdminNotes = async () => {
    try {
      setLoading(true);

      const updateData: UpdateConsultationData = {
        admin_notes: newAdminNotes,
      };

      const response = await consultationAdminService.updateConsultation(
        consultation._id,
        updateData,
      );

      if (onConsultationUpdate) {
        onConsultationUpdate(response.data.consultation);
      }

      if (fetchConsultations && currentPage) {
        await fetchConsultations(currentPage);
      }

      toast.success("Admin notes updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating admin notes:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update admin notes";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: ConsultationStatus) => {
    if (!newStatus) return;

    try {
      await onStatusUpdate(consultation._id, newStatus, statusUpdateNotes);
      setStatusUpdateNotes("");
      if (fetchConsultations && currentPage) {
        await fetchConsultations(currentPage);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  // Handle send message - updated to use modal
  const handleSendMessage = () => {
    if (onOpenMessageModal) {
      onOpenMessageModal();
    } else {
      // Fallback to prompt if parent doesn't provide modal control
      const message = prompt("Enter your message to the client:");
      if (message) {
        onSendMessage(consultation._id, message);
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await onDelete(consultation._id);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete consultation";
      toast.error(errorMessage);
    }
  };

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard
      .writeText(consultation.email)
      .then(() => toast.success("Email copied to clipboard!"))
      .catch(() => toast.error("Failed to copy email"));
  };

  // Copy consultation ID
  const copyConsultationId = () => {
    navigator.clipboard
      .writeText(consultation.consultation_id)
      .then(() => toast.success("Consultation ID copied to clipboard!"))
      .catch(() => toast.error("Failed to copy ID"));
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-y-0 right-0 pointer-events-auto">
        <div
          className={`w-96 h-full shadow-xl max-w-[480px] transition-transform duration-200 ease-in-out flex flex-col ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } max-480px:w-full border-l border-gray-200 dark:border-gray-700`}
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-6 py-4 h-16 border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Consultation Details</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendMessage}
                  disabled={statusUpdateLoading || deleteLoading}
                  className={`h-8 px-3 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Status & Quick Actions */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}
                >
                  {getStatusIcon(consultation.status)}
                  {getStatusText(consultation.status)}
                </span>
                <button
                  onClick={copyConsultationId}
                  className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Copy ID
                </button>
              </div>

              {/* Status Update Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "pending",
                      "reviewed",
                      "approved",
                      "rejected",
                      "contacted",
                    ] as ConsultationStatus[]
                  ).map((status) => {
                    const buttonState = getStatusButtonState(status);
                    if (buttonState.hidden) return null;

                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={statusUpdateLoading || buttonState.disabled}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          consultation.status === status
                            ? getStatusColor(status)
                            : theme === "dark"
                              ? "bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                      >
                        {statusUpdateLoading &&
                        consultation.status !== status ? (
                          <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {getStatusIcon(status)}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={statusUpdateNotes}
                  onChange={(e) => setStatusUpdateNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes for status update (optional)"
                />
              </div>
            </div>

            {/* Client Information */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                Client Information
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {consultation.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span>{consultation.email}</span>
                      <button
                        onClick={copyEmail}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {consultation.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {consultation.phone}
                      </span>
                    </div>
                  )}
                  {consultation.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {consultation.company}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                Project Details
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Service
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {getServiceIcon(consultation.service)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {consultation.service}
                    </span>
                  </div>
                </div>

                {consultation.budget && (
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Budget
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {consultation.budget}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Project Description
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {consultation.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowAdminNotes(!showAdminNotes)}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Admin Notes
                </h4>
                {showAdminNotes ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {showAdminNotes && (
                <div className="space-y-4">
                  <textarea
                    value={newAdminNotes}
                    onChange={(e) => setNewAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add internal notes about this consultation..."
                  />
                  <button
                    onClick={handleSaveAdminNotes}
                    disabled={loading || statusUpdateLoading || deleteLoading}
                    className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Notes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Admin Messages */}
            {consultation.admin_messages &&
              consultation.admin_messages.length > 0 && (
                <div
                  className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                >
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowAdminMessages(!showAdminMessages)}
                  >
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Admin Messages ({consultation.admin_messages.length})
                    </h4>
                    {showAdminMessages ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>

                  {showAdminMessages && (
                    <div className="space-y-4">
                      {consultation.admin_messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            theme === "dark" ? "bg-gray-800" : "bg-blue-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Message #{index + 1}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(msg.sent_at)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {msg.message}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Sent via: {msg.sent_via}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Meta Information */}
            <div
              className={`p-6 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                Additional Information
              </h4>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted
                  </span>
                  <span className="font-medium">
                    {formatDateTime(consultation.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="font-medium">
                    {formatDateTime(consultation.updatedAt)}
                  </span>
                </div>

                {consultation.last_status_change && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last Status Change
                    </span>
                    <span className="font-medium">
                      {formatDate(consultation.last_status_change)}
                    </span>
                  </div>
                )}

                {consultation.last_contacted && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last Contacted
                    </span>
                    <span className="font-medium">
                      {formatDate(consultation.last_contacted)}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Consultation ID
                  </span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {consultation.consultation_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed */}
          <div className="flex-shrink-0">
            <div
              className={`p-6 border-t ${
                theme === "dark"
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              {showDeleteConfirm ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                      Are you sure you want to delete this consultation? This
                      action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteLoading}
                      className="flex-1 h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="flex-1 h-10 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  {/* Send Message Action */}
                  <button
                    onClick={handleSendMessage}
                    disabled={statusUpdateLoading || deleteLoading}
                    className="flex-1 h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>

                  {/* Admin Delete Action */}
                  {isAdmin && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={statusUpdateLoading || deleteLoading}
                      className="h-10 px-4 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 col-span-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationDetailSidebar;
