import type {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request{
    utilisateur?: {
        id: string;
        email: string;
        rolePlateforme: string
    };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Token manquant'});
    }

    const token = header.substring(7);

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.utilisateur = {
            id: payload.id,
            email: payload.email,
            rolePlateforme: payload.rolePlateforme,
        };
        next();
    } catch (err) {
        return res.status(401).json({message: 'Token invalide ou expire'});
    }
}