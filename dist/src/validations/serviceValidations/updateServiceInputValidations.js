import * as v from 'valibot';
import { SERVICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
const alphaNumericRegex = /^[a-zA-Z\s]+$/;
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "ACTIVE";
    StatusEnum["INACTIVE"] = "INACTIVE";
})(StatusEnum || (StatusEnum = {}));
export const serviceUpdateValidationSchema = v.object({
    type: v.pipe(v.string(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED), v.nonEmpty(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED), v.regex(alphaNumericRegex, SERVICE_VALIDATION_MESSAGES.TYPE_INVALID)),
    status: v.optional(v.enum(StatusEnum, SERVICE_VALIDATION_MESSAGES.INVALID_STATUS)),
    invoice_amount: v.optional(v.number(SERVICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED))
});
