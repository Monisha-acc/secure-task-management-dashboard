// Service functions for authentication API calls
// Uses the central apiClient which handles JWT headers automatically

import apiClient from '../lib/apiClient';
import { AuthPayload, AuthResponse } from '../types';

// Sends login credentials and returns JWT token + username
export const loginUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
};

// Registers a new user and returns JWT token + username
export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
};