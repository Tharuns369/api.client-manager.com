import { INVOICE_VALIDATION_MESSAGES, INVOICES_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from "../exceptions/notFoundException";
import { ResourceAlreadyExistsException } from "../exceptions/resourceAlreadyExistsException";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { sortHelper } from "../helpers/sortHelper";
import validate from "../helpers/validationHelper";
import { InvoicesDataServiceProvider } from "../services/invoicesDataServiceProvider";
import { invoiceValidationSchema } from "../validations/invoiceValidations/addInvoiceValidationSchema";
const invoicesDataServiceProvider = new InvoicesDataServiceProvider();
export class InvoiceController {
    async getTotalInvoicesAmount(c) {
        try {
            const result = await invoicesDataServiceProvider.getTotalInvoicesAmount();
            const amountInINR = result.totalAmount;
            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.TOTAL_AMOUNT_FETCHED_SUCCESS, amountInINR);
        }
        catch (error) {
            throw error;
        }
    }
    async listInvoices(c) {
        try {
            const query = c.req.query();
            const page = parseInt(query.page || '1');
            const limit = parseInt(query.limit || '10');
            const sortString = sortHelper.sort(query);
            const skip = (page - 1) * limit;
            const [invoicesList, totalCount] = await Promise.all([
                invoicesDataServiceProvider.getInvoices(limit, skip, sortString),
                invoicesDataServiceProvider.getInvoiceCount()
            ]);
            if (invoicesList.length === 0) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICES_NOT_FOUND);
            }
            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                data: invoicesList,
                message: INVOICES_MESSAGES.INVOICES_FETCHED_SUCCESS
            });
            return c.json(response);
        }
        catch (error) {
            throw error;
        }
    }
    async viewInvoice(c) {
        return c.json({ message: "Invoice details fetched", invoice: { id: 1, amount: 200 } });
    }
    async uploadInvoice(c) {
    }
    async addInvoice(c) {
        try {
            const invoiceData = await c.req.json();
            const validatedData = await validate(invoiceValidationSchema, invoiceData);
            const existingInvoice = await invoicesDataServiceProvider.getInvoice(validatedData.service_id);
            if (existingInvoice) {
                throw new ResourceAlreadyExistsException("service_id", INVOICE_VALIDATION_MESSAGES.INVOICE_ALREADY_EXISTS);
            }
            const newInvoice = await invoicesDataServiceProvider.insertInvoice(invoiceData);
            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_ADDED_SUCCESS, newInvoice);
        }
        catch (error) {
            console.error('Error in addInvoice:', error);
            throw error;
        }
    }
    async updateInvoice(c) {
        try {
            const id = +c.req.param('id');
            const body = await c.req.json();
            const invoice = await invoicesDataServiceProvider.getInvoice(id);
            if (!invoice) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }
            const updatedInvoice = await invoicesDataServiceProvider.editInvoice(id, body);
            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.INVOICE_UPDATE_SUCCESS, updatedInvoice);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}
