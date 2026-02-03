import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Globe,
} from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { useState } from "react";
import { toast } from "sonner";
import {
  formatNumber,
  formatPercentage,
  formatDate,
} from "../../../utilities/utils/Utils";
import { CryptoAsset } from "../../../types/crypto/crypto-admin.types";

interface CryptoDetailSidebarProps {
  crypto: CryptoAsset;
  onClose: () => void;
  getCryptoIcon: (symbol: string) => string;
}

function CryptoDetailSidebar({
  crypto,
  onClose,
}: CryptoDetailSidebarProps) {
  const { theme } = useTheme();
  const [showPriceHistory, setShowPriceHistory] = useState(true);
  const [showMarketData, setShowMarketData] = useState(true);
  const [showSupplyInfo, setShowSupplyInfo] = useState(false);

  // Get change color
  const getChangeColor = (value: number) => {
    return value >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  };

  // Get change bg color
  const getChangeBgColor = (value: number) => {
    return value >= 0
      ? "bg-emerald-50 dark:bg-emerald-900/20"
      : "bg-red-50 dark:bg-red-900/20";
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${label}`));
  };

  // Open external link
  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
                <h2 className="text-lg font-semibold">Crypto Details</h2>
              </div>

              <button
                onClick={() =>
                  openExternalLink(
                    `https://www.coingecko.com/en/coins/${crypto.id}`,
                  )
                }
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                title="View on CoinGecko"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Crypto Header */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-16 h-16 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/64/667eea/ffffff?text=${crypto.symbol.charAt(0)}`;
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {crypto.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm">
                          {crypto.symbol.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Rank #{crypto.market_cap_rank}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(crypto.id, "Crypto ID")}
                      className="p-2 text-gray-400 hover:text-bitcoin rounded-lg"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatNumber(crypto.current_price)}
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getChangeBgColor(crypto.price_change_percentage_24h)} ${getChangeColor(crypto.price_change_percentage_24h)}`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </span>
                  <span className="text-sm">(24h)</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    24h High
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(crypto.high_24h)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    24h Low
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(crypto.low_24h)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      crypto.price_change_percentage_24h >= 0
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        ((crypto.current_price - crypto.low_24h) /
                          (crypto.high_24h - crypto.low_24h)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Market Data */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowMarketData(!showMarketData)}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Market Data
                </h4>
                {showMarketData ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {showMarketData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Market Cap
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(crypto.market_cap)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        24h Volume
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(crypto.total_volume)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Market Cap Change
                      </div>
                      <div
                        className={`font-medium ${getChangeColor(crypto.market_cap_change_percentage_24h)}`}
                      >
                        {formatPercentage(crypto.market_cap_change_percentage_24h)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Price Change
                      </div>
                      <div
                        className={`font-medium ${getChangeColor(crypto.price_change_24h)}`}
                      >
                        {formatNumber(crypto.price_change_24h)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Supply Information */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowSupplyInfo(!showSupplyInfo)}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Supply Information
                </h4>
                {showSupplyInfo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {showSupplyInfo && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Circulating Supply
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crypto.circulating_supply.toLocaleString()}{" "}
                        {crypto.symbol.toUpperCase()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total Supply
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crypto.total_supply
                          ? crypto.total_supply.toLocaleString()
                          : "∞"}
                      </div>
                    </div>
                  </div>

                  {crypto.max_supply && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Max Supply
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crypto.max_supply.toLocaleString()}{" "}
                        {crypto.symbol.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price History */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowPriceHistory(!showPriceHistory)}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price History
                </h4>
                {showPriceHistory ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {showPriceHistory && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        All-Time High
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(crypto.ath)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {crypto.ath_date &&
                          formatDate(new Date(crypto.ath_date))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ATH Change
                      </div>
                      <div
                        className={`font-medium ${getChangeColor(crypto.ath_change_percentage)}`}
                      >
                        {formatPercentage(crypto.ath_change_percentage)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        All-Time Low
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(crypto.atl)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {crypto.atl_date &&
                          formatDate(new Date(crypto.atl_date))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ATL Change
                      </div>
                      <div
                        className={`font-medium ${getChangeColor(crypto.atl_change_percentage)}`}
                      >
                        {formatPercentage(crypto.atl_change_percentage)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Meta Information */}
            <div
              className={`p-6 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                Additional Information
              </h4>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated
                  </span>
                  <span className="font-medium text-sm">
                    {crypto.last_updated &&
                      formatDate(new Date(crypto.last_updated))}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    CoinGecko ID
                  </span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {crypto.id}
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
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    openExternalLink(
                      `https://www.coingecko.com/en/coins/${crypto.id}`,
                    )
                  }
                  className="flex-1 h-10 px-4 bg-bitcoin text-white rounded-lg hover:bg-bitcoin/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  View on CoinGecko
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoDetailSidebar;