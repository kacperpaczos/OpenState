import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Prevent multiple connections in development due to Hot Module Replacement
const globalForDb = globalThis as unknown as {
  connection: ReturnType<typeof postgres> | undefined;
};

// Use a single connection pool (max 1 for serverless/edge, can increase for Node)
const connection =
  globalForDb.connection ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
}

export const db = drizzle(connection, { schema });
export type DB = typeof db;
