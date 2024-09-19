import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { CONFIG } from './config/appConfig';
import userRoutes from './routers/userRoutes';
const app = new Hono();
app.use(logger());
app.use('*', cors());
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
app.route('/' + CONFIG.VERSION + '/users', userRoutes);
// app.route('/' + CONFIG.VERSION + '/clients', clientsRouter);
// app.route('/' + CONFIG.VERSION + '/services', servicesRouter);
// app.route('/' + CONFIG.VERSION + '/invoices', invoicesRouter);
// app.route('/' + CONFIG.VERSION + '/invoices/files', invoicesRouter);
const port = 3000;
app.onError((err, c) => {
    c.status(err.status || 500);
    return c.json({
        success: false,
        status: err.status || 500,
        message: err.message || 'Something went wrong',
        errors: err.errData || null
    });
});
serve({
    fetch: app.fetch,
    port
});
console.log(`Server is running on port ${port}`);
