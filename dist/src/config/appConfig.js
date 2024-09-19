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
    },
    JWT: {
        token_secret: "DRXqa9r4UsjO5F0wMybN2BdTiKGmzAoLs82jjj#wsjld",
        token_life: 86400000, // in milliseconds - 1 Day
        refresh_token_secret: "wXyjKsdjlj#12ZpuoDsmg1MLP8CaHkfO2bUhrF6W",
        refresh_token_life: 172800000, // in seconds - 2 Hr
    }
};
