import { Hono } from 'hono';
import { ServicesController } from '../controllers/servicesController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const servicesRouter = new Hono();
const servicesController = new ServicesController();
const authMiddleware = new AuthMiddleware();


servicesRouter.get('/count',authMiddleware.checkAndValidateAuthToken, servicesController.getTotalServices);
// servicesRouter.get('/',authMiddleware.checkAndValidateAuthToken, servicesController.listServices);
servicesRouter.post('/',authMiddleware.checkAndValidateAuthToken, servicesController.addService);
servicesRouter.patch('/:id',authMiddleware.checkAndValidateAuthToken, servicesController.updateService);
servicesRouter.delete('/:id',authMiddleware.checkAndValidateAuthToken, servicesController.deleteService);
servicesRouter.get('/dashboard/invoice-amount',authMiddleware.checkAndValidateAuthToken, servicesController.listServicesWiseInvoicesAmount);
servicesRouter.get('/count',authMiddleware.checkAndValidateAuthToken, servicesController.getTotalServices);
servicesRouter.get('/',authMiddleware.checkAndValidateAuthToken, servicesController.listServices);
// servicesRouter.post('/',authMiddleware.checkAndValidateAuthToken, servicesController.addService);
servicesRouter.patch('/:id',authMiddleware.checkAndValidateAuthToken, servicesController.updateService);
servicesRouter.delete('/:id',authMiddleware.checkAndValidateAuthToken, servicesController.deleteService);
servicesRouter.get('/drop-down',authMiddleware.checkAndValidateAuthToken, servicesController.getlistServiceForDropDown);
servicesRouter.get('/:id',authMiddleware.checkAndValidateAuthToken,servicesController.getService)

servicesRouter.get('/recurring-type/invoice-count',authMiddleware.checkAndValidateAuthToken, servicesController.getInvoiceAmountCountForRecurringServiceType);
servicesRouter.get('/one-time-type/invoice-count',authMiddleware.checkAndValidateAuthToken, servicesController.getInvoiceAmountCountForOneTimeServiceType);




export default servicesRouter;
