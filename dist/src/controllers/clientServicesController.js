import { ClientsServicesDataServiceProvider } from '../services/clientsServicesDataServiceProvider';
import { ResponseHelper } from '../helpers/responseHelper';
import { BadRequestException } from '../exceptions/badRequestException';
import { NotFoundException } from '../exceptions/notFoundException';
import { CLIENT_SERVICES_MESSAGES } from '../constants/messaegConstants';
import { clientServiceValidationSchema } from '../validations/clientServiceValidations/addClientServiceValidationsschema';
import validate from '../helpers/validationHelper';
const clientServicesDataServiceProvider = new ClientsServicesDataServiceProvider();
export class ClientServicesController {
    async addClientService(c) {
        try {
            const data = await c.req.json();
            const validatedData = await validate(clientServiceValidationSchema, data);
            const newClientService = await clientServicesDataServiceProvider.addClientService(data);
            return ResponseHelper.sendSuccessResponse(c, 201, CLIENT_SERVICES_MESSAGES.ADD_SUCCESS, newClientService);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getAllClientServices(c) {
        try {
            const clientServices = await clientServicesDataServiceProvider.getAllClientServices();
            return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_SERVICES_MESSAGES.FETCH_SUCCESS, clientServices);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getClientService(c) {
        try {
            const id = +c.req.param('id');
            if (isNaN(id)) {
                throw new BadRequestException(CLIENT_SERVICES_MESSAGES.INVALID_ID);
            }
            const clientService = await clientServicesDataServiceProvider.getClientServiceById(id);
            if (!clientService) {
                throw new NotFoundException(CLIENT_SERVICES_MESSAGES.ID_NOT_FOUND(id));
            }
            return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_SERVICES_MESSAGES.FETCH_BY_ID_SUCCESS(id), clientService);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteClientService(c) {
        try {
            const id = +c.req.param('id');
            if (isNaN(id)) {
                throw new BadRequestException(CLIENT_SERVICES_MESSAGES.INVALID_ID);
            }
            const clientService = await clientServicesDataServiceProvider.getClientServiceById(id);
            if (!clientService) {
                throw new NotFoundException(CLIENT_SERVICES_MESSAGES.ID_NOT_FOUND(id));
            }
            await clientServicesDataServiceProvider.deleteClientService(id);
            return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_SERVICES_MESSAGES.DELETE_SUCCESS(id));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}
