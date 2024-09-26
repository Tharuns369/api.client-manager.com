import * as v from 'valibot';
import { SERVICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';

const alphaNumericRegex = /^[a-zA-Z\s]+$/;

export enum StatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum ServiceTypesEnum {
    RECURRING = 'RECURRING',
    ONETIME = 'ONE-TIME',
}

export const serviceValidationSchema = v.object({
    service_name: v.pipe(
        v.string(SERVICE_VALIDATION_MESSAGES.SERVICE_NAME_REQUIRED),
        v.nonEmpty(SERVICE_VALIDATION_MESSAGES.SERVICE_NAME_REQUIRED),
        v.regex(alphaNumericRegex, SERVICE_VALIDATION_MESSAGES.SERVICE_NAME_INVALID)
    ),
    type: v.pipe(
        v.string(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED),
        v.enum(ServiceTypesEnum, SERVICE_VALIDATION_MESSAGES.INVALID_TYPE)
    ),
    status: v.optional(
        v.enum(StatusEnum, SERVICE_VALIDATION_MESSAGES.INVALID_STATUS)
    ),
    invoice_amount: v.optional(
        v.number(SERVICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED)
    )
});

export type ServiceValidationInput = v.InferInput<typeof serviceValidationSchema>;
