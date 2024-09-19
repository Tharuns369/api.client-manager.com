import * as v from 'valibot';
import { VALIDATION_MESSAGES } from '../constants/messaegConstants';

const alphaRegex = /^[a-zA-Z\s]+$/;

export const userSignInValidationSchema = v.object({
  email: v.pipe(
    v.string(VALIDATION_MESSAGES.EMAIL_REQUIRED),
    v.nonEmpty(VALIDATION_MESSAGES.EMAIL_REQUIRED),
    v.email(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT)
  ),
  password: v.pipe(
    v.string(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
    v.nonEmpty(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
    v.minLength(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  ),
});
