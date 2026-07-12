import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  otp?: string; // exposed only during test/SMTP fallback
  error?: string;
}

// Utility helper to handle fetch requests with clear error handling
async function request<T>(url: string, options: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const authApi = {
  async register(payload: Record<string, string>): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: Record<string, string>): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async forgotPassword(payload: { email: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async verifyOtp(payload: { email: string; otp: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async resetPassword(payload: Record<string, string>): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
