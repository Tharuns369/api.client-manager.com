import { Context } from 'hono';
import { SERVICES_MESSAGES } from '../constants/messaegConstants';
import { NotFoundException } from '../exceptions/notFoundException';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { FilterHelper } from '../helpers/filterHelper';
import { ServiceDataServiceProvider } from '../services/servicesDataServiceProvider';

const servicesDataServiceProvider = new ServiceDataServiceProvider();

const filterHelper = new FilterHelper();

export class ServicesController {

  async getTotalServices(c: Context) {
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


  async listServices(c: Context) {
    try {

      const query = c.req.query();
      const page: number = parseInt(query.page || '1');
      const limit: number = parseInt(query.limit || '10');
      const sort: string = sortHelper.sort(query);

      const filters = filterHelper.services(query);

      const skip: number = (page - 1) * limit;

      const [invoicesList, totalCount]: any = await Promise.all([
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
    } catch (error) {
      throw error;
    }
  }

  async updateService(c: Context) {
    try {
      const id = +c.req.param('id');

      if (isNaN(id)) {
        return ResponseHelper.sendErrorResponse(c, 400, SERVICES_MESSAGES.SERVICE_ID_INVALID);
      }

      const body = await c.req.json();

      const service = await servicesDataServiceProvider.getServiceById(id);

      if (!service) {
        throw new NotFoundException(SERVICES_MESSAGES.SERVICE_NOT_FOUND);
      }

      const updatedService = await servicesDataServiceProvider.editService(id, body);

      return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_UPDATE_SUCCESS, updatedService);

    } catch (error) {
      throw error;
    }
  }

  async deleteService(c: Context) {
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

    } catch (error) {
      throw error;
    }
  }



}
