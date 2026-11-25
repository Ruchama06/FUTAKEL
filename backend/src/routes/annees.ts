import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const annees = await prisma.anneeScolaire.findMany({ orderBy: { dateDebut: 'desc' } });
    res.json(annees);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// NOUVEAU : Créer une année scolaire
router.post('/', requireAuth, async (req, res) => {
  try {
    const { libelle, dateDebut, dateFin } = req.body;
    if (!libelle || !dateDebut || !dateFin) {
      return res.status(400).json({ message: 'Libellé, date de début et date de fin requis' });
    }

    const etab = await prisma.etablissement.findFirst();
    if (!etab) return res.status(500).json({ message: 'Établissement manquant' });

    const annee = await prisma.anneeScolaire.create({
      data: {
        idEtablissement: etab.id,
        libelle,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        statut: 'ACTIVE'
      },
    });

    // Créer automatiquement le compteur de reçus pour cette année
    await prisma.compteurRecu.create({
      data: { idAnnee: annee.id, dernierNumero: 0 }
    });

    res.status(201).json(annee);
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Cette année existe déjà' });
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;