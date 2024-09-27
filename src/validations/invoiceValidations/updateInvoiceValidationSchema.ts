import * as v from 'valibot';
import { INVOICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
export enum invoiceStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
export const updateInvoiceValidationSchema = v.object({
  name: v.optional(
    v.string(INVOICE_VALIDATION_MESSAGES.INVOICE_NAME_INVALID)
  ),
  
  service_id: v.optional(
    v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED),
  ),
  client_id: v.optional(
    v.number(INVOICE_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED)
  ),
  invoice_status: v.optional(
    v.enum(invoiceStatusEnum, INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_STATUS)
  ),
  remarks: v.optional(
   
      v.string(INVOICE_VALIDATION_MESSAGES.REMARKS_INVALID)
  ),
  invoice_date: v.optional(
    v.string(INVOICE_VALIDATION_MESSAGES.INVOICE_DATE_REQUIRED),
  ),
  payment_date: v.optional(
      v.string(INVOICE_VALIDATION_MESSAGES.INVALID_INVOICE_DATE)
  ),
  invoice_amount: v.optional(
   v.number(INVOICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED)
  ) 
});

export type UpdateInvoiceValidationSchema = v.InferInput<typeof updateInvoiceValidationSchema>;