// Format numbers
export const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
};

export const formatPercentage = (num: number): string => {
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
};

// Format time
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

// Get sentiment color
export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment.toLowerCase()) {
    case "extreme greed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "greed":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "neutral":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "fear":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "extreme fear":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Get change color
export const getChangeColor = (value: number): string => {
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
};

// Get change bg color
export const getChangeBgColor = (value: number): string => {
  return value >= 0
    ? "bg-green-100 dark:bg-green-900/20"
    : "bg-red-100 dark:bg-red-900/20";
};
