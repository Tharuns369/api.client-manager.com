import * as v from 'valibot';
import { CLIENT_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
import UnprocessableContentException from '../../exceptions/unproccessableContentException';
const alphaRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneNumberRegex = /^\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "ACTIVE";
    StatusEnum["INACTIVE"] = "INACTIVE";
})(StatusEnum || (StatusEnum = {}));
export const clientValidationSchema = v.object({
    client_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.transform((value) => value.trim()), v.minLength(1, CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.custom((value) => value.length >= 3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED), v.transform((value) => value.trim())),
    company_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.transform((value) => value.trim()), v.minLength(1, CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.custom((value) => value.length >= 3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED), v.transform((value) => value.trim())),
    poc: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.transform((value) => value.trim()), v.minLength(1, CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.custom((value) => value.length >= 3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED), v.transform((value) => value.trim())),
    email: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.regex(emailRegex, CLIENT_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT), v.transform((value) => value.trim())),
    phone: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED), v.transform((value) => value.trim()), // Trim leading/trailing whitespace
    v.nonEmpty(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED), // Input is not empty
    // Custom validation logic
    v.custom((value) => {
        // Regex to match country code (optional, with or without spaces)
        const countryCodeRegex = /^\+\d{1,4}\s*/;
        // Remove country code and trim the result
        let phoneWithoutCountryCode = value.replace(countryCodeRegex, '').trim();
        // Remove all non-numeric characters (spaces, hyphens, etc.)
        const digitsOnly = phoneWithoutCountryCode.replace(/[^\d]/g, '');
        // If no digits are entered after the country code, throw a 'required' error
        if (countryCodeRegex.test(value) && digitsOnly.length === 0) {
            throw new UnprocessableContentException(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED);
        }
        // Ensure the phone number has at least 7 digits and at most 15 digits
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
            throw new UnprocessableContentException(CLIENT_VALIDATION_MESSAGES.PHONE_INVALID);
        }
        return true; // Pass validation if length is correct
    }), 
    // Regex validation for general phone number format
    v.regex(phoneNumberRegex, CLIENT_VALIDATION_MESSAGES.PHONE_INVALID)),
    secondary_phone: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.SECONDARY_PHONE_REQUIRED)),
    status: v.optional(v.enum(StatusEnum, CLIENT_VALIDATION_MESSAGES.INVALID_STATUS)),
    remarks: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.REMARKS_INVALID)),
    bussiness_url: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.BUSINESS_URL_INVALID)),
    address: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.ADDRESS_INVALID)),
    state: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.STATE_INVALID)),
    city: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.CITY_INVALID)),
    gst: v.optional(v.boolean(CLIENT_VALIDATION_MESSAGES.GST_INVALID)),
    country: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.COUNTRY_INVALID)),
    total_invoice_amount: v.optional(v.number(CLIENT_VALIDATION_MESSAGES.TOTAL_INVOICE_AMOUNT_INVALID))
});
