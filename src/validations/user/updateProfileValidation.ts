import * as v from 'valibot';
import { VALIDATION_MESSAGES } from '../../constants/messaegConstants';

const alphaRegex = /^[a-zA-Z\s]+$/;

export const updateUserValidationSchema = v.object({
  first_name: v.optional(
    v.pipe(
      v.string(VALIDATION_MESSAGES.FIRST_NAME_STRING),
      v.nonEmpty(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
      v.regex(alphaRegex, VALIDATION_MESSAGES.FIRST_NAME_INVALID),
      v.minLength(2, VALIDATION_MESSAGES.FIRST_NAME_TOO_SHORT)
    )
  ),
  last_name: v.optional(
    v.pipe(
      v.string(VALIDATION_MESSAGES.LAST_NAME_STRING),
      v.nonEmpty(VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
      v.regex(alphaRegex, VALIDATION_MESSAGES.LAST_NAME_INVALID),
      v.minLength(2, VALIDATION_MESSAGES.LAST_NAME_TOO_SHORT)
    )
  ),
  email: v.optional(
    v.pipe(
      v.string(VALIDATION_MESSAGES.EMAIL_REQUIRED),
      v.nonEmpty(VALIDATION_MESSAGES.EMAIL_REQUIRED),
      v.email(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT)
    )
  ),
  phone: v.optional(
    v.pipe(
      v.string(VALIDATION_MESSAGES.PHONE_REQUIRED),
      v.nonEmpty(VALIDATION_MESSAGES.PHONE_REQUIRED),
      v.regex(/^\d{10}$/, VALIDATION_MESSAGES.PHONE_TOO_SHORT)
    )
  ),
  password: v.optional(
    v.pipe(
      v.string(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
      v.nonEmpty(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
      v.minLength(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    )
  ),
});

export type updateprofilerValidationDataInput = v.InferInput<typeof updateUserValidationSchema>;
