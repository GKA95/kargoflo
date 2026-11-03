import { apiClient } from './apiClient';
import type {
  ApiResponse,
  User,
  RiderProfile,
  DeliveryOrder,
  PaymentTransaction,
  RefundRequest,
  ComplaintTicket,
  SecurityAuditLog,
  PricingConfig,
} from '../types';

export interface AdminDashboardMetrics {
  totalCustomers: number;
  totalRiders: number;
  pendingRiderApplications: number;
  approvedRiders: number;
  activeDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  verifiedPaymentsTotal: number;
  pendingRefundRequests: number;
  currency: string;
}

export const adminService = {
  async getMetrics(): Promise<ApiResponse<AdminDashboardMetrics>> {
    return apiClient.get<ApiResponse<AdminDashboardMetrics>>('/admin/metrics');
  },

  async getCustomers(page = 1, search?: string): Promise<ApiResponse<User[]>> {
    const q = new URLSearchParams({ page: String(page) });
    if (search) q.append('search', search);
    return apiClient.get<ApiResponse<User[]>>(`/admin/customers?${q.toString()}`);
  },

  async toggleCustomerStatus(id: string, suspended: boolean): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(`/admin/customers/${id}/status`, { suspended });
  },

  async getRiders(status?: string, page = 1): Promise<ApiResponse<RiderProfile[]>> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.append('status', status);
    return apiClient.get<ApiResponse<RiderProfile[]>>(`/admin/riders?${q.toString()}`);
  },

  async getRiderById(id: string): Promise<ApiResponse<RiderProfile>> {
    return apiClient.get<ApiResponse<RiderProfile>>(`/admin/riders/${id}`);
  },

  async approveRider(id: string): Promise<ApiResponse<RiderProfile>> {
    return apiClient.post<ApiResponse<RiderProfile>>(`/admin/riders/${id}/approve`);
  },

  async rejectRider(id: string, reason: string): Promise<ApiResponse<RiderProfile>> {
    return apiClient.post<ApiResponse<RiderProfile>>(`/admin/riders/${id}/reject`, { reason });
  },

  async requestRiderDocuments(id: string, details: string): Promise<ApiResponse<RiderProfile>> {
    return apiClient.post<ApiResponse<RiderProfile>>(`/admin/riders/${id}/request-docs`, { details });
  },

  async getAllDeliveries(status?: string, search?: string): Promise<ApiResponse<DeliveryOrder[]>> {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    if (search) q.append('search', search);
    return apiClient.get<ApiResponse<DeliveryOrder[]>>(`/admin/deliveries?${q.toString()}`);
  },

  async getPricingConfig(): Promise<ApiResponse<PricingConfig>> {
    return apiClient.get<ApiResponse<PricingConfig>>('/admin/pricing');
  },

  async updatePricingConfig(config: PricingConfig): Promise<ApiResponse<PricingConfig>> {
    return apiClient.put<ApiResponse<PricingConfig>>('/admin/pricing', config);
  },

  async getPayments(page = 1, status?: string): Promise<ApiResponse<PaymentTransaction[]>> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.append('status', status);
    return apiClient.get<ApiResponse<PaymentTransaction[]>>(`/admin/payments?${q.toString()}`);
  },

  async getRefunds(status?: string): Promise<ApiResponse<RefundRequest[]>> {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    return apiClient.get<ApiResponse<RefundRequest[]>>(`/admin/refunds?${q.toString()}`);
  },

  async processRefund(id: string, decision: 'approved' | 'rejected', notes: string): Promise<ApiResponse<RefundRequest>> {
    return apiClient.post<ApiResponse<RefundRequest>>(`/admin/refunds/${id}/process`, { decision, notes });
  },

  async getComplaints(status?: string): Promise<ApiResponse<ComplaintTicket[]>> {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    return apiClient.get<ApiResponse<ComplaintTicket[]>>(`/admin/complaints?${q.toString()}`);
  },

  async respondToComplaint(id: string, response: string, newStatus: string): Promise<ApiResponse<ComplaintTicket>> {
    return apiClient.post<ApiResponse<ComplaintTicket>>(`/admin/complaints/${id}/respond`, {
      response,
      status: newStatus,
    });
  },

  async getAuditLogs(page = 1): Promise<ApiResponse<SecurityAuditLog[]>> {
    return apiClient.get<ApiResponse<SecurityAuditLog[]>>(`/admin/audit-logs?page=${page}`);
  },
};
