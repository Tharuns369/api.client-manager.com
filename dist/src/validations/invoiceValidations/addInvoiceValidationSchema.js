import * as v from 'valibot';
import { INVOICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
export var invoiceStatusEnum;
(function (invoiceStatusEnum) {
    invoiceStatusEnum["PENDING"] = "PENDING";
    invoiceStatusEnum["COMPLETED"] = "COMPLETED";
})(invoiceStatusEnum || (invoiceStatusEnum = {}));
export const invoiceItemValidationSchema = v.object({
<<<<<<< HEAD
    name: v.optional(v.string(INVOICE_VALIDATION_MESSAGES.INVOICE_NAME_INVALID)), service_id: v.pipe(v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED), v.integer(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_INVALID)),
=======
    name: v.optional(v.string("Invalid name")), service_id: v.pipe(v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED), v.integer(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_INVALID)),
>>>>>>> ed596cd1cc40c501b1dd32598b414bdc16178461
    client_id: v.pipe(v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED), v.integer(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_INVALID)),
    invoice_status: v.optional(v.enum(invoiceStatusEnum, INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_STATUS)),
    remarks: v.optional(v.pipe(v.string(INVOICE_VALIDATION_MESSAGES.REMARKS_INVALID), v.minLength(1, INVOICE_VALIDATION_MESSAGES.REMARKS_INVALID))),
    invoice_date: v.pipe(v.string(INVOICE_VALIDATION_MESSAGES.INVOICE_DATE_REQUIRED), v.transform((dateStr) => new Date(dateStr)), v.date(INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_DATE)),
    payment_date: v.optional(v.pipe(v.string(INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_DATE), v.transform((dateStr) => new Date(dateStr)), v.date(INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_DATE))),
    invoice_amount: v.number(INVOICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED)
});
export const InvoiceValidationSchema = v.array(invoiceItemValidationSchema);
