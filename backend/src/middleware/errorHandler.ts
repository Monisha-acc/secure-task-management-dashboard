import { Request, Response, NextFunction } from 'express';

// Global error handler — catches unhandled errors and returns a clean JSON response
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
};