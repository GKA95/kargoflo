import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

// Avoid hung requests when disconnected by disabling default command buffering
mongoose.set('bufferCommands', false);

/**
 * Global cache interface for Mongoose connection reuse in Serverless / Vercel Functions.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export interface DatabaseStatus {
  isConnected: boolean;
  readyState: number;
  host?: string;
  name?: string;
  message: string;
}

/**
 * Connect to MongoDB Atlas with connection reuse suitable for Vercel Functions and Express.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

/**
 * Query current database health and connection state.
 */
export function getDatabaseStatus(): DatabaseStatus {
  const state = mongoose.connection.readyState;
  const uriConfigured = Boolean(process.env.MONGODB_URI);

  switch (state) {
    case 1:
      return {
        isConnected: true,
        readyState: 1,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        message: 'Connected to MongoDB Atlas',
      };
    case 2:
      return {
        isConnected: false,
        readyState: 2,
        message: 'Connecting to MongoDB Atlas...',
      };
    default:
      return {
        isConnected: false,
        readyState: state,
        message: uriConfigured
          ? 'Disconnected from MongoDB Atlas'
          : 'MONGODB_URI environment variable not configured',
      };
  }
}

/**
 * Express middleware to ensure database connection before executing controller actions
 */
export async function ensureDatabaseConnected(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      if ((mongoose.connection.readyState as number) === 1) {
        return next();
      }
    } catch {
      // Catch and return 503 below
    }
  }

  return res.status(503).json({
    success: false,
    error: 'Database service is currently unreachable. Please verify MONGODB_URI configuration.',
  });
}

