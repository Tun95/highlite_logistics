// components/common/LoadingErrorWrapper.tsx
import React from "react";
import {
  XCircle,
  AlertCircle,
  RefreshCw,
  Bitcoin,
  Shield,
  LucideIcon,
} from "lucide-react";
import { formatTime } from "../../utilities/utils/Utils";

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: string | null;
  data: unknown;
  onRetry: () => void;
  loadingMessage?: string;
  loadingSubMessage?: string;
  errorTitle?: string;
  errorDescription?: string;
  noDataMessage?: string;
  noDataSubMessage?: string;
  customLoadingIcon?: LucideIcon;
  customErrorIcon?: LucideIcon;
  customNoDataIcon?: LucideIcon;
  showLastUpdated?: boolean;
  lastUpdated?: string;
  marketChange?: number;
}

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  loading,
  error,
  data,
  onRetry,
  loadingMessage = "Loading Dashboard...",
  loadingSubMessage = "Fetching real-time data",
  errorTitle = "Failed to Load Dashboard",
  errorDescription = "There was an issue loading data",
  noDataMessage = "No dashboard data available",
  noDataSubMessage = "Please check your connection and try again",
  customLoadingIcon,
  customErrorIcon,
  customNoDataIcon,
  showLastUpdated = false,
  lastUpdated,
  marketChange,
}) => {
  // Loading State
  if (loading) {
    const LoadingIcon = customLoadingIcon || Bitcoin;
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-bitcoin rounded-full animate-spin" />
            <LoadingIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-bitcoin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            {loadingMessage}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            {loadingSubMessage}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    const ErrorIcon = customErrorIcon || XCircle;
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-6">
        <div className="w-full max-w-md rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/20">
              <ErrorIcon className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
            {errorTitle}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
            {errorDescription}
          </p>

          <div className="mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-600 dark:text-red-400 font-medium">
                Error:
              </span>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {error}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              className="h-10 px-6 bg-bitcoin text-white rounded-lg hover:bg-bitcoin/90 transition-colors duration-200 font-medium flex items-center gap-2 justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!data) {
    const NoDataIcon = customNoDataIcon || Shield;
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <NoDataIcon className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {noDataMessage}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {noDataSubMessage}
          </p>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-bitcoin text-white rounded-lg hover:bg-bitcoin/90 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Header info (optional, only if showLastUpdated is true)
  if (showLastUpdated) {
    return (
      <div className="text-gray-600 dark:text-gray-400">
        {lastUpdated && (
          <>
            Last updated: {formatTime(lastUpdated)}
            {marketChange !== undefined && (
              <>
                <span className="mx-2">•</span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    marketChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketChange >= 0 ? "↗" : "↘"}
                  {marketChange?.toFixed(2)}%
                </span>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // RETURN NULL
  // If not loading, no error, and data exists, return null (children will be rendered)
  return null;
};

export default LoadingErrorWrapper;
