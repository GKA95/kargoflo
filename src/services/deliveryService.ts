import { apiClient } from './apiClient';
import type { ApiResponse, DeliveryOrder, PricingBreakdown, DeliveryStatus } from '../types';

export const deliveryService = {
  /**
   * Request a new delivery order.
   */
  async createDelivery(payload: {
    pickup: any;
    destination: any;
    parcel: any;
    type: string;
  }): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post<ApiResponse<DeliveryOrder>>('/deliveries', payload);
  },

  /**
   * Calculate delivery pricing quote from backend.
   */
  async getPricingQuote(payload: {
    pickupCoordinates?: { lat: number; lng: number };
    destinationCoordinates?: { lat: number; lng: number };
    distanceKm?: number;
    parcelSize: string;
    deliveryType: string;
    isFragile?: boolean;
  }): Promise<ApiResponse<PricingBreakdown>> {
    return apiClient.post<ApiResponse<PricingBreakdown>>('/deliveries/quote', payload);
  },

  /**
   * Fetch customer's deliveries.
   */
  async getCustomerDeliveries(status?: DeliveryStatus): Promise<ApiResponse<DeliveryOrder[]>> {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<ApiResponse<DeliveryOrder[]>>(`/deliveries/my-orders${query}`);
  },

  /**
   * Track delivery by tracking reference number.
   */
  async trackDelivery(trackingReference: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.get<ApiResponse<DeliveryOrder>>(`/deliveries/track/${encodeURIComponent(trackingReference)}`);
  },

  /**
   * Get delivery order details by ID.
   */
  async getDeliveryById(id: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.get<ApiResponse<DeliveryOrder>>(`/deliveries/${id}`);
  },

  /**
   * Cancel delivery order.
   */
  async cancelDelivery(id: string, reason: string): Promise<ApiResponse<DeliveryOrder>> {
    return apiClient.post<ApiResponse<DeliveryOrder>>(`/deliveries/${id}/cancel`, { reason });
  },

  /**
   * Rate a completed delivery.
   */
  async rateDelivery(id: string, rating: number, comment?: string): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`/deliveries/${id}/rate`, { rating, comment });
  },
};
