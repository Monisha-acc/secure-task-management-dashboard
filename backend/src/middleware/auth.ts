import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//Shape of the decoded JWT payload
interface JwtPayload {
  userId: number;
}

// Validates the Bearer token from the Authorization header
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  //Token must follow "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // Attach the userId to the request object for downstream handlers
    (req as Request & { userId: number }).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};