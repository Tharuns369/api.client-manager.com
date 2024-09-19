import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { CONFIG } from './config/appConfig';
import clientsRouter from './routers/clientRouters';
import invoicesRouter from './routers/invoicesRoutes';
import servicesRouter from './routers/servicesRoutes';
import userRoutes from './routers/userRoutes';

const app = new Hono();

app.use(logger());
app.use('*', cors());


app.get('/', (c) => {
  return c.text('Hello Hono!');
});


app.route('/' + CONFIG.VERSION + '/users', userRoutes);
app.route('/' + CONFIG.VERSION + '/clients', clientsRouter);
app.route('/' + CONFIG.VERSION + '/services', servicesRouter);
app.route('/' + CONFIG.VERSION + '/invoices', invoicesRouter);
app.route('/' + CONFIG.VERSION + '/invoices/files', invoicesRouter);


const port = 3000;

app.onError((err: any, c: Context) => {

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

