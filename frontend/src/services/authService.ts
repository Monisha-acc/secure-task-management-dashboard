import apiClient from '../lib/apiClient';
import { AuthPayload, AuthResponse } from '../types';

export const loginUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
};