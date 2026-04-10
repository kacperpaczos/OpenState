import { isDbAvailable } from "@/lib/db-check";
import { DatabaseForbidden } from "./DatabaseForbidden";

/**
 * Server Component that checks database health.
 * If DB is down, blocks the UX with a splash screen.
 */
export async function DatabaseStatusWrapper() {
  const available = await isDbAvailable();
  
  if (!available) {
    return <DatabaseForbidden />;
  }
  
  return null; // Don't show anything if everything is fine
}
