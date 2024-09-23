import * as v from 'valibot';
import { SERVICE_VALIDATION_MESSAGES } from '../../constants/messaegConstants';


const alphaNumericRegex = /^[a-zA-Z\s]+$/; 

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const serviceUpdateValidationSchema = v.object({
   
        type: v.pipe(
            v.string(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED),
            v.nonEmpty(SERVICE_VALIDATION_MESSAGES.TYPE_REQUIRED),
            v.regex(alphaNumericRegex, SERVICE_VALIDATION_MESSAGES.TYPE_INVALID)
          ),
          status: v.optional(
            v.enum(StatusEnum, SERVICE_VALIDATION_MESSAGES.INVALID_STATUS)
          ),
          invoice_amount: v.optional( v.number(SERVICE_VALIDATION_MESSAGES.INVOICE_AMOUNT_REQUIRED) )
        });

export type ServiceUpdateValidationInput = v.InferInput<typeof serviceUpdateValidationSchema>;
