import { ClientsServicesDataServiceProvider } from '../services/clientsServicesDataServiceProvider';
import { COMMON_VALIDATIONS, SERVICES_MESSAGES } from '../constants/messaegConstants';
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
                return c.json({
                    status: false,
                    message: SERVICES_MESSAGES.SERVICES_NOT_EXIST,
                    data: []
                }, 200);
            }
            return c.json({
                status: true,
                message: SERVICES_MESSAGES.SERVICE_COUNT,
                data: totalClientCount
            }, 200);
        }
        catch (error) {
            console.error('Error at Services count:', error);
            return c.json({
                status: 'Error',
                message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            }, 500);
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
                return c.json({
                    status: 'False',
                    message: SERVICES_MESSAGES.SERVICES_NOT_FOUND,
                    data: []
                });
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
            console.error('Error at list of Services:', error);
            return c.json({
                status: 'Error',
                message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            }, 500);
        }
    }
    async addService(c) {
        const result = await clientsServicesDataServiceProvider.addService();
        return c.json(result);
    }
    async updateService(c) {
        try {
            const id = parseInt(c.req.param('id'), 10);
            if (isNaN(id)) {
                return ResponseHelper.sendErrorResponse(c, 400, 'Invalid Service ID');
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
            const queryId = c.req.param('id');
            const id = Number(queryId);
            if (isNaN(id)) {
                return c.json({
                    success: false,
                    message: COMMON_VALIDATIONS.INVALID_CLIENT_ID,
                    data: []
                });
            }
            const service = await clientsServicesDataServiceProvider.getService(id);
            if (!service) {
                return c.json({
                    success: false,
                    message: SERVICES_MESSAGES.SERVICE_ID_NOT_FOUND(id),
                    data: []
                });
            }
            await clientsServicesDataServiceProvider.deleteService(id);
            return c.json({
                success: true,
                message: SERVICES_MESSAGES.SERVICE_DELETED_SUCCESS,
                data: service
            });
        }
        catch (error) {
            console.error('Error at delete Service:', error);
            return c.json({
                success: false,
                message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
                data: []
            }, 500);
        }
    }
}
