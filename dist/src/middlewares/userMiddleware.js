import { safeParse, flatten } from 'valibot';
import { ResponseHelper } from '../helpers/responseHelper';
import { VALIDATION_MESSAGES } from '../constants/messaegConstants';
import { userValidationSchema } from '../validations/userValidations';
export class UserValidationsMiddleWare {
    async validateEvent(c, next) {
        try {
            const body = await c.req.json();
            const result = safeParse(userValidationSchema, body, { abortPipeEarly: true });
            if (result.issues) {
                const flatData = flatten(result.issues);
                let firstError;
                if (flatData.root && flatData.root[0]) {
                    firstError = flatData.root[0];
                }
                else if (flatData.nested) {
                    const nestedKeys = Object.keys(flatData.nested);
                    if (nestedKeys.length > 0 && flatData.nested[nestedKeys[0]]) {
                        firstError = flatData.nested[nestedKeys[0]][0];
                    }
                }
                else if (flatData.other && flatData.other[0]) {
                    firstError = flatData.other[0];
                }
                if (firstError) {
                    return ResponseHelper.sendValidationErrorResponse(c, 422, VALIDATION_MESSAGES.VALIDATION_ERROR, { message: firstError });
                }
            }
            await next();
        }
        catch (error) {
            console.error('Validation Error:', error);
            return ResponseHelper.sendErrorResponse(c, 500, VALIDATION_MESSAGES.SERVER_ERROR, null, { error: error });
        }
    }
}
