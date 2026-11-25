import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/caisse — solde + mouvements
router.get('/', requireAuth, async (req, res) => {
  try {
    const caisse = await prisma.caisse.findFirst({
      include: {
        mouvements: {
          orderBy: { dateMouvement: 'desc' },
          take: 50,
        },
      },
    });

    if (!caisse) {
      return res.status(404).json({ message: 'Caisse introuvable' });
    }

    // Calculer le solde courant
    const entrees = caisse.mouvements
      .filter((m) => m.typeMouvement === 'ENTREE')
      .reduce((sum, m) => sum + Number(m.montant), 0);

    const sorties = caisse.mouvements
      .filter((m) => m.typeMouvement === 'SORTIE')
      .reduce((sum, m) => sum + Number(m.montant), 0);

    const soldeCourant = Number(caisse.soldeInitial) + entrees - sorties;

    res.json({
      ...caisse,
      soldeCourant,
      totalEntrees: entrees,
      totalSorties: sorties,
    });
  } catch (err) {
    console.error('Erreur GET /caisse:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;