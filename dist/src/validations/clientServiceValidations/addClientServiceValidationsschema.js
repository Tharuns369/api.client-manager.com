import * as v from 'valibot';
import { CLIENT_SERVICES_VALIDATION_MESSAGES } from '../../constants/messaegConstants';
export var ClientServiceStatusEnum;
(function (ClientServiceStatusEnum) {
    ClientServiceStatusEnum["ACTIVE"] = "ACTIVE";
    ClientServiceStatusEnum["INACTIVE"] = "INACTIVE";
})(ClientServiceStatusEnum || (ClientServiceStatusEnum = {}));
export const clientServiceValidationSchema = v.object({
    title: v.pipe(v.string(CLIENT_SERVICES_VALIDATION_MESSAGES.TITLE_REQUIRED), v.minLength(1, CLIENT_SERVICES_VALIDATION_MESSAGES.TITLE_INVALID)),
    client_id: v.pipe(v.number(CLIENT_SERVICES_VALIDATION_MESSAGES.CLIENT_ID_REQUIRED), v.integer(CLIENT_SERVICES_VALIDATION_MESSAGES.CLIENT_ID_INVALID)),
    service_id: v.pipe(v.number(CLIENT_SERVICES_VALIDATION_MESSAGES.SERVICE_ID_REQUIRED), v.integer(CLIENT_SERVICES_VALIDATION_MESSAGES.SERVICE_ID_INVALID)),
    status: v.optional(v.enum(ClientServiceStatusEnum, CLIENT_SERVICES_VALIDATION_MESSAGES.STATUS_INVALID)),
    invoice_amount: v.pipe(v.number(CLIENT_SERVICES_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED), v.transform((value) => Number(value)), v.number(CLIENT_SERVICES_VALIDATION_MESSAGES.INVOICE_AMOUNT_INVALID))
});
