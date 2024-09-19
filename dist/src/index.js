import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { CONFIG } from './config/appConfig';
import router from './routers/mainRouter';
const app = new Hono();
app.use(logger());
app.use('*', cors());
app.route(`/${CONFIG.VERSION}`, router);
const port = 3000;
serve({
    fetch: app.fetch,
    port
});
console.log(`Server is running on port ${port}`);
