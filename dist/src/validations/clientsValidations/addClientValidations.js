import * as v from 'valibot';
import { CLIENT_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const indiaPhoneNumberRegex = /^(?:\+91[-.\s]?|91[-.\s]?|0)?[6-9]\d{4}[-.\s]?\d{5}$/; // Matches +91 or 10 digits
const usaPhoneNumberRegex = /^(?:\+1[-.\s]?|1[-.\s]?|\(1\)\s?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/; // Matches +1 or 10 digits
const ukPhoneNumberRegex = /^(?:\+44[-.\s]?|0)?(?:\d{4}[-.\s]?|\(?\d{3}\)?[-.\s]?)?\d{6}$/; // Matches +44 or 10 digits
const australiaPhoneNumberRegex = /^(?:\+61[-.\s]?|0)?(?:2[-.\s]?\d{4}[-.\s]?\d{4}|\d{2}[-.\s]?\d{4}[-.\s]?\d{4}|\d{4}[-.\s]?\d{4})$/; // Matches +61 or 9 digits
// Combined regex for all countries
const combinedPhoneRegex = new RegExp(`^(${indiaPhoneNumberRegex.source}|${usaPhoneNumberRegex.source}|${ukPhoneNumberRegex.source}|${australiaPhoneNumberRegex.source})$`);
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "ACTIVE";
    StatusEnum["INACTIVE"] = "INACTIVE";
})(StatusEnum || (StatusEnum = {}));
export const clientValidationSchema = v.object({
    client_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.transform((value) => value.trim()), v.minLength(3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED)),
    company_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.transform((value) => value.trim()), v.minLength(3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED)),
    poc: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.transform((value) => value.trim()), v.minLength(3, CLIENT_VALIDATION_MESSAGES.MIN_REQUIRED)),
    email: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.regex(emailRegex, CLIENT_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT), v.transform((value) => value.trim())),
    phone: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED), v.transform((value) => value.trim()), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED), // Check for non-empty
    v.custom((value) => {
        const phoneValue = value;
        const countryCodeRegex = /^\+\d{1,4}[-.\s]*$/;
        // Check if only the country code is entered
        if (countryCodeRegex.test(phoneValue) && phoneValue.length < 8) {
            return false; // Validation fails, return false
        }
        return true; // Valid input
    }, CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED), // Pass the message for failure
    v.regex(combinedPhoneRegex, CLIENT_VALIDATION_MESSAGES.PHONE_INVALID) // Validate against the complete phone number format
    ),
    secondary_phone: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.SECONDARY_PHONE_REQUIRED)),
    status: v.optional(v.enum(StatusEnum, CLIENT_VALIDATION_MESSAGES.INVALID_STATUS)),
    remarks: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.REMARKS_INVALID)),
    business_url: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.BUSINESS_URL_INVALID)),
    address: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.ADDRESS_INVALID)),
    state: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.STATE_INVALID)),
    city: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.CITY_INVALID)),
    gst: v.optional(v.boolean(CLIENT_VALIDATION_MESSAGES.GST_INVALID)),
    country: v.optional(v.string(CLIENT_VALIDATION_MESSAGES.COUNTRY_INVALID)),
    total_invoice_amount: v.optional(v.number(CLIENT_VALIDATION_MESSAGES.TOTAL_INVOICE_AMOUNT_INVALID))
});
