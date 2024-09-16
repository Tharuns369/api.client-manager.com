import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const app_version = "v1.0";
export const CONFIG = {
    VERSION: app_version,
    DB: {
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        ca: process.env.DB_CA
    }
};
