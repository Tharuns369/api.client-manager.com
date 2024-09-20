import { Hono } from 'hono';
import { InvoiceController } from '../controllers/invoiceController';

const invoicesRouter = new Hono();
const invoicesController = new InvoiceController();

invoicesRouter.get('/amount',  invoicesController.getTotalInvoicesAmount);
// invoicesRouter.get('/clients-total-amount',  invoicesController.getTotalInvoiceAmount);
// invoicesRouter.get('/services-total-amount',  invoicesController.getTotalInvoiceAmount);
invoicesRouter.get('/',  invoicesController.listInvoices);
invoicesRouter.get('/:id',  invoicesController.viewInvoice);
invoicesRouter.post('/upload',  invoicesController.uploadInvoice);
invoicesRouter.post('/add',  invoicesController.addInvoice);
invoicesRouter.patch('/:id',  invoicesController.updateInvoice);

export default invoicesRouter;
