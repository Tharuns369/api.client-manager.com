import { Hono } from 'hono';
import { InvoiceController } from '../controllers/invoiceController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const invoicesRouter = new Hono();
const invoicesController = new InvoiceController();
const authMiddleware = new AuthMiddleware();


invoicesRouter.get('/amount',authMiddleware.checkAndValidateAuthToken, invoicesController.getTotalInvoicesAmount);
invoicesRouter.get('/',authMiddleware.checkAndValidateAuthToken, invoicesController.listInvoices);
invoicesRouter.get('/:id',authMiddleware.checkAndValidateAuthToken, invoicesController.viewInvoice);
invoicesRouter.post('/upload',authMiddleware.checkAndValidateAuthToken, invoicesController.uploadInvoice);
invoicesRouter.post('/',authMiddleware.checkAndValidateAuthToken, invoicesController.addInvoice);
invoicesRouter.patch('/:id',authMiddleware.checkAndValidateAuthToken, invoicesController.updateInvoice);
invoicesRouter.get('/files/:id/download',authMiddleware.checkAndValidateAuthToken, invoicesController.downloadInvoice);

invoicesRouter.get('/:id/invoice-files',authMiddleware.checkAndValidateAuthToken, invoicesController.getInvoiceFiles);

invoicesRouter.get('/latest/five',authMiddleware.checkAndValidateAuthToken, invoicesController.latestInvoices);
invoicesRouter.get('/list/:client_id',authMiddleware.checkAndValidateAuthToken, invoicesController.listInvoicesByClientId);

invoicesRouter.delete('files/:id',authMiddleware.checkAndValidateAuthToken, invoicesController.deleteInvoice);


export default invoicesRouter;
