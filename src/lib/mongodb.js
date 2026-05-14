import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from "mongoose";
import { env } from "@/env";
import { logger } from "@/lib/logger";

const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.MONGODB_DB_NAME;

let cached = global.__midasMongoose;
if (!cached) {
  cached = global.__midasMongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      dbName: DB_NAME,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        logger.info({ db: DB_NAME }, "MongoDB connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        logger.error({ err }, "MongoDB connection failed");
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
