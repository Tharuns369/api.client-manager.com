import { Hono } from 'hono';
import { ClientsController } from '../controllers/clientController';

const clientsRouter = new Hono();
const clientsController = new ClientsController();

clientsRouter.get('/count',  clientsController.getTotalClients);
clientsRouter.get('/',  clientsController.listClients);
clientsRouter.get('/:id',  clientsController.getClient);
clientsRouter.post('/add',  clientsController.addClient);
clientsRouter.patch('/update/:id',  clientsController.updateClient);
clientsRouter.delete('/:id',  clientsController.deleteClient);
clientsRouter.get('/export',  clientsController.exportClients);

export default clientsRouter;
