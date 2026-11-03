import type { Request, Response } from 'express';
import app from '../src/server/app';
import { connectToDatabase } from '../src/server/db/connection';

/**
 * Vercel Serverless Function entry point.
 * Wraps Express application and ensures database connection reuse across invocations.
 */
export default async function handler(req: Request, res: Response) {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
    } catch (err: any) {
      console.error('[Vercel Serverless] Database connection failure:', err.message);
    }
  }

  return app(req, res);
}
