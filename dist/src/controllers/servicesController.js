import { ServicesService } from '../services/servicesService';
import { COMMON_VALIDATIONS, SERVICES_VALIDATIONS } from '../constants/messaegConstants';
import { sortHelper } from '../helpers/sortHelper';
import { paginationHelper } from '../helpers/paginationResponseHelper';
const servicesService = new ServicesService();
export class ServicesController {
    async getTotalServices(c) {
        const result = await servicesService.getTotalServices();
        return c.json(result);
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
                    message: SERVICES_VALIDATIONS.SERVICES_NOT_FOUND,
                    data: []
                });
            }
            const response = paginationHelper.getPaginationResponse({
                page,
                count: totalCount,
                limit,
                data: invoicesList,
                message: SERVICES_VALIDATIONS.SERVICES_FETCHED_SUCCESS
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
        const { id } = c.req.param();
        const result = await servicesService.deleteService(id);
        return c.json(result);
    }
}
