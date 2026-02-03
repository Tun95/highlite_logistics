import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            {/* Error Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 border-2 border-red-200 dark:border-red-800 rounded-full animate-ping opacity-20" />
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            
            {/* Possible Causes */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Possible causes:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Network connection issue</li>
                <li>• API rate limit exceeded</li>
                <li>• Server temporarily unavailable</li>
              </ul>
            </div>
            
            {/* Retry Button */}
            <button
              onClick={onRetry}
              className="group relative w-full bg-gradient-to-r from-accent-500 to-blue-500 hover:from-accent-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </div>
              <div className="absolute inset-0 border-2 border-accent-300 dark:border-accent-700 rounded-lg animate-pulse-slow opacity-30" />
            </button>
            
            {/* Alternative Action */}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              If the problem persists, please check your internet connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;