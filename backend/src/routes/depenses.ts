import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/depenses — liste des dépenses
router.get('/', requireAuth, async (req, res) => {
  try {
    const depenses = await prisma.depense.findMany({ orderBy: { dateDepense: 'desc' } });
    res.json(depenses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/depenses — créer une dépense
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { description, categorie, montantTotal } = req.body;
    if (!description || !montantTotal) return res.status(400).json({ message: 'Champs manquants' });

    const etab = await prisma.etablissement.findFirst();
    const caisse = await prisma.caisse.findFirst();
    if (!etab || !caisse) return res.status(500).json({ message: 'Config manquante' });

    const resultat = await prisma.$transaction(async (tx) => {
      const depense = await tx.depense.create({
        data: {
          idEtablissement: etab.id,
          idUtilisateur: req.utilisateur!.id,
          description,
          categorie: categorie || null,
          montantTotal,
        },
      });

      // Créer le mouvement de caisse (SORTIE)
      await tx.mouvementCaisse.create({
        data: {
          idCaisse: caisse.id,
          typeMouvement: 'SORTIE',
          montant: montantTotal,
          description,
          idDepense: depense.id,
          idUtilisateur: req.utilisateur!.id,
        },
      });

      return depense;
    });

    res.status(201).json(resultat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;