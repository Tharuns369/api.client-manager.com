import { Hono } from 'hono';
import { ClientsController } from '../controllers/clientController';
import { AuthMiddleware } from '../middlewares/authMiddleware';


const clientsRouter = new Hono();
const clientsController = new ClientsController();
const authMiddleware = new AuthMiddleware();


clientsRouter.get('/count', authMiddleware.checkAndValidateAuthToken, clientsController.getTotalClients);
clientsRouter.get('/', authMiddleware.checkAndValidateAuthToken, clientsController.listClients);
clientsRouter.get('/:id', authMiddleware.checkAndValidateAuthToken, clientsController.getClient);
clientsRouter.post('/', authMiddleware.checkAndValidateAuthToken, clientsController.addClient);
clientsRouter.patch('/:id', authMiddleware.checkAndValidateAuthToken, clientsController.updateClient);
clientsRouter.delete('/:id', authMiddleware.checkAndValidateAuthToken, clientsController.deleteClient);
// clientsRouter.get('/export', authMiddleware.checkAndValidateAuthToken, clientsController.exportClients);
clientsRouter.get('/:id/services', authMiddleware.checkAndValidateAuthToken, clientsController.getClientsWiseServices);
clientsRouter.get('/:id/invoices', authMiddleware.checkAndValidateAuthToken, clientsController.getClientWiseInvoices);

// clientsRouter.get('/export', authMiddleware.checkAndValidateAuthToken, clientsController.exportClients);

export default clientsRouter;
