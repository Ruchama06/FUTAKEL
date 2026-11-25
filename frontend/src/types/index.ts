// ============================================
// TYPES FUTAKEL — MVP
// ============================================

export type RolePlateforme = 'GESTIONNAIRE' | 'RESPONSABLE';

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  rolePlateforme: RolePlateforme;
  statut: string;
  dateCreation: string;
}

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}

export interface Eleve {
  id: string;
  idEtablissement: string;
  idClasse: string | null;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  sexe: string | null;
  adresse: string | null;
  statut: string;
  dateCreation: string;
  classe?: Classe | null;
}

export interface Classe {
  id: string;
  idAnnee: string;
  idEtablissement: string;
  nom: string;
  description: string | null;
}

export interface Frais {
  id: string;
  idClasse: string;
  idEtablissement: string;
  libelle: string;
  montantInitial: number;
  dateEcheance: string | null;
  statut: string;
}

export interface FraisEleve {
  id: string;
  idEleve: string;
  idFrais: string;
  montantInitial: number;
  montantNet: number;
  dateAttribution: string;
  frais?: Frais;
}

export interface Paiement {
  id: string;
  idEtablissement: string;
  idEleve: string;
  idUtilisateur: string;
  reference: string;
  montant: number;
  modePaiement: string;
  datePaiement: string;
  statut: string;
}

export interface Recu {
  id: string;
  idPaiement: string;
  idEtablissement: string;
  numeroRecu: string;
  dateEmission: string;
  statut: string;
}

export interface Caisse {
  id: string;
  idEtablissement: string;
  nom: string;
  soldeInitial: number;
  statut: string;
}