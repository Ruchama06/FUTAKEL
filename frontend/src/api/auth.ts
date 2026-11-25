import { apiClient } from './client';
import type { AuthResponse } from '../types';

export async function login(email: string, motDePasse: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, motDePasse });
  return data;
}

export function logout() {
  localStorage.removeItem('futakel_token');
  localStorage.removeItem('futakel_user');
}

export function getToken(): string | null {
  return localStorage.getItem('futakel_token');
}

export function getUtilisateur() {
  const raw = localStorage.getItem('futakel_user');
  return raw ? JSON.parse(raw) : null;
}