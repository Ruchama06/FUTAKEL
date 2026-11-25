import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/eleves — liste tous les élèves de l'établissement
router.get('/', requireAuth, async (req, res) => {
  try {
    const eleves = await prisma.eleve.findMany({
      include: {
        classe: true,
        fraisEleves: {
          include: {
            frais: true,
            affectations: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });
    res.json(eleves);
  } catch (err) {
    console.error('Erreur GET /eleves:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/eleves/:id — fiche d'un élève
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const eleve = await prisma.eleve.findUnique({
      where: { id: req.params.id },
      include: {
        classe: true,
        fraisEleves: {
          include: {
            frais: true,
            affectations: true,
          },
        },
        paiements: {
          include: {
            recu: true,
          },
          orderBy: { datePaiement: 'desc' },
        },
      },
    });

    if (!eleve) {
      return res.status(404).json({ message: 'Élève introuvable' });
    }

    res.json(eleve);
  } catch (err) {
    console.error('Erreur GET /eleves/:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/eleves — créer un élève
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nom, prenom, matricule, dateNaissance, sexe, adresse, idClasse } = req.body;

    if (!nom || !prenom || !matricule) {
      return res.status(400).json({ message: 'nom, prenom et matricule requis' });
    }

    // Récupérer l'établissement (pour le MVP, il n'y en a qu'un)
    const etablissement = await prisma.etablissement.findFirst();
    if (!etablissement) {
      return res.status(500).json({ message: 'Aucun établissement en base' });
    }

    const eleve = await prisma.eleve.create({
      data: {
        idEtablissement: etablissement.id,
        idClasse: idClasse || null,
        matricule,
        nom,
        prenom,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        sexe: sexe || null,
        adresse: adresse || null,
      },
      include: { classe: true },
    });

    res.status(201).json(eleve);
  } catch (err: any) {
    console.error('Erreur POST /eleves:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Ce matricule existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/eleves/impayes — liste des élèves avec un solde impayé
router.get('/impayes', requireAuth, async (req, res) => {
  try {
    const eleves = await prisma.eleve.findMany({
      include: {
        classe: true,
        fraisEleves: { include: { frais: true, affectations: true } },
      },
    });

    const impayes = eleves.map((e) => {
      let totalDu = 0;
      let totalPaye = 0;
      e.fraisEleves.forEach((fe) => {
        totalDu += Number(fe.montantNet);
        fe.affectations.forEach((a) => {
          totalPaye += Number(a.montantAffecte);
        });
      });
      return {
        id: e.id,
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        classe: e.classe?.nom || '—',
        totalDu,
        totalPaye,
        reste: totalDu - totalPaye,
      };
    }).filter((e) => e.reste > 0); // Ne garder que ceux qui doivent

    res.json(impayes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;