import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { CONFIG } from "../config/appConfig";
const { Pool } = pg;

const pool = new Pool({

    user: CONFIG.DB.user,
    password: CONFIG.DB.password,
    host: CONFIG.DB.host,
    port: CONFIG.DB.port,
    database: CONFIG.DB.database,
    ssl: {
        rejectUnauthorized: true,
        ca: CONFIG.DB.ca,
    },

});

export const db = drizzle(pool);