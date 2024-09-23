import { INVOICE_VALIDATION_MESSAGES, INVOICES_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from "../exceptions/notFoundException";
import { FilterHelper } from "../helpers/filterHelper";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { sortHelper } from "../helpers/sortHelper";
import validate from "../helpers/validationHelper";
import { InvoicesDataServiceProvider } from "../services/invoicesDataServiceProvider";
import { InvoiceValidationSchema } from "../validations/invoiceValidations/addInvoiceValidationSchema";
import { invoiceFileValidationSchema } from "../validations/invoiceFilesValidations/invoiceFileValidationSchema";
import { FileHelper } from "../helpers/fileHelper";
import { S3FileService } from "../services/s3DataServiceProvider";
import { ServiceDataServiceProvider } from "../services/servicesDataServiceProvider";
import { ClientsDataServiceProvider } from "../services/clientsDataServiceProvider";
import { updateInvoiceValidationSchema } from "../validations/invoiceValidations/updateInvoiceValidationSchema";
const s3FileService = new S3FileService();
const filterHelper = new FilterHelper();
const invoicesDataServiceProvider = new InvoicesDataServiceProvider();
const fileHelper = new FileHelper();
const servicesDataServiceProvider = new ServiceDataServiceProvider();
const clientsDataServiceProvider = new ClientsDataServiceProvider();
export class InvoiceController {
    async addInvoice(c) {
        try {
            const invoiceData = await c.req.json();
            const validatedData = await validate(InvoiceValidationSchema, invoiceData);
            const newInvoice = await invoicesDataServiceProvider.insertInvoice(invoiceData);
            await servicesDataServiceProvider.updateInvoiceAmountByServiceIds(validatedData);
            await clientsDataServiceProvider.updateInvoiceAmountByClientIds(validatedData);
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
            let result = await invoicesDataServiceProvider.getInvoiceAmountSum(filters);
            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.TOTAL_AMOUNT_FETCHED_SUCCESS, result);
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
            const invoicesList = await invoicesDataServiceProvider.getInvoices({ limit, skip, filters, sort });
            const response = paginationHelper.getPaginationResponse({
                page,
                count: invoicesList.length,
                limit,
                data: invoicesList,
                message: INVOICES_MESSAGES.INVOICES_FETCHED_SUCCESS
            });
            return c.json(response);
        }
        catch (error) {
            console.log("error", error);
            throw error;
        }
    }
    async viewInvoice(c) {
        try {
            const id = +c.req.param('id');
            const invoice = await invoicesDataServiceProvider.getInvoiceByIdWithPopulate(id);
            if (!invoice) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }
            return ResponseHelper.sendSuccessResponse(c, 200, "Invoice fetched successfully", invoice);
        }
        catch (error) {
            throw error;
        }
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
            const validatedData = await validate(updateInvoiceValidationSchema, body);
            const invoice = await invoicesDataServiceProvider.getInvoiceById(id);
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
    async downloadInvoice(c) {
        try {
            const id = +c.req.param('id');
            console.log("id", id);
            const invoiceFile = await invoicesDataServiceProvider.getInvoiceFileById(id);
            if (!invoiceFile) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }
            const slug = 'client_invoices' + '/' + invoiceFile.client_id;
            const downloadUrl = await s3FileService.generatePresignedUrl(invoiceFile.key, 'get', slug);
            let data = {
                download_url: downloadUrl
            };
            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_DOWNLOADED_SUCCESS, data);
        }
        catch (error) {
            throw error;
        }
    }
    async getInvoiceFiles(c) {
        try {
            const id = +c.req.param('id');
            const invoice = await invoicesDataServiceProvider.getInvoiceById(id);
            if (!invoice) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }
            const files = await invoicesDataServiceProvider.getInvoiceFiles(id);
            return ResponseHelper.sendSuccessResponse(c, 201, "Invoice files fetched successfully", files);
        }
        catch (error) {
            throw error;
        }
    }
}
