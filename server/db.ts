import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Don't throw error - allow app to use memory storage instead
  // Just export a dummy db that won't be used
  export const db = null as any;
} else {
  const pool = new Pool({ connectionString });
  export const db = drizzle(pool);
}
