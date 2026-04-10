import { db } from "@/src/db";
import { sql } from "drizzle-orm";

/**
 * Checks if the database is reachable.
 * Useful for fallback mechanisms or displaying service status.
 */
export async function isDbAvailable(): Promise<boolean> {
  try {
    // Simple query to verify connection
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Helper to ensure we don't crash on DB errors.
 */
export async function withDbFallback<T>(
  dbQuery: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    return await dbQuery();
  } catch (error) {
    console.error("Database query failed, using fallback:", error);
    return fallbackValue;
  }
}
