import { ServicesService } from '../services/servicesService';
import { COMMON_VALIDATIONS, SERVICES_MESSAGES } from '../constants/messaegConstants';
import { sortHelper } from '../helpers/sortHelper';
import { paginationHelper } from '../helpers/paginationResponseHelper';
const servicesService = new ServicesService();
export class ServicesController {
    async getTotalServices(c) {
        try {
            const totalClientCount = await servicesService.getTotalServicesCount();
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
                servicesService.getServices(limit, skip, sortString),
                servicesService.getSrvicesCount()
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
        const result = await servicesService.addService();
        return c.json(result);
    }
    async updateService(c) {
        const { id } = c.req.param();
        const result = await servicesService.updateService(id);
        return c.json(result);
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
            const service = await servicesService.getService(id);
            if (!service || service.length === 0) {
                return c.json({
                    success: false,
                    message: SERVICES_MESSAGES.SERVICE_ID_NOT_FOUND(id),
                    data: []
                });
            }
            await servicesService.deleteService(id);
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
