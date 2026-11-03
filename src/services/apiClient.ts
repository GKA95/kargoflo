/**
 * Centralized API Client for KargoFlow Ghana
 * Configured for future Node.js / Express / MongoDB Atlas integration.
 * In accordance with the No Mock Data Policy: Never returns fabricated records.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
}

export class ApiError extends Error {
  public statusCode?: number;
  public details?: unknown;
  public isNetworkError: boolean;

  constructor(message: string, statusCode?: number, isNetworkError: boolean = false, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
    this.details = details;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  public async checkHealth(): Promise<{ isConnected: boolean; isDbConnected?: boolean; message: string; dbStatus?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const data = await response.json().catch(() => null);
        const isDbConnected = data?.database?.status === 'connected';
        return {
          isConnected: true,
          isDbConnected,
          dbStatus: data?.database?.status,
          message: isDbConnected
            ? 'Backend & MongoDB Atlas Connected'
            : data?.database?.message || 'API Online (MongoDB Awaiting URI)',
        };
      }
      return { isConnected: false, isDbConnected: false, message: `Backend responded with HTTP ${response.status}` };
    } catch {
      return {
        isConnected: false,
        isDbConnected: false,
        message: 'Backend server not detected at configured endpoint. Running in frontend-ready mode.',
      };
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers),
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const errorMsg =
          errorData?.error ||
          errorData?.message ||
          (typeof errorData === 'string' ? errorData : null) ||
          `Request failed with HTTP status ${response.status}`;
        throw new ApiError(errorMsg, response.status, false, errorData);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      // Network or fetch abort error
      throw new ApiError(
        `Backend service unreachable at ${url}. Please configure VITE_API_BASE_URL or launch the backend API server.`,
        undefined,
        true,
        err
      );
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
