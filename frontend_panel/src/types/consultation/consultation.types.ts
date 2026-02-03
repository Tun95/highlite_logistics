// types/consultation/consultation.types.ts

// Error response type
export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Array<{ msg: string }>;
}

// Consultation status type
export type ConsultationStatus = 
  | "pending" 
  | "reviewed" 
  | "approved" 
  | "rejected" 
  | "contacted";

// Service type
export type ConsultationService = 
  | "Web Development"
  | "Mobile App Development"
  | "UI/UX Design"
  | "Software Consulting"
  | "Digital Transformation"
  | "Custom Software"
  | "Other";

// Budget range type
export type BudgetRange = 
  | "$5,000 - $15,000"
  | "$15,000 - $50,000"
  | "$50,000 - $100,000"
  | "$100,000+"
  | "Not sure yet";

// Admin message type
export interface AdminMessage {
  message: string;
  sent_by: string;
  sent_at: string;
  sent_via: "email" | "dashboard";
}

// Consultation item
export interface Consultation {
  _id: string;
  consultation_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: ConsultationService;
  budget?: BudgetRange;
  message: string;
  status: ConsultationStatus;
  admin_notes?: string;
  admin_messages: AdminMessage[];
  submitted_by_ip?: string;
  submitted_by_user_agent?: string;
  last_status_change?: string;
  last_contacted?: string;
  createdAt: string;
  updatedAt: string;
}

// Admin consultation filters
export interface AdminConsultationFilters {
  page?: number;
  limit?: number;
  search?: string;
  service?: "all" | ConsultationService;
  status?: "all" | ConsultationStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: "createdAt" | "updatedAt" | "name" | "email" | "status";
  sort_order?: "asc" | "desc";
}

// Create consultation data (admin - not used, but kept for consistency)
export interface CreateConsultationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: ConsultationService;
  budget?: BudgetRange;
  message: string;
}

// Update consultation data (admin)
export interface UpdateConsultationData {
  admin_notes?: string;
}

// Status update data (admin)
export interface StatusUpdateData {
  status: ConsultationStatus;
  admin_notes?: string;
}

// Admin message data
export interface AdminMessageData {
  message: string;
}

// Pagination info
export interface ConsultationPaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
  limit: number;
}

// Statistics
export interface ConsultationStats {
  pending?: number;
  reviewed?: number;
  approved?: number;
  rejected?: number;
  contacted?: number;
}

// Consultations response
export interface ConsultationsResponse {
  status: string;
  data: {
    consultations: Consultation[];
    pagination: ConsultationPaginationInfo;
    stats: ConsultationStats;
  };
}

// Single consultation response
export interface ConsultationResponse {
  status: string;
  message: string;
  data: {
    consultation: Consultation;
  };
}