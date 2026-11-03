import { apiClient } from './apiClient';
import type { ApiResponse, RiderProfile, DeliveryOrder } from '../types';

export const riderService = {
  async registerRider(formData: FormData): Promise<ApiResponse<RiderProfile>> {
    const url = `${apiClient.getBaseUrl()}/riders/register`;
    const token = apiClient.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Rider registration failed');
    }
    return res.json();
  },

  async getProfile(): Promise<ApiResponse<RiderProfile>> {
    return apiClient.get<ApiResponse<RiderProfile>>('/riders/profile');
  },

  async toggleAvailability(isOnline: boolean): Promise<ApiResponse<{ isOnline: boolean }>> {
    return apiClient.patch('/riders/availability', { isOnline });
  },

  async getAvailableRequests(): Promise<ApiResponse<DeliveryOrder[]>> {
    return apiClient.get<ApiResponse<DeliveryOrder[]>>('/riders/requests/available');
  },

  async getAssignedDeliveries(): Promise<ApiResponse<DeliveryOrder[]>> {
    return apiClient.get<ApiResponse<DeliveryOrder[]>>('/riders/deliveries/assigned');
  },

  async getDeliveryHistory(): Promise<ApiResponse<DeliveryOrder[]>> {
    return apiClient.get<ApiResponse<DeliveryOrder[]>>('/riders/deliveries/history');
  },

  async acceptRequest(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post(`/riders/requests/${orderId}/accept`);
  },

  async rejectRequest(orderId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/riders/requests/${orderId}/reject`, { reason });
  },

  async confirmPickup(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post(`/riders/deliveries/${orderId}/confirm-pickup`);
  },

  async markInTransit(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post(`/riders/deliveries/${orderId}/mark-in-transit`);
  },

  async completeDelivery(orderId: string, proof: {
    recipientName: string;
    photoUrl?: string;
    signatureData?: string;
    notes?: string;
  }): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post(`/riders/deliveries/${orderId}/complete`, proof);
  },

  async getEarnings(): Promise<ApiResponse<RiderProfile['earningsSummary']>> {
    return apiClient.get('/riders/earnings');
  },
};
