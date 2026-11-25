import { apiClient } from './client';
import type { Eleve } from '../types';

export async function getEleves(): Promise<Eleve[]> {
  const { data } = await apiClient.get<Eleve[]>('/eleves');
  return data;
}

export async function getEleve(id: string): Promise<Eleve> {
  const { data } = await apiClient.get<Eleve>(`/eleves/${id}`);
  return data;
}