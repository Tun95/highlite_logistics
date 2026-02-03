// types/crypto/crypto.types.ts

// Error response type
export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Array<{ msg: string }>;
}

// Crypto asset type
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
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
  sparkline_in_7d?: {
    price: number[];
  };
}

// API response for multiple assets
export interface CryptoAssetsResponse {
  status: string;
  data: CryptoAsset[];
  message?: string;
}

// Filters for crypto assets
export interface CryptoFilters {
  vs_currency?: string;
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc' | 'id_desc' | 'id_asc';
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
}

// Sort options
export type SortOption = 'market_cap' | 'price' | 'volume' | 'name' | '24h_change';

// Sort order
export type SortOrder = 'asc' | 'desc';

// Stats for crypto dashboard
export interface CryptoStats {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  active_cryptocurrencies: number;
  market_cap_change_percentage_24h: number;
}

// Single crypto detail
export interface CryptoDetail extends CryptoAsset {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: string | null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
  };
}

// Crypto chart data
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  market_cap: number;
  total_volume: number;
}

export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Search suggestion
export interface SearchSuggestion {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
}

// Watchlist item
export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: number;
  added_at: string;
}