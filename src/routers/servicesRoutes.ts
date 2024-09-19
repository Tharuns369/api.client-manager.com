import { Hono } from 'hono';
import { ServicesController } from '../controllers/servicesController';

const servicesRouter = new Hono();
const servicesController = new ServicesController();

servicesRouter.get('/count', (c) => servicesController.getTotalServices(c));
servicesRouter.get('/', (c) => servicesController.listServices(c));
servicesRouter.post('/add', (c) => servicesController.addService(c));
servicesRouter.put('/:id', (c) => servicesController.updateService(c));
servicesRouter.delete('/:id', (c) => servicesController.deleteService(c));

export default servicesRouter;
