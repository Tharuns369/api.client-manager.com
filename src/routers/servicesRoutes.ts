import { Hono } from 'hono';
import { ServicesController } from '../controllers/servicesController';

const servicesRouter = new Hono();
const servicesController = new ServicesController();

servicesRouter.get('/count', servicesController.getTotalServices);
servicesRouter.get('/', servicesController.listServices);
servicesRouter.post('/', servicesController.addService);
servicesRouter.patch('/:id', servicesController.updateService);
servicesRouter.delete('/:id', servicesController.deleteService);
servicesRouter.get('/dashboard/invoice-amount', servicesController.listServicesWiseInvoicesAmount);
servicesRouter.get('/count', servicesController.getTotalServices);
servicesRouter.get('/', servicesController.listServices);
servicesRouter.post('/', servicesController.addService);
servicesRouter.patch('/:id', servicesController.updateService);
servicesRouter.delete('/:id', servicesController.deleteService);
servicesRouter.get('/drop-down', servicesController.getlistServiceForDropDown);

servicesRouter.get('/recurring-type/invoice-count', servicesController.getInvoiceAmountCountForRecurringServiceType);
servicesRouter.get('/one-time/invoice-count', servicesController.getInvoiceAmountCountForOneTimeServiceType);


export default servicesRouter;
