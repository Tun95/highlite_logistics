// services/consultation-admin.service.ts
import axios, { AxiosError } from "axios";
import {
  AdminConsultationFilters,
  ConsultationsResponse,
  UpdateConsultationData,
  ConsultationResponse,
  ErrorResponse,
  StatusUpdateData,
  AdminMessageData,
} from "../types/consultation/consultation.types";
import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ConsultationAdminService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000,
  });

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const userInfo = authService.getUserInfo();
        if (userInfo?.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor to handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }
  
  // Error handler
  private handleError(error: AxiosError<ErrorResponse>): never {
    console.error("Consultation Admin API Error:", error);

    const response = error.response?.data;

    if (response?.errors && Array.isArray(response.errors)) {
      const errorMessages = response.errors.map((err) => err.msg).join(", ");
      throw new Error(errorMessages || response.message || "Validation failed");
    }

    if (response?.message) {
      throw new Error(response.message);
    }

    if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
      throw new Error(
        "Unable to connect to server. Please check your connection.",
      );
    }

    if (error.response?.status === 401) {
      throw new Error("Unauthorized access. Please login again.");
    }

    if (error.response?.status === 403) {
      throw new Error("Access forbidden. Insufficient permissions.");
    }

    if (error.response?.status === 404) {
      throw new Error("Consultation not found.");
    }

    if (error.response?.status === 409) {
      throw new Error("Duplicate consultation detected.");
    }

    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait before submitting again.");
    }

    throw new Error(error.message || "An unexpected error occurred");
  }

  // ============ ADMIN ENDPOINTS ============

  /**
   * Get all consultations with filters (admin/editor)
   */
  async getAllConsultations(
    filters: AdminConsultationFilters = {},
  ): Promise<ConsultationsResponse> {
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.service && filters.service !== "all")
        params.append("service", filters.service);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);

      const response = await this.api.get<ConsultationsResponse>(
        `/api/consultation?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Get consultation by ID (admin/editor)
   */
  async getConsultationById(id: string): Promise<ConsultationResponse> {
    try {
      const response = await this.api.get<ConsultationResponse>(
        `/api/consultation/${id}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Update consultation notes (admin/editor)
   */
  async updateConsultation(
    id: string,
    updateData: UpdateConsultationData,
  ): Promise<ConsultationResponse> {
    try {
      const response = await this.api.put<ConsultationResponse>(
        `/api/consultation/${id}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Update consultation status (admin/editor)
   */
  async updateStatus(
    id: string,
    statusData: StatusUpdateData,
  ): Promise<ConsultationResponse> {
    try {
      const response = await this.api.patch<ConsultationResponse>(
        `/api/consultation/${id}/status`,
        statusData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Send admin message to user (admin/editor)
   */
  async sendAdminMessage(
    id: string,
    messageData: AdminMessageData,
  ): Promise<ConsultationResponse> {
    try {
      const response = await this.api.post<ConsultationResponse>(
        `/api/consultation/${id}/message`,
        messageData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  /**
   * Delete consultation (admin/editor)
   */
  async deleteConsultation(
    id: string,
  ): Promise<{ status: string; message: string }> {
    try {
      const response = await this.api.delete<{
        status: string;
        message: string;
      }>(`/api/consultation/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }
}

export const consultationAdminService = new ConsultationAdminService();