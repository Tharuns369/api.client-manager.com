import { defineConfig } from "drizzle-kit";
import { CONFIG } from "./src/config/appConfig";

export default defineConfig({
    schema: "./src/schemas/*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        user: CONFIG.DB.user,
        password: CONFIG.DB.password,
        host: CONFIG.DB.host,
        port: CONFIG.DB.port,
        database: CONFIG.DB.database,
        ssl: {
            rejectUnauthorized: true,
            ca: CONFIG.DB.ca,
        },
    }
});