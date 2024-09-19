import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { ConfigData } from "../config/appConfig";
const { Pool } = pg;
const pool = new Pool({
    user: ConfigData.DB.user,
    password: ConfigData.DB.password,
    host: ConfigData.DB.host,
    port: ConfigData.DB.port,
    database: ConfigData.DB.database,
    ssl: {
        rejectUnauthorized: true,
        ca: ConfigData.DB.ca,
    },
});
export const db = drizzle(pool);
