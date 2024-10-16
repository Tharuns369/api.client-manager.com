import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { ConfigData } from './config/appConfig';
import userRoutes from './routers/userRoutes';
import clientsRouter from './routers/clientRouters';
import servicesRouter from './routers/servicesRoutes';
import invoicesRouter from './routers/invoicesRoutes';
const app = new Hono();
app.use(logger());
app.use('*', cors());
app.route('/' + ConfigData.VERSION + '/users', userRoutes);
app.route('/' + ConfigData.VERSION + '/clients', clientsRouter);
app.route('/' + ConfigData.VERSION + '/services', servicesRouter);
app.route('/' + ConfigData.VERSION + '/invoices', invoicesRouter);
const port = 3000;
serve({
    fetch: app.fetch,
    port
});
console.log(`Server is running on port ${port}`);
app.onError((err, c) => {
    c.status(err.status || 500);
    return c.json({
        success: false,
        status: err.status || 500,
        message: err.message || 'Something went wrong',
        errors: err.errData || null
    });
});
