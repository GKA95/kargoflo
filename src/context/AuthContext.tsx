import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';

interface BackendConnectionState {
  isConnected: boolean;
  isDbConnected: boolean;
  message: string;
  checkedAt: string;
  baseUrl: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendState: BackendConnectionState;
  checkBackend: () => Promise<void>;
  login: (credentials: { email: string; password: string; role?: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'rider';
    termsAccepted: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  simulatePortalPreview: (role: UserRole | null) => void;
  isSessionExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [backendState, setBackendState] = useState<BackendConnectionState>({
    isConnected: false,
    isDbConnected: false,
    message: 'Checking backend status...',
    checkedAt: new Date().toISOString(),
    baseUrl: apiClient.getBaseUrl(),
  });

  const checkBackend = useCallback(async () => {
    const status = await apiClient.checkHealth();
    setBackendState({
      isConnected: status.isConnected,
      isDbConnected: !!status.isDbConnected,
      message: status.message,
      checkedAt: new Date().toISOString(),
      baseUrl: apiClient.getBaseUrl(),
    });
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkBackend();
      try {
        // Attempt session retrieval if a token or session exists
        const res = await authService.getSession();
        if (res.data) {
          setUser(res.data);
        }
      } catch {
        // Expected when backend is not connected or user is unauthenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkBackend]);

  const login = async (credentials: { email: string; password: string; role?: string }) => {
    setIsLoading(true);
    setIsSessionExpired(false);
    try {
      const res = await authService.login(credentials);
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        throw new Error(res.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'rider';
    termsAccepted: boolean;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.data?.user) {
        setUser(res.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsSessionExpired(false);
    }
  };

  /**
   * Preview helper allowing UI/UX inspection of role-guarded views
   * without creating fake records or mock databases.
   */
  const simulatePortalPreview = (role: UserRole | null) => {
    if (!role) {
      setUser(null);
      return;
    }
    setUser({
      id: `usr_preview_${role}`,
      name: role === 'admin' ? 'Administrator' : role === 'rider' ? 'Dispatch Courier' : 'Active Customer',
      email: `${role}@kargoflow.gh`,
      phone: '+233 24 000 0000',
      role,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    });
  };

  const role = user?.role || null;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        backendState,
        checkBackend,
        login,
        register,
        logout,
        simulatePortalPreview,
        isSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
