import { apiClient } from './client';
import type { Paiement, Recu } from '../types';

export interface CreatePaiementPayload {
  idEleve: string;
  idFraisEleve: string;
  montant: number;
  modePaiement: string;
}

export interface CreatePaiementResponse {
  paiement: Paiement;
  recu: Recu;
}

export async function createPaiement(payload: CreatePaiementPayload): Promise<CreatePaiementResponse> {
  const { data } = await apiClient.post<CreatePaiementResponse>('/paiements', payload);
  return data;
}