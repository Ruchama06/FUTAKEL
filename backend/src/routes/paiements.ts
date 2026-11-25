import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/paiements — enregistrer un paiement
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { idEleve, idFraisEleve, montant, modePaiement } = req.body;

    if (!idEleve || !idFraisEleve || !montant || !modePaiement) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    if (montant <= 0) {
      return res.status(400).json({ message: 'Le montant doit être positif' });
    }

    // 1. Vérifier l'élève
    const eleve = await prisma.eleve.findUnique({ where: { id: idEleve } });
    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    // 2. Vérifier le frais élève
    const fraisEleve = await prisma.fraisEleve.findUnique({ where: { id: idFraisEleve } });
    if (!fraisEleve) return res.status(404).json({ message: 'Frais introuvable' });

    // 3. Vérifier qu'il ne paie pas plus que dû
    const totalPaye = await prisma.affectationPaiement.aggregate({
      where: { idFraisEleve },
      _sum: { montantAffecte: true },
    });
    const dejaPaye = Number(totalPaye._sum.montantAffecte || 0);
    const reste = Number(fraisEleve.montantNet) - dejaPaye;
    if (montant > reste) {
      return res.status(400).json({ message: `Montant trop élevé. Reste dû : ${reste} FCFA` });
    }

    // 4. Créer paiement + affectation + reçu + mouvement caisse (transaction)
    const resultat = await prisma.$transaction(async (tx) => {
      const reference = `PAY-${Date.now()}`;

      const paiement = await tx.paiement.create({
        data: {
          idEtablissement: eleve.idEtablissement,
          idEleve,
          idUtilisateur: req.utilisateur!.id,
          reference,
          montant,
          modePaiement,
        },
      });

      await tx.affectationPaiement.create({
        data: { idPaiement: paiement.id, idFraisEleve, montantAffecte: montant },
      });

      // Numéroter le reçu
      const annee = await tx.anneeScolaire.findFirst({ where: { statut: 'ACTIVE' } });
      if (!annee) throw new Error('Aucune année active');

      const compteur = await tx.compteurRecu.findUnique({ where: { idAnnee: annee.id } });
      if (!compteur) throw new Error('Compteur reçu manquant');

      const nouveauNumero = compteur.dernierNumero + 1;
      await tx.compteurRecu.update({
        where: { idAnnee: annee.id },
        data: { dernierNumero: nouveauNumero },
      });

      const recu = await tx.recu.create({
        data: {
          idPaiement: paiement.id,
          idEtablissement: eleve.idEtablissement,
          numeroRecu: String(nouveauNumero).padStart(4, '0'),
          statut: 'DEFINITIF',
        },
      });

      // Mouvement caisse
      const caisse = await tx.caisse.findFirst();
      if (!caisse) throw new Error('Caisse manquante');

      await tx.mouvementCaisse.create({
        data: {
          idCaisse: caisse.id,
          typeMouvement: 'ENTREE',
          montant,
          description: `Paiement ${reference}`,
          idPaiement: paiement.id,
          idUtilisateur: req.utilisateur!.id,
        },
      });

      return { paiement, recu };
    });

    res.status(201).json(resultat);
  } catch (err: any) {
    console.error('Erreur POST /paiements:', err);
    res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
});

export default router;