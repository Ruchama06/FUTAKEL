import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Démarrage du seed FUTAKEL...');

  // 1. Établissement Saint Basile
  const etablissement = await prisma.etablissement.create({
    data: {
      nom: 'Saint Basile',
      adresse: 'Ouagadougou, Burkina Faso',
      telephone: '+226 00 00 00 00',
    },
  });
  console.log('✅ Établissement créé :', etablissement.nom);

  // 2. Deux utilisateurs : Gloire (gestionnaire) et Olivier (responsable)
  const motDePasseHash = await bcrypt.hash('demo1234', 10);

  const gloire = await prisma.utilisateur.create({
    data: {
      nom: 'Gloire',
      prenom: 'Gestionnaire',
      email: 'gloire@saintbasile.bf',
      motDePasseHash,
      rolePlateforme: 'GESTIONNAIRE',
    },
  });

  const olivier = await prisma.utilisateur.create({
    data: {
      nom: 'Olivier',
      prenom: 'Responsable',
      email: 'olivier@saintbasile.bf',
      motDePasseHash,
      rolePlateforme: 'RESPONSABLE',
    },
  });
  console.log('✅ Utilisateurs créés :', gloire.email, 'et', olivier.email);

  // 3. Année scolaire 2025-2026
  const annee = await prisma.anneeScolaire.create({
    data: {
      idEtablissement: etablissement.id,
      libelle: '2025-2026',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2026-07-31'),
    },
  });
  console.log('✅ Année scolaire créée :', annee.libelle);

  // 4. Classe 6e A
  const classe = await prisma.classe.create({
    data: {
      idAnnee: annee.id,
      idEtablissement: etablissement.id,
      nom: '6e A',
      description: 'Classe de sixième A',
    },
  });
  console.log('✅ Classe créée :', classe.nom);

  // 5. Élève de démo : Awa Diallo
  const awa = await prisma.eleve.create({
    data: {
      idEtablissement: etablissement.id,
      idClasse: classe.id,
      matricule: 'SB-2025-001',
      nom: 'Diallo',
      prenom: 'Awa',
      sexe: 'F',
      dateNaissance: new Date('2013-03-15'),
    },
  });
  console.log('✅ Élève créé :', awa.prenom, awa.nom);

  // 6. Frais « Scolarité 6e A » : 150 000 FCFA
  const frais = await prisma.frais.create({
    data: {
      idClasse: classe.id,
      idEtablissement: etablissement.id,
      libelle: 'Scolarité 6e A',
      montantInitial: 150000,
      dateEcheance: new Date('2026-06-30'),
    },
  });
  console.log('✅ Frais créé :', frais.libelle);

  // 7. Attribution du frais à Awa
  await prisma.fraisEleve.create({
    data: {
      idEleve: awa.id,
      idFrais: frais.id,
      montantInitial: 150000,
      montantNet: 150000,
    },
  });
  console.log('✅ Frais attribué à', awa.prenom);

  // 8. Caisse + compteur reçu
  await prisma.caisse.create({
    data: {
      idEtablissement: etablissement.id,
      soldeInitial: 0,
    },
  });

  await prisma.compteurRecu.create({
    data: {
      idAnnee: annee.id,
      dernierNumero: 0,
    },
  });
  console.log('✅ Caisse et compteur reçu initialisés');

  console.log('🎉 Seed terminé !');
  console.log('');
  console.log('👉 Comptes de démo :');
  console.log('   Gestionnaire : gloire@saintbasile.bf / demo1234');
  console.log('   Responsable  : olivier@saintbasile.bf / demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });