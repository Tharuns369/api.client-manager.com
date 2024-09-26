import { SERVICES_MESSAGES } from '../constants/messaegConstants';
import { NotFoundException } from '../exceptions/notFoundException';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { FilterHelper } from '../helpers/filterHelper';
import { ServiceDataServiceProvider } from '../services/servicesDataServiceProvider';
import { serviceValidationSchema } from '../validations/serviceValidations/addServiceValidation';
import validate from '../helpers/validationHelper';
import { serviceUpdateValidationSchema } from '../validations/serviceValidations/updateServiceInputValidations';
const servicesDataServiceProvider = new ServiceDataServiceProvider();
const filterHelper = new FilterHelper();
export class ServicesController {
    async addService(c) {
        try {
            const serviceData = await c.req.json();
            const validatedData = await validate(serviceValidationSchema, serviceData);
            const newService = await servicesDataServiceProvider.insertService(serviceData);
            console.log(newService);
            return ResponseHelper.sendSuccessResponse(c, 201, SERVICES_MESSAGES.SERVICE_ADDED_SUCCESS, newService);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    // async getService(c:Context){
    //   try {
    //     const id = +c.req.param('id');
    //     if (isNaN(id)) {
    //       throw new BadRequestException(COMMON_VALIDATIONS.INVALID_CLIENT_ID);
    //     }
    //     const client: any = await servicesDataServiceProvider.getServiceById(id);
    //     if (!client) {
    //       throw new NotFoundException(COMMON_VALIDATIONS.INVALID_SERVICE_ID);
    //     }
    //     return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_FETCH_SUCCESS, client);
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    async getTotalServices(c) {
        try {
            const filters = await filterHelper.services(c.req.query());
            const totalClientCount = await servicesDataServiceProvider.getServicesCount(filters);
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
            const sort = sortHelper.sort(query);
            const filters = filterHelper.services(query);
            const skip = (page - 1) * limit;
            const [invoicesList, totalCount] = await Promise.all([
                servicesDataServiceProvider.getServices({ limit, skip, filters, sort }),
                servicesDataServiceProvider.getServicesCount(filters)
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
    async updateService(c) {
        try {
            const id = +c.req.param('id');
            if (isNaN(id)) {
                return ResponseHelper.sendErrorResponse(c, 400, SERVICES_MESSAGES.SERVICE_ID_INVALID);
            }
            const body = await c.req.json();
            const validatedData = await validate(serviceUpdateValidationSchema, body);
            const service = await servicesDataServiceProvider.getServiceById(id);
            if (!service) {
                throw new NotFoundException(SERVICES_MESSAGES.SERVICE_NOT_FOUND);
            }
            const updatedService = await servicesDataServiceProvider.editService(id, body);
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
            const service = await servicesDataServiceProvider.getServiceById(id);
            if (!service) {
                return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_ID_NOT_FOUND(id));
            }
            await servicesDataServiceProvider.deleteService(id);
            return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_DELETED_SUCCESS, service);
        }
        catch (error) {
            throw error;
        }
    }
    async listServicesWiseInvoicesAmount(c) {
        try {
            const query = c.req.query();
            const filters = filterHelper.services(query);
            const invoicesList = await servicesDataServiceProvider.getServiceForDashBoard(filters);
            return ResponseHelper.sendSuccessResponse(c, 200, "Services wise invoice amount fetched successfuly", invoicesList);
        }
        catch (error) {
            throw error;
        }
    }
    async getlistServiceForDropDown(c) {
        try {
            const listServices = await servicesDataServiceProvider.listDropDown();
            return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICES_FETCHED_SUCCESS, listServices);
        }
        catch (error) {
            throw error;
        }
    }
}
