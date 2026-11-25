import { apiClient } from './client';
import type { Caisse } from '../types';

export interface CaisseAvecSolde extends Caisse {
  soldeCourant: number;
}

export async function getCaisse(): Promise<CaisseAvecSolde> {
  const { data } = await apiClient.get<CaisseAvecSolde>('/caisse');
  return data;
}