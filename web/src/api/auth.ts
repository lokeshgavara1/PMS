import { useMutation, useQuery } from 'react-query';
import { apiClient } from './client';
import type { User, AuthTokens, LoginRequest, LoginResponse } from '../types/index';

/**
 * POST /api/v2/auth/login
 * Authenticate user with LDAP credentials or Google token
 */
export const useLogin = () => {
  return useMutation(async (credentials: LoginRequest | { googleToken: string }) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const { user, tokens } = response.data.data;

    // Store tokens in localStorage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return { user, tokens };
  });
};

/**
 * POST /api/v2/auth/logout
 * Clear session and revoke tokens
 */
export const useLogout = () => {
  return useMutation(async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });
};

/**
 * GET /api/v2/auth/me
 * Fetch current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery<User>(
    ['auth', 'me'],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
      return response.data.data;
    },
    {
      enabled: !!localStorage.getItem('accessToken'),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};

/**
 * POST /api/v2/auth/refresh
 * Refresh access token using refresh token
 */
export const useRefreshToken = () => {
  return useMutation(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ success: boolean; data: AuthTokens }>(
      '/auth/refresh',
      { refreshToken },
    );

    const tokens = response.data.data;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
  });
};

/**
 * Check if user is authenticated by looking for valid accessToken
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
