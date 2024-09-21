import { Context } from "hono";
import { InvoicesDataServiceProvider } from "../services/invoicesDataServiceProvider";
import { COMMON_VALIDATIONS, INVOICE_VALIDATION_MESSAGES, INVOICES_MESSAGES } from "../constants/messaegConstants";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { sortHelper } from "../helpers/sortHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { NotFoundException } from "../exceptions/notFoundException";
import { InvoiceValidationInput, invoiceValidationSchema } from "../validations/invoiceValidations/addInvoiceValidationSchema";
import validate from "../helpers/validationHelper";
import { ResourceAlreadyExistsException } from "../exceptions/resourceAlreadyExistsException";

const invoicesDataServiceProvider = new InvoicesDataServiceProvider();

export class InvoiceController {
    async getTotalInvoicesAmount(c: Context) {
        try {
            const result = await invoicesDataServiceProvider.getTotalInvoicesAmount();
            const amountInINR = result.totalAmount; 
            return ResponseHelper.sendSuccessResponse(c, 200,INVOICES_MESSAGES.TOTAL_AMOUNT_FETCHED_SUCCESS,amountInINR);
        } catch (error) {
            throw error
        }
    }

    async listInvoices(c: Context) {
        try {
            
            const query = c.req.query();
            const page: number = parseInt(query.page || '1');
            const limit: number = parseInt(query.limit || '10');
            const sortString: string = sortHelper.resultsSort(query);
    
            const skip: number = (page - 1) * limit;
    
            const [invoicesList, totalCount]: any = await Promise.all([
            invoicesDataServiceProvider.getInvoices(limit, skip, sortString),
            invoicesDataServiceProvider.getInvoiceCount()
            ]);
    
            if ( invoicesList.length === 0) {
                throw new NotFoundException( INVOICES_MESSAGES.INVOICES_NOT_FOUND)
            }
    
            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount, 
                limit,
                data: invoicesList,
                message: INVOICES_MESSAGES.INVOICES_FETCHED_SUCCESS
            });
    
            return c.json(response);
    
        } catch (error) {
            throw error
           }
        }

    async viewInvoice(c: Context) {
        return c.json({ message: "Invoice details fetched", invoice: { id: 1, amount: 200 } });
    }

    async uploadInvoice(c: Context) {
        return c.json({ message: "Invoice uploaded successfully" });
    }

    async addInvoice(c: Context) {
        try {
          const invoiceData = await c.req.json();
          
          const validatedData: InvoiceValidationInput = await validate(invoiceValidationSchema, invoiceData);
          
          const existingInvoice = await invoicesDataServiceProvider.getInvoice(validatedData.service_id);

          if (existingInvoice) {
            throw new ResourceAlreadyExistsException("service_id", INVOICE_VALIDATION_MESSAGES.INVOICE_ALREADY_EXISTS);
          }
      
          const newInvoice = await invoicesDataServiceProvider.insertInvoice(invoiceData);
      
          return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_ADDED_SUCCESS, newInvoice);
          
        } catch (error) {
          console.error('Error in addInvoice:', error);
          throw error;
        }
      }
      

    async updateInvoice(c: Context) {
        try {
            const id = +c.req.param('id');
            
            const body = await c.req.json();

            const invoice = await invoicesDataServiceProvider.getInvoice(id);
    
            if (!invoice) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
              }
    
            const updatedInvoice = await invoicesDataServiceProvider.editInvoice(id, body);
    
            return ResponseHelper.sendSuccessResponse(c, 200,INVOICES_MESSAGES.INVOICE_UPDATE_SUCCESS,updatedInvoice);
    
        } catch (error) {
            throw error;
          }
       }
}
