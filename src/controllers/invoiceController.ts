import { Context } from "hono";
import { CLIENT_MESSAGES, INVOICE_VALIDATION_MESSAGES, INVOICES_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from "../exceptions/notFoundException";
import { FilterHelper } from "../helpers/filterHelper";
import { paginationHelper } from "../helpers/paginationResponseHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { sortHelper } from "../helpers/sortHelper";
import validate from "../helpers/validationHelper";
import { InvoicesDataServiceProvider } from "../services/invoicesDataServiceProvider";
import { InvoiceValidationInput, InvoiceValidationSchema } from "../validations/invoiceValidations/addInvoiceValidationSchema";
import { InvoiceFileValidationInput, invoiceFileValidationSchema } from "../validations/invoiceFilesValidations/invoiceFileValidationSchema";
import { FileHelper } from "../helpers/fileHelper";
import { S3FileService } from "../services/s3DataServiceProvider";
import { ServiceDataServiceProvider } from "../services/servicesDataServiceProvider";
import { ClientsDataServiceProvider } from "../services/clientsDataServiceProvider";
import { UpdateInvoiceValidationSchema, updateInvoiceValidationSchema } from "../validations/invoiceValidations/updateInvoiceValidationSchema";

const s3FileService = new S3FileService();
const filterHelper = new FilterHelper();

const invoicesDataServiceProvider = new InvoicesDataServiceProvider();
const fileHelper = new FileHelper();
const servicesDataServiceProvider = new ServiceDataServiceProvider();
const clientsDataServiceProvider = new ClientsDataServiceProvider();

export class InvoiceController {


    async addInvoice(c: Context) {
        try {
            const invoiceData = await c.req.json();

            const validatedData: InvoiceValidationInput = await validate(InvoiceValidationSchema, invoiceData);

            const newInvoice = await invoicesDataServiceProvider.insertInvoice(invoiceData);

            await servicesDataServiceProvider.updateInvoiceAmountByServiceIds(validatedData);

            await clientsDataServiceProvider.updateInvoiceAmountByClientIds(validatedData);

            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_ADDED_SUCCESS, newInvoice);

        } catch (error) {
            console.error('Error in addInvoice:', error);
            throw error;
        }
    }

    async getTotalInvoicesAmount(c: Context) {
        try {

            const query = c.req.query();

            const filters = filterHelper.invoices(query);

            let result = await invoicesDataServiceProvider.getInvoiceAmountSum(filters);

            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.TOTAL_AMOUNT_FETCHED_SUCCESS, result);
        } catch (error) {
            throw error;
        }
    }

    async listInvoices(c: Context) {
        try {

            const query = c.req.query();
            const page: number = parseInt(query.page || '1');
            const limit: number = parseInt(query.limit || '10');
            const skip: number = (page - 1) * limit;
            const filters = filterHelper.invoices(query);
            const sort = sortHelper.sort(query);

            await invoicesDataServiceProvider.getInvoices({ limit, skip, filters, sort });

            const [invoicesList, totalCount]: any = await Promise.all([
                invoicesDataServiceProvider.getInvoices({ skip, limit, filters, sort }),
                invoicesDataServiceProvider.getInvoicesCount(filters)
            ]);

            const listInvoicesWithDownloadUrls = await Promise.all(
                invoicesList.map(async (invoice: any) => {
                    // Only generate the URL if the key is not null or undefined
                    if (invoice.key) {
                        const slug = 'client_invoices' + '/' + invoice.client_id;
                        const download_url = await s3FileService.generatePresignedUrl(
                            invoice.key,
                            'get',
                            slug,
                        );
                        invoice.url = download_url;
                    } else {
                        invoice.url = null; // Optionally set the URL to null if no key
                    }

                    return invoice;
                }),
            );



            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                data: listInvoicesWithDownloadUrls,
                message: INVOICES_MESSAGES.INVOICES_FETCHED_SUCCESS
            });

            return c.json(response);

        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }

    async viewInvoice(c: Context) {
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

    async uploadInvoice(c: Context) {

        try {

            const inputBody = await c.req.json();

            const validatedData: InvoiceFileValidationInput = await validate(invoiceFileValidationSchema, inputBody);

            const fileName = await fileHelper.fileNameHelper(validatedData.file_name);

            const slug = 'client_invoices' + '/' + validatedData.client_id;

            const targetUrl = await s3FileService.generatePresignedUrl(
                fileName,
                'put',
                slug
            );

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


    async updateInvoice(c: Context) {
        try {
            const id = +c.req.param('id');

            const body = await c.req.json();

            const validatedData: UpdateInvoiceValidationSchema = await validate(updateInvoiceValidationSchema, body);


            const invoice = await invoicesDataServiceProvider.getInvoiceById(id);

            if (!invoice) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }

            const updatedInvoice = await invoicesDataServiceProvider.editInvoice(id, body);

            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.INVOICE_UPDATE_SUCCESS, updatedInvoice);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async downloadInvoice(c: Context) {
        try {

            const id = +c.req.param('id');

            console.log("id", id);

            const invoiceFile = await invoicesDataServiceProvider.getInvoiceFileById(id);

            if (!invoiceFile) {
                throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
            }

            const slug = 'client_invoices' + '/' + invoiceFile.client_id;

            const downloadUrl = await s3FileService.generatePresignedUrl(
                invoiceFile.key,
                'get',
                slug
            );

            let data = {
                download_url: downloadUrl
            };

            return ResponseHelper.sendSuccessResponse(c, 201, INVOICE_VALIDATION_MESSAGES.INVOICE_DOWNLOADED_SUCCESS, data);

        }
        catch (error) {

            throw error;
        }
    }


    async getInvoiceFiles(c: Context) {

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


    async latestInvoices(c: Context) {
        try {

            const query = c.req.query();

            const filters = filterHelper.invoices(query);

            const invoicesList = await invoicesDataServiceProvider.getFiveLatestInvoices(filters);

            return ResponseHelper.sendSuccessResponse(c, 201, "latest invoices fetched successfully", invoicesList);


        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }

    async listInvoicesByClientId(c: Context) {
        try {
            const id = c.req.param('client_id');

            if (!id) {
                return ResponseHelper.sendErrorResponse(c, 400, CLIENT_MESSAGES.CLIENT_ID_REQUIRED);
            }
            const invoicesList = await invoicesDataServiceProvider.getAllInvoicesByClientId(id);

            if (invoicesList.length === 0) {
                return ResponseHelper.sendErrorResponse(c, 404, INVOICES_MESSAGES.INVOICES_NOT_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(c, 200, INVOICES_MESSAGES.INVOICES_FETCHED_SUCCESS, invoicesList);

        } catch (error) {
            console.error("Error fetching invoices:", error);
            throw error;
        }
    }


}
