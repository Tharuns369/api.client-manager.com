import { ClientsServicesDataServiceProvider } from '../services/clientsServicesDataServiceProvider';
import { SERVICES_MESSAGES } from '../constants/messaegConstants';
import { sortHelper } from '../helpers/sortHelper';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { NotFoundException } from '../exceptions/notFoundException';
const clientsServicesDataServiceProvider = new ClientsServicesDataServiceProvider();
export class ServicesController {
    async getTotalServices(c) {
        try {
            const totalClientCount = await clientsServicesDataServiceProvider.getTotalServicesCount();
            if (!totalClientCount) {
                return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICES_NOT_EXIST);
            }
            return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_COUNT, totalClientCount);
        }
        catch (error) {
            throw error;
        }
    }
    async listServices(c) {
        try {
            const query = c.req.query();
            const page = parseInt(query.page || '1');
            const limit = parseInt(query.limit || '10');
            const sortString = sortHelper.resultsSort(query);
            const skip = (page - 1) * limit;
            const [invoicesList, totalCount] = await Promise.all([
                clientsServicesDataServiceProvider.getServices(limit, skip, sortString),
                clientsServicesDataServiceProvider.getSrvicesCount()
            ]);
            if (!invoicesList || invoicesList.length === 0) {
                throw new NotFoundException(SERVICES_MESSAGES.SERVICES_NOT_FOUND);
            }
            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                data: invoicesList,
                message: SERVICES_MESSAGES.SERVICES_FETCHED_SUCCESS
            });
            return c.json(response);
        }
        catch (error) {
            throw error;
        }
    }
    async addService(c) {
        const result = await clientsServicesDataServiceProvider.addService();
        return c.json(result);
    }
    async updateService(c) {
        try {
            const id = +c.req.param('id');
            if (isNaN(id)) {
                return ResponseHelper.sendErrorResponse(c, 400, SERVICES_MESSAGES.SERVICE_ID_INVALID);
            }
            const body = await c.req.json();
            const service = await clientsServicesDataServiceProvider.getService(id);
            if (!service) {
                throw new NotFoundException(SERVICES_MESSAGES.SERVICE_NOT_FOUND);
            }
            const updatedService = await clientsServicesDataServiceProvider.editService(id, body);
            return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_UPDATE_SUCCESS, updatedService);
        }
        catch (error) {
            throw error;
        }
    }
    async deleteService(c) {
        try {
            const id = +c.req.param('id');
            if (isNaN(id)) {
                return ResponseHelper.sendErrorResponse(c, 400, SERVICES_MESSAGES.SERVICE_ID_INVALID);
            }
            const service = await clientsServicesDataServiceProvider.getService(id);
            if (!service) {
                return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_ID_NOT_FOUND(id));
            }
            await clientsServicesDataServiceProvider.deleteService(id);
            return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_DELETED_SUCCESS, service);
        }
        catch (error) {
            throw error;
        }
    }
}
