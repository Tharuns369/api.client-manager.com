import { Context } from "hono";
import { InvoicesService } from "../services/invoiceServices";
import { COMMON_VALIDATIONS, INVOICES_VALIDATIONS } from "../constants/messaegConstants";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { sortHelper } from "../helpers/sortHelper";


const invoicesService = new InvoicesService();

export class InvoiceController {
    async getTotalInvoiceAmount(c: Context) {
        return c.json({ message: "Total invoice amount fetched", total: 1000 });
    }

    async listInvoices(c: Context) {
        try {
            
            const query = c.req.query();
            const page: number = parseInt(query.page || '1');
            const limit: number = parseInt(query.limit || '10');
            const sortString: string = sortHelper.resultsSort(query);
    
            const skip: number = (page - 1) * limit;
    
            const [invoicesList, totalCount]: any = await Promise.all([
                invoicesService.getInvoices(limit, skip, sortString),
                invoicesService.getInvoiceCount()
            ]);
    
            if (!invoicesList || invoicesList.length === 0) {
                return c.json({
                    status: 'False',
                    message: INVOICES_VALIDATIONS.INVOICES_NOT_FOUND,
                    data: []
                });
            }
    
            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount, 
                limit,
                data: invoicesList,
                message: INVOICES_VALIDATIONS.INVOICES_FETCHED_SUCCESS
            });
    
            return c.json(response);
    
        } catch (error) {
            console.error('Error at list of invoices:', error);
            return c.json({
                status: 'Error',
                message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            }, 500);
           }
        }

    async viewInvoice(c: Context) {
        return c.json({ message: "Invoice details fetched", invoice: { id: 1, amount: 200 } });
    }

    async uploadInvoice(c: Context) {
        return c.json({ message: "Invoice uploaded successfully" });
    }

    async addInvoice(c: Context) {
        return c.json({ message: "Invoice added successfully" });
    }

    async updateInvoice(c: Context) {
        return c.json({ message: "Invoice updated successfully" });
    }
}
