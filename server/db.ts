
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Default to a local development database URL if not provided
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

// Create connection pool
export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
