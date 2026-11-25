import { apiClient } from './client';

export interface Depense {
  id: string;
  description: string;
  categorie: string | null;
  montantTotal: number;
  dateDepense: string;
  statut: string;
}

export interface CreateDepensePayload {
  description: string;
  categorie: string;
  montantTotal: number;
}

export async function getDepenses(): Promise<Depense[]> {
  const { data } = await apiClient.get<Depense[]>('/depenses');
  return data;
}

export async function createDepense(payload: CreateDepensePayload): Promise<Depense> {
  const { data } = await apiClient.post<Depense>('/depenses', payload);
  return data;
}