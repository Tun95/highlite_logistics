import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Filter, Search, Grid3x3, List } from "lucide-react";
import { CryptoAsset } from "../../types/crypto/crypto-admin.types";
import { cryptoDashboardService } from "../../services/cryptoDashboardService";

import CryptoListTable from "./table/CryptoListTable";
import CryptoGrid from "./grid/CryptoGrid";
import CryptoDetailSidebar from "./details/CryptoDetailSidebar";
import LoadingErrorWrapper from "../../common/error/LoadingErrorWrapper";

interface FilterState {
  search: string;
  category: string;
  sortBy: "market_cap" | "price" | "name" | "24h_change";
  sortOrder: "asc" | "desc";
}

function CryptoList() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(50);
  const [totalCryptos, setTotalCryptos] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    sortBy: "market_cap",
    sortOrder: "desc",
  });

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    fetchCryptos(1);
  }, []);

  const fetchCryptos = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cryptoDashboardService.getCryptocurrencies({
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: pageLimit,
        page: page,
        sparkline: false,
        price_change_percentage: "24h",
      });

      if (!Array.isArray(response)) {
        throw new Error("Invalid data format received from API");
      }

      setCryptos(response);
      setTotalCryptos(100); // CoinGecko API doesn't provide total count in this endpoint
      setCurrentPage(page);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch cryptocurrencies";
      setError(errorMessage);
      console.error("Error fetching cryptocurrencies:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchCryptos(1);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleSortChange = (sortBy: FilterState["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy
          ? prev.sortOrder === "desc"
            ? "asc"
            : "desc"
          : "desc",
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCryptos(page);
  };

  const handleCryptoSelect = (crypto: CryptoAsset) => {
    setSelectedCrypto(crypto);
  };

  const handleCloseSidebar = () => {
    setSelectedCrypto(null);
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      category: "all",
      sortBy: "market_cap",
      sortOrder: "desc",
    });
  };

  const handleRetry = () => {
    fetchCryptos(currentPage);
  };

  // Get crypto icon
  const getCryptoIcon = (symbol: string) => {
    switch (symbol.toLowerCase()) {
      case "btc":
        return "₿";
      case "eth":
        return "Ξ";
      case "sol":
        return "◎";
      case "ada":
        return "A";
      case "doge":
        return "Ð";
      case "xrp":
        return "X";
      case "dot":
        return "●";
      case "link":
        return "🔗";
      case "ltc":
        return "Ł";
      default:
        return "🪙";
    }
  };

  // Filter and sort cryptos
  const filteredCryptos = cryptos
    .filter((crypto) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          crypto.name.toLowerCase().includes(searchTerm) ||
          crypto.symbol.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    })
    .filter((crypto) => {
      if (filters.category === "all") return true;
      if (filters.category === "gainers")
        return crypto.price_change_percentage_24h > 0;
      if (filters.category === "losers")
        return crypto.price_change_percentage_24h < 0;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "market_cap":
          comparison = a.market_cap - b.market_cap;
          break;
        case "price":
          comparison = a.current_price - b.current_price;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "24h_change":
          comparison =
            a.price_change_percentage_24h - b.price_change_percentage_24h;
          break;
      }
      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

  return (
    <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cryptocurrency List
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and analyze cryptocurrencies in real-time
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <List size={18} className="inline mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Grid3x3 size={18} className="inline mr-2" />
                Grid
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 flex items-center gap-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Listed
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredCryptos.length}
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              24h Gainers
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {cryptos.filter((c) => c.price_change_percentage_24h > 0).length}
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              24h Losers
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {cryptos.filter((c) => c.price_change_percentage_24h < 0).length}
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Market Cap
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $
              {(
                cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0) /
                1e12
              ).toFixed(2)}
              T
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Cryptocurrencies
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name or symbol..."
                  className="w-full h-10 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bitcoin"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bitcoin"
              >
                <option value="all">All Cryptocurrencies</option>
                <option value="gainers">24h Gainers</option>
                <option value="losers">24h Losers</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value as FilterState["sortBy"])
                }
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bitcoin"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="24h_change">24h Change</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: e.target.value as "asc" | "desc",
                  }))
                }
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bitcoin"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.search || filters.category !== "all") && (
            <div className="mt-4">
              <button
                onClick={handleClearAllFilters}
                className="h-10 text-sm text-bitcoin hover:text-bitcoin/90 px-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* LoadingErrorWrapper for main content */}
      <LoadingErrorWrapper
        loading={loading}
        error={error}
        data={cryptos}
        onRetry={handleRetry}
        loadingMessage="Loading cryptocurrencies..."
        loadingSubMessage="Fetching real-time market data"
        errorTitle="Failed to Load Cryptocurrencies"
        errorDescription="There was an issue loading cryptocurrency data"
        noDataMessage="No cryptocurrency data available"
        noDataSubMessage="Please check your connection and try again"
      />

      {/* Only render content if data exists and no loading/error */}
      {!loading && !error && cryptos.length > 0 && (
        <>
          {/* Content based on view mode */}
          {viewMode === "list" ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CryptoListTable
                cryptos={filteredCryptos}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCryptoSelect={handleCryptoSelect}
                loading={loading}
                totalCryptos={totalCryptos}
                pageLimit={pageLimit}
                getCryptoIcon={getCryptoIcon}
              />
            </div>
          ) : (
            <CryptoGrid
              cryptos={filteredCryptos}
              onCryptoSelect={handleCryptoSelect}
              getCryptoIcon={getCryptoIcon}
            />
          )}

          {/* Crypto Detail Sidebar */}
          {selectedCrypto && (
            <CryptoDetailSidebar
              crypto={selectedCrypto}
              onClose={handleCloseSidebar}
              getCryptoIcon={getCryptoIcon}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CryptoList;
