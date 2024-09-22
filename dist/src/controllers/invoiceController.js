import { INVOICE_VALIDATION_MESSAGES, INVOICES_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from "../exceptions/notFoundException";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { sortHelper } from "../helpers/sortHelper";
import validate from "../helpers/validationHelper";
import { InvoicesDataServiceProvider } from "../services/invoicesDataServiceProvider";
import { addinvoiceItemValidationSchema } from "../validations/invoiceValidations/addInvoiceValidationSchema";
import { invoiceFileValidationSchema } from "../validations/invoiceFilesValidations/invoiceFileValidationSchema";
import { FileHelper } from "../helpers/fileHelper";
import { S3FileService } from "../services/s3DataServiceProvider";
import { FilterHelper } from "../helpers/filterHelper";
const s3FileService = new S3FileService();
const filterHelper = new FilterHelper();
const invoicesDataServiceProvider = new InvoicesDataServiceProvider();
const fileHelper = new FileHelper();
export class InvoiceController {
    async addInvoice(c) {
        try {
            const invoiceData = await c.req.json();
            const validatedData = await validate(addinvoiceItemValidationSchema, invoiceData);
            const newInvoice = await invoicesDataServiceProvider.insertInvoice(invoiceData);
            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_ADDED_SUCCESS, newInvoice);
        }
        catch (error) {
            console.error('Error in addInvoice:', error);
            throw error;
        }
    }
    async getTotalInvoicesAmount(c) {
        try {
            const query = c.req.query();
            const filters = filterHelper.invoices(query);
            const result = await invoicesDataServiceProvider.getInvoiceCount(filters);
            const amountInINR = result;
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
            const skip = (page - 1) * limit;
            const sort = sortHelper.sort(query);
            const filters = filterHelper.invoices(query);
            const [invoicesList, totalCount] = await Promise.all([
                invoicesDataServiceProvider.getInvoices({ limit, skip, filters, sort }),
                invoicesDataServiceProvider.getInvoiceCount(filters)
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
        try {
            const inputBody = await c.req.json();
            const validatedData = await validate(invoiceFileValidationSchema, inputBody);
            const fileName = await fileHelper.fileNameHelper(validatedData.file_name);
            const slug = 'client_invoices' + '/' + validatedData.client_id;
            const targetUrl = await s3FileService.generatePresignedUrl(fileName, 'put', slug);
            validatedData.key = fileName;
            await invoicesDataServiceProvider.addInvoiceFile(validatedData);
            let data = {
                key: fileName,
                file_name: validatedData.file_name,
                size: validatedData.size,
                upload_url: targetUrl,
            };
            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_UPLOADED_SUCCESS, data);
        }
        catch (error) {
            console.log(error);
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
