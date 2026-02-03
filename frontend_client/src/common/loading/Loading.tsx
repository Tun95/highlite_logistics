function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 border-t-accent-500 rounded-full animate-spin" />
          
          {/* Inner spinning ring */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: "reverse" }} />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent-500 rounded-full" />
        </div>
        
        <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading cryptocurrency data...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Fetching real-time prices from CoinGecko
        </p>
      </div>
    </div>
  );
}

export default Loading;