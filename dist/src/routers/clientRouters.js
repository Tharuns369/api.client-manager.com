import { Hono } from 'hono';
import { ClientsController } from '../controllers/clientController';
const clientsRouter = new Hono();
const clientsController = new ClientsController();
clientsRouter.get('/count', (c) => clientsController.getTotalClients(c));
clientsRouter.get('/', (c) => clientsController.listClients(c));
// clientsRouter.get('/:id', (c) => clientsController.getClient(c));
clientsRouter.post('/add', (c) => clientsController.addClient(c));
clientsRouter.put('/update/:id', (c) => clientsController.updateClient(c));
clientsRouter.delete('/:id', (c) => clientsController.deleteClient(c));
clientsRouter.get('/export', (c) => clientsController.exportClients(c));
export default clientsRouter;
