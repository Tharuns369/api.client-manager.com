import * as v from 'valibot';
import { CLIENT_VALIDATION_MESSAGES } from '../../constants/messaegConstants';

const alphaRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$|^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const clientValidationSchema = v.object({
  client_name: v.pipe(
    v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED),
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED)
  ),
  company_name: v.pipe(
    v.string(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED),
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED)
  ),
  poc: v.pipe(
    v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED),
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED),
  ),
  email: v.pipe(
    v.string(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED),
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED),
    v.regex(emailRegex,CLIENT_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT)
  ),
  phone: v.pipe(
    v.string(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED),  
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED),    
    v.regex(phoneRegex, CLIENT_VALIDATION_MESSAGES.PHONE_INVALID),
  ),
  secondary_phone: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.SECONDARY_PHONE_REQUIRED)
  ),
  status: v.optional(
    v.enum(StatusEnum, CLIENT_VALIDATION_MESSAGES.INVALID_STATUS)
  ),
  remarks: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.REMARKS_INVALID)
  ),
  bussiness_url: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.BUSINESS_URL_INVALID)
  ),
  address: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.ADDRESS_INVALID)
  ),
  state: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.STATE_INVALID)
  ),
  city: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.CITY_INVALID)
  ),
  gst: v.optional(
    v.boolean(CLIENT_VALIDATION_MESSAGES.GST_INVALID)
  ),
  country: v.optional(
    v.string(CLIENT_VALIDATION_MESSAGES.COUNTRY_INVALID)
  ),
  total_invoice_amount: v.optional(
    v.number(CLIENT_VALIDATION_MESSAGES.TOTAL_INVOICE_AMOUNT_INVALID)
  )
});

export type ClientValidationInput = v.InferInput<typeof clientValidationSchema>;
