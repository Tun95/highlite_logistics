// types/crypto/crypto-admin.types.ts

// Error response type
export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Array<{ msg: string }>;
}

// Crypto asset type (admin version)
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  sparkline_in_7d?: {
    price: number[];
  };
}

// Dashboard summary stats
export interface CryptoSummaryStats {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_percentage_24h: number;
  active_cryptocurrencies: number;
  markets: number;
  trending: number;
  top_gainers: number;
  top_losers: number;
}

// Chart data
export interface CryptoChartData {
  labels: string[];
  market_cap: number[];
  volume: number[];
  prices: number[];
}

// Recent activities
export interface RecentActivity {
  id: string;
  type: 'price_alert' | 'watchlist' | 'portfolio_update' | 'market_news';
  title: string;
  description: string;
  crypto_symbol: string;
  timestamp: string;
  read: boolean;
}

// Top performing cryptos
export interface TopPerformingCrypto {
  id: string;
  name: string;
  symbol: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  volume: number;
  market_cap: number;
}

// Market sentiment
export interface MarketSentiment {
  fear_greed_index: number;
  sentiment: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  last_updated: string;
  change_24h: number;
}

// Watchlist item
export interface WatchlistItem {
  id: string;
  crypto_id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  target_price?: number;
  notes?: string;
  added_at: string;
}

// Portfolio summary
export interface PortfolioSummary {
  total_value: number;
  total_investment: number;
  total_profit_loss: number;
  profit_loss_percentage: number;
  top_performer: {
    name: string;
    symbol: string;
    profit_loss_percentage: number;
  };
  worst_performer: {
    name: string;
    symbol: string;
    profit_loss_percentage: number;
  };
}

// Dashboard response
export interface CryptoDashboardResponse {
  status: string;
  data: {
    summary: CryptoSummaryStats;
    chart_data: CryptoChartData;
    top_gainers: TopPerformingCrypto[];
    top_losers: TopPerformingCrypto[];
    recent_activities: RecentActivity[];
    market_sentiment: MarketSentiment;
    watchlist: WatchlistItem[];
    portfolio_summary?: PortfolioSummary;
    last_updated: string;
    user_role: 'admin' | 'viewer' | 'trader';
  };
}

// Filters for admin dashboard
export interface CryptoDashboardFilters {
  time_range?: '24h' | '7d' | '30d' | '90d' | '1y';
  category?: 'all' | 'defi' | 'nft' | 'gaming' | 'ai';
  market_cap_range?: 'large' | 'mid' | 'small' | 'micro';
  sort_by?: 'market_cap' | 'volume' | 'price_change' | 'name';
}

// Alert/Notification
export interface CryptoAlert {
  id: string;
  type: 'price' | 'volume' | 'market_cap';
  crypto_id: string;
  crypto_name: string;
  crypto_symbol: string;
  condition: 'above' | 'below' | 'percent_change';
  value: number;
  triggered: boolean;
  triggered_at?: string;
  created_at: string;
}