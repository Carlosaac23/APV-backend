import type { Response, Request, NextFunction } from 'express';

import { connectDB } from '../db/client.js';

export async function connectDBMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}
