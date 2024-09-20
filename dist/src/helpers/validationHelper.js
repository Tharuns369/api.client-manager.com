import * as v from 'valibot';
import { VALIDATION_MESSAGES } from '../constants/messaegConstants';
import UnprocessableContentException from '../exceptions/unproccessableContentException';
const validate = (schema, data) => {
    const validatedData = v.safeParse(schema, data, { abortPipeEarly: true });
    if (!validatedData.success) {
        const issues = v.flatten(validatedData.issues);
        throw new UnprocessableContentException(VALIDATION_MESSAGES.VALIDATION_FAILED, issues.nested);
    }
    else {
        return validatedData.output;
    }
};
export default validate;
