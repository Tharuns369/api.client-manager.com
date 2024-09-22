import { Hono } from 'hono';
import { ClientServicesController } from '../controllers/clientServicesController';
const clientServicesController = new ClientServicesController();

const clientServicesRouter = new Hono();


clientServicesRouter.post('/add' ,clientServicesController.addClientService);
clientServicesRouter.get('/all' ,clientServicesController.getAllClientServices);
clientServicesRouter.get('/:id' ,clientServicesController.getClientService);
clientServicesRouter.delete('/:id' ,clientServicesController.deleteClientService);


export default clientServicesRouter;
