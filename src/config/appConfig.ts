import * as dotenv from 'dotenv';
import { Config } from '../utils/types';

dotenv.config({ path: '.env' });

const app_version = "v1.0";

export const CONFIG: Config = {
  VERSION: app_version,
  DB: {
    password: process.env.DB_PASSWORD!,
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT)!,
    database: process.env.DB_NAME!,
    ca: process.env.DB_CA!
  }

};