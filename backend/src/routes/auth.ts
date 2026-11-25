import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const router = Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // 1. Chercher l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // 2. Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasseHash);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // 3. Générer le token JWT (valide 24h)
    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email,
        rolePlateforme: utilisateur.rolePlateforme,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // 4. Renvoyer la réponse
    res.json({
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        rolePlateforme: utilisateur.rolePlateforme,
        statut: utilisateur.statut,
        dateCreation: utilisateur.dateCreation,
      },
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/auth/me — récupère l'utilisateur courant depuis le token
router.get('/me', async (req, res) => {
  // sera complété plus tard si besoin
  res.json({ message: 'Route /me à implémenter' });
});

export default router;