// services/crypto.service.ts
import axios, { AxiosError } from "axios";
import {
  CryptoAsset,
  CryptoFilters,
  ErrorResponse,
  CryptoDetail,
  ChartData,
} from "../types/crypto/crypto.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.coingecko.com/api/v3";

class CryptoService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  constructor() {
    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add any headers if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  // Error handler
  private handleError(error: AxiosError<ErrorResponse>): never {
    console.error("Crypto API Error:", error);

    if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
      throw new Error(
        "Unable to connect to server. Please check your connection.",
      );
    }

    if (error.response?.status === 429) {
      throw new Error(
        "API rate limit exceeded. Please wait before making more requests.",
      );
    }

    if (error.response?.status === 404) {
      throw new Error("Data not found.");
    }

    throw new Error(
      error.message ||
        "An unexpected error occurred while fetching crypto data",
    );
  }

  /**
   * Get all cryptocurrencies
   */
  async getCryptocurrencies(
    filters: CryptoFilters = {},
  ): Promise<CryptoAsset[]> {
    try {
      const params = {
        vs_currency: filters.vs_currency || "usd",
        order: filters.order || "market_cap_desc",
        per_page: filters.per_page || 50,
        page: filters.page || 1,
        sparkline: filters.sparkline || false,
        price_change_percentage: filters.price_change_percentage || "24h",
      };

      const response = await this.api.get<CryptoAsset[]>("/coins/markets", {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Get cryptocurrency by ID
   */
  async getCryptocurrencyById(id: string): Promise<CryptoDetail> {
    try {
      const response = await this.api.get<CryptoDetail>(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: true,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Get cryptocurrency chart data
   */
  async getChartData(
    id: string,
    days: number = 7,
    vs_currency: string = "usd",
  ): Promise<ChartData> {
    try {
      const response = await this.api.get<ChartData>(
        `/coins/${id}/market_chart`,
        {
          params: {
            vs_currency,
            days,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Search cryptocurrencies
   */
  async searchCryptocurrencies(query: string): Promise<CryptoAsset[]> {
    try {
      const allCryptos = await this.getCryptocurrencies({ per_page: 100 });
      return allCryptos.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(query.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(query.toLowerCase()),
      );
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Get market statistics
   */
  async getMarketStats(): Promise<{
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
  }> {
    try {
      const response = await this.api.get("/global");
      const data = response.data.data;
      return {
        total_market_cap: data.total_market_cap.usd,
        total_volume: data.total_volume.usd,
        btc_dominance: data.market_cap_percentage.btc,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }
}

export const cryptoService = new CryptoService();
