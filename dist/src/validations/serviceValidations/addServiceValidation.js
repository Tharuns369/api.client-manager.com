import * as v from 'valibot';
import { SERVICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
const alphaNumericRegex = /^[a-zA-Z0-9\s]+$/;
const amountRegex = /^\d+(\.\d{1,2})?$/;
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "ACTIVE";
    StatusEnum["INACTIVE"] = "INACTIVE";
})(StatusEnum || (StatusEnum = {}));
export const serviceValidationSchema = v.object({
    title: v.pipe(v.string(SERVICE_VALIDATION_MESSAGES.TITLE_REQUIRED), v.nonEmpty(SERVICE_VALIDATION_MESSAGES.TITLE_REQUIRED), v.regex(alphaNumericRegex, SERVICE_VALIDATION_MESSAGES.TITLE_INVALID)),
    type: v.pipe(v.string(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED), v.nonEmpty(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED), v.regex(alphaNumericRegex, SERVICE_VALIDATION_MESSAGES.TYPE_INVALID)),
    client_id: v.pipe(v.number(SERVICE_VALIDATION_MESSAGES.CLIENT_ID_REQUIRED), v.integer(SERVICE_VALIDATION_MESSAGES.CLIENT_ID_INVALID)),
    status: v.optional(v.enum(StatusEnum, SERVICE_VALIDATION_MESSAGES.INVALID_STATUS)),
    invoice_amount: v.optional(v.number(SERVICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED))
});
