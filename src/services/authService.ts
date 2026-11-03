import { apiClient } from './apiClient';
import type { ApiResponse, User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export const authService = {
  async register(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'rider';
    termsAccepted: boolean;
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },

  async login(payload: {
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clean up local auth regardless
    } finally {
      apiClient.setToken(null);
    }
  },

  async getSession(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/me');
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/reset-password', payload);
  },

  async verifyEmail(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post('/auth/verify-email', { token });
  },

  async googleAuth(idToken: string, role: string): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { idToken, role });
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },
};
