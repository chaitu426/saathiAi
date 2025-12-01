import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';
import {environment} from "./environment.js";


const pool = new Pool({
  connectionString: environment.databaseURL,
  connectionTimeoutMillis: 10000, // 10s
  idleTimeoutMillis: 30000, // optional
});

export const db = drizzle(pool, { schema });
