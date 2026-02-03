// COMPONENT
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Bitcoin,
  Star,
  Bell,
  Clock,
  Users,
  RefreshCw,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
  Activity,
  PieChart as PieChartIcon,
  LineChart,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import {
  CryptoDashboardResponse,
  RecentActivity,
  TopPerformingCrypto,
  WatchlistItem,
} from "../../types/crypto/crypto-admin.types";
import {
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  formatTime,
  getChangeBgColor,
  getChangeColor,
  getSentimentColor,
} from "../../utilities/utils/Utils";
import LoadingErrorWrapper from "../../common/error/LoadingErrorWrapper";
import { cryptoDashboardService } from "../../services/cryptoDashboardService";

// Quick Action Type
interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  color: string;
  path?: string;
}

function CryptoAdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<
    CryptoDashboardResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "markets" | "watchlist" | "alerts"
  >("overview");

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cryptoDashboardService.getDashboardData();

      if (response.status === "success") {
        setDashboardData(response.data);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick Actions for Crypto Admin
  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: "Market Analysis",
      description: "Detailed market insights and trends",
      icon: BarChart3,
      action: () => navigate("/crypto/markets"),
      color: "bg-blue-500",
      path: "/crypto/markets",
    },
    {
      id: 2,
      title: "Watchlist Manager",
      description: "Manage your crypto watchlist",
      icon: Star,
      action: () => setActiveTab("watchlist"),
      color: "bg-amber-500",
    },
    {
      id: 3,
      title: "Price Alerts",
      description: "Set up price alerts and notifications",
      icon: Bell,
      action: () => setActiveTab("alerts"),
      color: "bg-red-500",
    },
    {
      id: 4,
      title: "Portfolio",
      description: "View and manage your portfolio",
      icon: PieChartIcon,
      action: () => navigate("/crypto/portfolio"),
      color: "bg-green-500",
      path: "/crypto/portfolio",
    },
    {
      id: 5,
      title: "Market News",
      description: "Latest cryptocurrency news",
      icon: Activity,
      action: () => navigate("/crypto/news"),
      color: "bg-purple-500",
      path: "/crypto/news",
    },
  ];

  // Mark activity as read
  const handleMarkAsRead = async (activityId: string) => {
    try {
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recent_activities: prev.recent_activities.map((activity) =>
            activity.id === activityId ? { ...activity, read: true } : activity,
          ),
        };
      });
      toast.success("Activity marked as read");
    } catch {
      toast.error("Failed to mark activity as read");
    }
  };

  // Clear all activities
  const handleClearActivities = async () => {
    try {
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recent_activities: prev.recent_activities.map((activity) => ({
            ...activity,
            read: true,
          })),
        };
      });
      toast.success("All activities cleared");
    } catch {
      toast.error("Failed to clear activities");
    }
  };

  // LoadingErrorWrapper: at the top level
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LoadingErrorWrapper
        loading={loading}
        error={error}
        data={dashboardData}
        onRetry={fetchDashboardData}
        loadingMessage="Loading Crypto Dashboard..."
        loadingSubMessage="Fetching real-time market data"
        errorTitle="Failed to Load Dashboard"
        errorDescription="There was an issue loading cryptocurrency data"
        noDataMessage="No dashboard data available"
        noDataSubMessage="Please check your connection and try again"
      />

      {/* Only render dashboard content if data exists and no loading/error */}
      {!loading && !error && dashboardData && (
        <>
          <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col flex-wrap sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Crypto Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    HighLite Logistics • Real-time cryptocurrency analytics
                    <span className="mx-2">•</span>
                    Last updated: {formatTime(dashboardData.last_updated)}
                    <span className="mx-2">•</span>
                    <span
                      className={`inline-flex items-center gap-1 ${getChangeColor(dashboardData.summary.market_cap_change_percentage_24h)}`}
                    >
                      {dashboardData.summary.market_cap_change_percentage_24h >=
                      0 ? (
                        <TrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <TrendingDownIcon className="w-4 h-4" />
                      )}
                      {formatPercentage(
                        dashboardData.summary.market_cap_change_percentage_24h,
                      )}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getSentimentColor(dashboardData.market_sentiment.sentiment)}`}
                  >
                    Fear & Greed: {dashboardData.market_sentiment.sentiment}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      dashboardData.user_role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {dashboardData.user_role === "admin"
                      ? "Administrator"
                      : "Viewer"}
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-bitcoin text-white rounded-lg hover:bg-bitcoin/90 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
                {(["overview", "markets", "watchlist", "alerts"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-200 ${
                        activeTab === tab
                          ? "bg-bitcoin text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid max-480px:grid-cols-1 max-1200px:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Market Cap */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(dashboardData.summary.market_cap_change_percentage_24h)}`}
                  >
                    {dashboardData.summary.market_cap_change_percentage_24h >=
                    0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {formatPercentage(
                        dashboardData.summary.market_cap_change_percentage_24h,
                      )}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatNumber(dashboardData.summary.total_market_cap)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Total Market Cap
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Bitcoin className="w-4 h-4" />
                  <span>
                    BTC Dominance:{" "}
                    {dashboardData.summary.btc_dominance.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* 24h Volume */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Active: {dashboardData.summary.active_cryptocurrencies}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatNumber(dashboardData.summary.total_volume)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  24h Trading Volume
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{dashboardData.summary.markets} markets</span>
                </div>
              </div>

              {/* Top Gainers */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    {dashboardData.summary.top_gainers} assets
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Top Gainers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  24h Performance
                </p>
                {dashboardData.top_gainers
                  .slice(0, 2)
                  .map((crypto: TopPerformingCrypto) => (
                    <div
                      key={crypto.id}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {crypto.symbol.toUpperCase()}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        +{crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>

              {/* Top Losers */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {dashboardData.summary.top_losers} assets
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Top Losers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  24h Performance
                </p>
                {dashboardData.top_losers
                  .slice(0, 2)
                  .map((crypto: TopPerformingCrypto) => (
                    <div
                      key={crypto.id}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {crypto.symbol.toUpperCase()}
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Market Cap Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Market Cap Trend
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last 7 days performance
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${getChangeColor(dashboardData.summary.market_cap_change_percentage_24h)}`}
                  >
                    <TrendingUpIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {formatPercentage(
                        dashboardData.summary.market_cap_change_percentage_24h,
                      )}
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dashboardData.chart_data.labels.map((label, i) => ({
                        date: label,
                        market_cap:
                          dashboardData.chart_data.market_cap[i] / 1000000, // Convert to millions
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        strokeOpacity={0.5}
                      />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `$${value}M`}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}M`,
                          "Market Cap",
                        ]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e5e7eb",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="market_cap"
                        name="Market Cap (M)"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume vs Price Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Volume & Price Correlation
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      BTC price vs trading volume
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <LineChart className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Strong Correlation
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={dashboardData.chart_data.labels.map((label, i) => ({
                        date: label,
                        price: dashboardData.chart_data.prices[i],
                        volume: dashboardData.chart_data.volume[i] / 1000,
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        strokeOpacity={0.5}
                      />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        yAxisId="left"
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${value}K`}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "price"
                            ? `$${Number(value).toFixed(2)}`
                            : `${Number(value).toFixed(0)}K`,
                          name === "price" ? "Price" : "Volume",
                        ]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e5e7eb",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="price"
                        name="BTC Price"
                        stroke="#f7931a"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volume"
                        name="Volume (K)"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group hover:scale-[1.02] hover:border-bitcoin"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200 shadow-md`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                        {action.description}
                      </p>
                      <div className="text-bitcoin text-sm font-medium flex items-center gap-1">
                        Access
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activities & Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activities
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearActivities}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Clear All
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {
                        dashboardData.recent_activities.filter((a) => !a.read)
                          .length
                      }{" "}
                      unread
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {dashboardData.recent_activities
                    .slice(0, 5)
                    .map((activity: RecentActivity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-xl border ${activity.read ? "border-gray-200 dark:border-gray-700" : "border-blue-200 dark:border-blue-800"} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                activity.type === "price_alert"
                                  ? "bg-red-100 dark:bg-red-900/30"
                                  : activity.type === "watchlist"
                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                    : activity.type === "portfolio_update"
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : "bg-blue-100 dark:bg-blue-900/30"
                              }`}
                            >
                              {activity.type === "price_alert" ? (
                                <Bell className="w-4 h-4 text-red-600 dark:text-red-400" />
                              ) : activity.type === "watchlist" ? (
                                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              ) : activity.type === "portfolio_update" ? (
                                <PieChartIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                          {!activity.read && (
                            <button
                              onClick={() => handleMarkAsRead(activity.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 text-xs">
                              {activity.crypto_symbol}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatRelativeTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Watchlist */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My Watchlist
                  </h3>
                  <button
                    onClick={() => setActiveTab("watchlist")}
                    className="text-sm text-bitcoin hover:text-bitcoin/90 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.watchlist
                    .slice(0, 5)
                    .map((item: WatchlistItem) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-bitcoin/10 flex items-center justify-center">
                              <span className="text-bitcoin font-semibold text-base">
                                {item.symbol.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.symbol.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${getChangeBgColor(item.price_change_percentage_24h)} ${getChangeColor(item.price_change_percentage_24h)}`}
                          >
                            {formatPercentage(item.price_change_percentage_24h)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${item.current_price.toLocaleString()}
                            </span>
                            <span className="ml-2">
                              Target: $
                              {item.target_price?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span>Watching</span>
                          </div>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Portfolio & Market Sentiment */}
            {dashboardData.portfolio_summary && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Portfolio Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Portfolio Summary
                    </h3>
                    <div
                      className={`text-sm font-medium ${getChangeColor(dashboardData.portfolio_summary.profit_loss_percentage)}`}
                    >
                      {formatPercentage(
                        dashboardData.portfolio_summary.profit_loss_percentage,
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {formatNumber(
                            dashboardData.portfolio_summary.total_value,
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Value
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {formatNumber(
                            dashboardData.portfolio_summary.total_investment,
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Investment
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Top Performer
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {dashboardData.portfolio_summary.top_performer.name}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            +
                            {dashboardData.portfolio_summary.top_performer.profit_loss_percentage.toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Worst Performer
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {
                              dashboardData.portfolio_summary.worst_performer
                                .name
                            }
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {dashboardData.portfolio_summary.worst_performer.profit_loss_percentage.toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/crypto/portfolio")}
                      className="w-full py-3 bg-bitcoin text-white rounded-lg hover:bg-bitcoin/90 transition-colors duration-200 font-medium"
                    >
                      View Full Portfolio
                    </button>
                  </div>
                </div>

                {/* Market Sentiment */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Market Sentiment
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(dashboardData.market_sentiment.sentiment)}`}
                    >
                      Index: {dashboardData.market_sentiment.fear_greed_index}
                    </div>
                  </div>

                  {/* Fear & Greed Meter */}
                  <div className="mb-6">
                    <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mb-2 relative">
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-gray-800 rounded-full shadow-lg"
                        style={{
                          left: `${dashboardData.market_sentiment.fear_greed_index}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Extreme Fear</span>
                      <span>Fear</span>
                      <span>Neutral</span>
                      <span>Greed</span>
                      <span>Extreme Greed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Current Sentiment
                      </span>
                      <span
                        className={`font-medium ${getChangeColor(dashboardData.market_sentiment.change_24h)}`}
                      >
                        {dashboardData.market_sentiment.sentiment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        24h Change
                      </span>
                      <span
                        className={`font-medium ${getChangeColor(dashboardData.market_sentiment.change_24h)}`}
                      >
                        {formatPercentage(
                          dashboardData.market_sentiment.change_24h,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Last Updated
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatTime(
                          dashboardData.market_sentiment.last_updated,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Market sentiment is currently{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dashboardData.market_sentiment.sentiment.toLowerCase()}
                      </span>
                      .
                      {dashboardData.market_sentiment.fear_greed_index > 50
                        ? " This suggests positive market momentum."
                        : " Consider exercising caution with new investments."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Powered by CoinGecko API • Data updates every 5 minutes
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  HighLite Logistics • Crypto Admin Dashboard • v1.0 •{" "}
                  {new Date().getFullYear()}
                </p>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default CryptoAdminDashboard;
