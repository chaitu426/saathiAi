import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {environment} from "../config/environment.js";

const JWT_SECRET = environment.jwtsecret;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as { id: string, username: string, email: string };
    (req as any).user = decoded;
    next();
  } catch (err:any) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "Invalid token", details: err.message });
  
  }
}; 