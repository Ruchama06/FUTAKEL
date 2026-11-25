import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nom, niveau, description, idAnnee, capaciteMax, nombreMatieres, professeurPrincipal } = req.body;
    
    if (!nom || !idAnnee) {
      return res.status(400).json({ message: 'Le nom et l\'année sont requis' });
    }

    const classe = await prisma.classe.create({
      data: {
        nom,
        niveau: niveau || null,
        description: description || null,
        capaciteMax: capaciteMax ? Number(capaciteMax) : null,
        nombreMatieres: nombreMatieres ? Number(nombreMatieres) : null,
        professeurPrincipal: professeurPrincipal || null,
        idAnnee,
        idEtablissement: (await prisma.etablissement.findFirst())!.id,
      },
    });

    res.status(201).json(classe);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Cette classe existe déjà pour cette année' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});