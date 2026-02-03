import { useState, useEffect, useCallback } from "react";
import CryptoCard from "../crypto/CryptoCard";
import { Search, RefreshCw, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import { cryptoService } from "../../services/crypto.service";
import { CryptoAsset } from "../../types/crypto/crypto.types";
import Loading from "../../common/loading/Loading";
import ErrorMessage from "../../common/error/ErrorMessage";
import { formatNumber, formatTime } from "../../utils/Formatter";

function Home() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
  });

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cryptoData, marketStats] = await Promise.all([
        cryptoService.getCryptocurrencies({ per_page: 50 }),
        cryptoService.getMarketStats().catch(() => ({
          total_market_cap: 0,
          total_volume: 0,
          btc_dominance: 0,
        })),
      ]);

      if (!Array.isArray(cryptoData)) {
        throw new Error("Invalid data format received from API");
      }

      setCryptos(cryptoData);
      setFilteredCryptos(cryptoData);
      setStats({
        totalMarketCap: marketStats.total_market_cap,
        totalVolume: marketStats.total_volume,
        btcDominance: marketStats.btc_dominance,
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch cryptocurrency data. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

  // Filter cryptos
  useEffect(() => {
    let result = [...cryptos];

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCryptos(result);
  }, [cryptos, searchTerm]);

  if (loading && !error) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCryptoData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-10 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-accent-600 to-blue-600 dark:from-white dark:via-accent-400 dark:to-blue-400 bg-clip-text text-transparent">
              Cryptocurrency Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg max-w-2xl">
              Real-time cryptocurrency prices and market data for HighLite
              Logistics
            </p>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Market Cap */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 dark:from-blue-900/10 to-white dark:to-gray-800/50 p-6 shadow-lg border border-blue-100 dark:border-blue-800/30 group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full z-10 bg-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">💎</span>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Market Cap
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatNumber(stats.totalMarketCap)}
                </p>
              </div>
            </div>
          </div>

          {/* Bitcoin Dominance */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-50 dark:from-accent-900/10 to-white dark:to-gray-800/50 p-6 shadow-lg border border-accent-100 dark:border-accent-800/30 group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full z-10 bg-accent-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">₿</span>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent-100 dark:bg-accent-900/30">
                <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bitcoin Dominance
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.btcDominance.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* 24h Volume */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 dark:from-green-900/10 to-white dark:to-gray-800/50 p-6 shadow-lg border border-green-100 dark:border-green-800/30 group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full z-10 bg-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">📊</span>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  24h Trading Volume
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatNumber(stats.totalVolume)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Controls Section */}
        <div className="mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-4 z-10">
            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies by name or symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:text-white transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredCryptos.length} of {cryptos.length}{" "}
                cryptocurrencies
                {lastUpdated && (
                  <span className="ml-4">
                    Last updated: {formatTime(lastUpdated)}
                  </span>
                )}
              </div>
              <button
                onClick={fetchCryptoData}
                className="group relative px-6 py-3 bg-gradient-to-r from-accent-500 to-blue-500 hover:from-accent-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Cryptocurrency Cards Grid */}
        <div className="mb-10">
          {filteredCryptos.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cryptocurrencies
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCryptos.map((crypto, index) => (
                  <CryptoCard key={crypto.id} crypto={crypto} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No cryptocurrencies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any cryptocurrencies matching "{searchTerm}".
                Try searching with a different term or browse all
                cryptocurrencies.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors duration-300"
              >
                View All Cryptocurrencies
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Data provided by CoinGecko API • Updated every 5 minutes
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              HighLite Logistics • Cryptocurrency Tracker •{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;