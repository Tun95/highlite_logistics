// components/consultations/modal/SendMessageModal.tsx
import { X, Send, User, Mail } from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { useState } from "react";
import { Consultation } from "../../../types/consultation/consultation.types";

interface SendMessageModalProps {
  consultation: Consultation;
  onClose: () => void;
  onSend: (consultationId: string, message: string) => Promise<void>;
  loading?: boolean;
}

function SendMessageModal({
  consultation,
  onClose,
  onSend,
  loading = false,
}: SendMessageModalProps) {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateForm = (): boolean => {
    if (!message.trim()) {
      setError("Message is required");
      return false;
    }
    if (message.length < 10) {
      setError("Message must be at least 10 characters");
      return false;
    }
    if (message.length > 1000) {
      setError("Message must be less than 1000 characters");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSend(consultation._id, message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Increased width and fixed height */}
      <div
        className={`relative w-full max-w-2xl rounded-xl shadow-2xl ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header - Sticky */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Send Message
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Send a message to {consultation.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Info */}
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-blue-50"}`}
            >
              <div className="flex items-center gap-3 mb-3">
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
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Service:</span>{" "}
                {consultation.service}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError("");
                }}
                rows={8} // Increased from 6 to 8
                className={`w-full px-3 py-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  error ? "border-red-500" : ""
                }`}
                placeholder={`Hi ${consultation.name.split(" ")[0]}, thank you for your consultation request regarding ${consultation.service}. We'd like to discuss...`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">Minimum 10 characters</p>
                <p
                  className={`text-xs ${message.length > 1000 ? "text-red-500" : "text-gray-500"}`}
                >
                  {message.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Message Tips */}
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Tips for effective communication:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
                <li>Be professional and courteous</li>
                <li>Address the client by name</li>
                <li>Reference their specific service request</li>
                <li>Provide clear next steps</li>
                <li>Include your contact information</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-inherit z-10">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
              className="h-10 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendMessageModal;
