import { defineConfig } from "drizzle-kit";
import { ConfigData } from "./src/config/appConfig";
export default defineConfig({
    schema: "./src/schemas/*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        user: ConfigData.DB.user,
        password: ConfigData.DB.password,
        host: ConfigData.DB.host,
        port: ConfigData.DB.port,
        database: ConfigData.DB.database,
        ssl: {
            rejectUnauthorized: true,
            ca: ConfigData.DB.ca,
        },
    }
});
