import * as v from 'valibot';
import { CLIENT_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
const alphaRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{4,9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "ACTIVE";
    StatusEnum["INACTIVE"] = "INACTIVE";
})(StatusEnum || (StatusEnum = {}));
export const clientUpdateValidationSchema = v.object({
    client_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED), v.regex(alphaRegex, CLIENT_VALIDATION_MESSAGES.CLIENT_NAME_INVALID)),
    company_name: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_REQUIRED), v.regex(alphaRegex, CLIENT_VALIDATION_MESSAGES.COMPANY_NAME_VALIDATIONAS)),
    poc: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.CLIENT_POC_REQUIRED), v.regex(alphaRegex, CLIENT_VALIDATION_MESSAGES.CLIENT_POC_INVALID)),
    email: v.pipe(v.string(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.nonEmpty(CLIENT_VALIDATION_MESSAGES.EMAIL_REQUIRED), v.regex(emailRegex, CLIENT_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT)),
    //   phone: v.pipe(
    //     v.string(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED),
    //     v.nonEmpty(CLIENT_VALIDATION_MESSAGES.PHONE_REQUIRED),
    //     v.regex(phoneRegex, CLIENT_VALIDATION_MESSAGES.PHONE_INVALID)
    //   )
});
