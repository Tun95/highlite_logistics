import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatPercentage } from "../../../utilities/utils/Utils";
import { CryptoAsset } from "../../../types/crypto/crypto-admin.types";

interface CryptoGridProps {
  cryptos: CryptoAsset[];
  onCryptoSelect: (crypto: CryptoAsset) => void;
  getCryptoIcon: (symbol: string) => string;
}

function CryptoGrid({
  cryptos,
  onCryptoSelect,
}: CryptoGridProps) {

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

  if (cryptos.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🪙</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No cryptocurrencies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No cryptocurrencies match your current filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cryptos.map((crypto) => (
        <div
          key={crypto.id}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
          onClick={() => onCryptoSelect(crypto)}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/40/667eea/ffffff?text=${crypto.symbol.charAt(0)}`;
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {crypto.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {crypto.symbol.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              #{crypto.market_cap_rank}
            </div>
          </div>

          {/* Price and Change */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatNumber(crypto.current_price)}
            </div>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${getChangeBgColor(crypto.price_change_percentage_24h)} ${getChangeColor(crypto.price_change_percentage_24h)}`}
            >
              {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {formatPercentage(crypto.price_change_percentage_24h)}
            </div>
          </div>

          {/* Market Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Market Cap
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(crypto.market_cap)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                24h Volume
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(crypto.total_volume)}
              </span>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">
                24h Range
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatNumber(crypto.low_24h)} - {formatNumber(crypto.high_24h)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCryptoSelect(crypto);
              }}
              className="w-full py-2 text-sm text-bitcoin hover:text-bitcoin/90 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CryptoGrid;
