import * as v from 'valibot';
import { INVOICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
export var invoiceStatusEnum;
(function (invoiceStatusEnum) {
    invoiceStatusEnum["PENDING"] = "PENDING";
    invoiceStatusEnum["COMPLETED"] = "COMPLETED";
})(invoiceStatusEnum || (invoiceStatusEnum = {}));
export const updateInvoiceValidationSchema = v.object({
    service_id: v.pipe(v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED), v.integer(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_INVALID)),
    client_id: v.pipe(v.number(INVOICE_VALIDATION_MESSAGES.CLIENT_ID_REQUIRED), v.integer(INVOICE_VALIDATION_MESSAGES.CLIENT_ID_INVALID)),
    invoice_status: v.optional(v.enum(invoiceStatusEnum, INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_STATUS)),
    invoice_date: v.pipe(v.string(INVOICE_VALIDATION_MESSAGES.INVOICE_DATE_REQUIRED), v.transform((dateStr) => new Date(dateStr)), v.date(INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_DATE)),
    invoice_amount: (v.number(INVOICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED))
});
