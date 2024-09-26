import * as v from 'valibot';
import { INVOICE_FILES_VALIDATION_MESSAGES, } from '../../constants/messaegConstants';
export var invoiceStatusEnum;
(function (invoiceStatusEnum) {
    invoiceStatusEnum["PENDING"] = "PENDING";
    invoiceStatusEnum["COMPLETED"] = "COMPLETED";
})(invoiceStatusEnum || (invoiceStatusEnum = {}));
export const invoiceFileItemValidationSchema = v.object({
    file_name: v.pipe(v.string(INVOICE_FILES_VALIDATION_MESSAGES.FILE_NAME_INVALID), v.nonEmpty(INVOICE_FILES_VALIDATION_MESSAGES.FILE_NAME_REQUIRED)),
    size: v.optional(v.pipe(v.number(INVOICE_FILES_VALIDATION_MESSAGES.INVALID_SIZE), v.integer(INVOICE_FILES_VALIDATION_MESSAGES.SIZE_NOT_INTEGER))),
    client_id: v.pipe(v.number(INVOICE_FILES_VALIDATION_MESSAGES.CLIENT_ID_REQUIRED), v.integer(INVOICE_FILES_VALIDATION_MESSAGES.INVALID_CLIENT_ID)),
    invoice_id: v.pipe(v.number(INVOICE_FILES_VALIDATION_MESSAGES.INVOICE_ID_REQUIRED), v.integer(INVOICE_FILES_VALIDATION_MESSAGES.INVALID_INVOICE_ID)),
    key: v.optional(v.string(INVOICE_FILES_VALIDATION_MESSAGES.FILE_NAME_INVALID))
});
export const InvoiceFileValidationSchema = v.array(invoiceFileItemValidationSchema);
