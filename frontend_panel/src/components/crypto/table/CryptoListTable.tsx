import { Pagination } from "antd";
import { Eye, TrendingUp, TrendingDown, Loader, Bitcoin } from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { formatNumber, formatPercentage } from "../../../utilities/utils/Utils";
import { CryptoAsset } from "../../../types/crypto/crypto-admin.types";

interface CryptoListTableProps {
  cryptos: CryptoAsset[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onCryptoSelect: (crypto: CryptoAsset) => void;
  loading: boolean;
  totalCryptos?: number;
  pageLimit?: number;
  getCryptoIcon: (symbol: string) => string;
}

function CryptoListTable({
  cryptos,
  currentPage,
  onPageChange,
  onCryptoSelect,
  loading,
  totalCryptos = 0,
  pageLimit = 50,
}: CryptoListTableProps) {
  const { theme } = useTheme();

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

  // Handle row click
  const handleRowClick = (crypto: CryptoAsset, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isActionButton =
      target.closest("button") ||
      target.closest(".action-button") ||
      target.tagName === "BUTTON";

    if (!isActionButton) {
      onCryptoSelect(crypto);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-bitcoin dark:text-bitcoin/90 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading cryptocurrencies...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                } border-b border-gray-200 dark:border-gray-700`}
              >
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  #
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  Price
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  24h Change
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  Market Cap
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  24h Volume
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cryptos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Bitcoin className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No cryptocurrencies found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        No cryptocurrencies match your current filters.
                        Try adjusting your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                cryptos.map((crypto) => (
                  <tr
                    key={crypto.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    } transition-colors cursor-pointer`}
                    onClick={(e) => handleRowClick(crypto, e)}
                  >
                    <td className="p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {crypto.market_cap_rank}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/32/667eea/ffffff?text=${crypto.symbol.charAt(0)}`;
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(crypto.current_price)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getChangeBgColor(crypto.price_change_percentage_24h)} ${getChangeColor(crypto.price_change_percentage_24h)}`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 dark:text-white">
                        {formatNumber(crypto.market_cap)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 dark:text-white">
                        {formatNumber(crypto.total_volume)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 action-button">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCryptoSelect(crypto);
                          }}
                          className="p-1.5 text-gray-500 hover:text-bitcoin dark:text-gray-400 dark:hover:text-bitcoin hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {cryptos.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Bitcoin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No cryptocurrencies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No cryptocurrencies match your current filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className={`border rounded-lg p-4 ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-700/50"
                    : "border-gray-200 hover:bg-gray-50"
                } transition-colors cursor-pointer`}
                onClick={(e) => handleRowClick(crypto, e)}
              >
                <div className="flex items-start justify-between mb-4">
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
                        {crypto.symbol.toUpperCase()} • #{crypto.market_cap_rank}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 action-button">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCryptoSelect(crypto);
                      }}
                      className="p-1.5 text-gray-500 hover:text-bitcoin dark:text-gray-400 dark:hover:text-bitcoin hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Price
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(crypto.current_price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      24h Change
                    </div>
                    <div
                      className={`font-medium ${getChangeColor(crypto.price_change_percentage_24h)}`}
                    >
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Market Cap
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatNumber(crypto.market_cap)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Volume
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatNumber(crypto.total_volume)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {cryptos.length > 0 && totalCryptos > pageLimit && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * pageLimit + 1} to{" "}
              {Math.min(currentPage * pageLimit, totalCryptos)} of{" "}
              {totalCryptos} cryptocurrencies
            </div>
            <Pagination
              current={currentPage}
              pageSize={pageLimit}
              total={totalCryptos}
              onChange={onPageChange}
              showSizeChanger={false}
              showLessItems
              className={`pagination-custom ${
                theme === "dark"
                  ? "dark-pagination [&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-white [&_.ant-pagination-item-active]:bg-bitcoin [&_.ant-pagination-item-active]:border-bitcoin [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item:hover]:bg-gray-600 [&_.ant-pagination-item-active:hover]:bg-bitcoin/90 [&_.ant-pagination-prev_button]:text-white [&_.ant-pagination-next_button]:text-white [&_.ant-pagination-disabled_button]:text-gray-500 [&_.ant-pagination-jump-next]:text-white [&_.ant-pagination-jump-prev]:text-white"
                  : "[&_.ant-pagination-item:hover]:bg-gray-100 [&_.ant-pagination-item-active]:bg-bitcoin [&_.ant-pagination-item-active]:border-bitcoin [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item-active:hover]:bg-bitcoin/90"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CryptoListTable;