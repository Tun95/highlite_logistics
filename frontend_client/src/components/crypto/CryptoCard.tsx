import { TrendingUp, TrendingDown } from "lucide-react";
import { CryptoAsset } from "../../types/crypto/crypto.types";

interface CryptoCardProps {
  crypto: CryptoAsset;
  index: number;
}

function CryptoCard({ crypto, index }: CryptoCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }).format(price);
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  const changeColor =
    crypto.price_change_percentage_24h >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  const changeBg =
    crypto.price_change_percentage_24h >= 0
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-red-50 dark:bg-red-900/20";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-card-appear"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header with rank and icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {crypto.market_cap_rank}
            </span>
          </div>
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/32/667eea/ffffff?text=${crypto.symbol.charAt(0)}`;
            }}
          />
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}
        >
          {crypto.price_change_percentage_24h >= 0 ? (
            <TrendingUp className="w-3 h-3 inline mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 inline mr-1" />
          )}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Name and symbol */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {crypto.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {crypto.symbol.toUpperCase()}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPrice(crypto.current_price)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current Price
        </p>
      </div>

      {/* Market stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Market Cap
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatMarketCap(crypto.market_cap)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            24h Volume
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatMarketCap(crypto.total_volume)}
          </p>
        </div>
      </div>

      {/* 24h price range */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 dark:text-gray-400">24h Range</span>
          <span className="text-gray-700 dark:text-gray-300">
            {formatPrice(crypto.low_24h)} - {formatPrice(crypto.high_24h)}
          </span>
        </div>
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              crypto.price_change_percentage_24h >= 0
                ? "bg-green-500"
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
  );
}

export default CryptoCard;