import { Context } from 'hono';
import { COMMON_VALIDATIONS, SERVICES_MESSAGES } from '../constants/messaegConstants';
import { NotFoundException } from '../exceptions/notFoundException';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { FilterHelper } from '../helpers/filterHelper';
import { ServiceDataServiceProvider } from '../services/servicesDataServiceProvider';
import { ServiceValidationInput, serviceValidationSchema } from '../validations/serviceValidations/addServiceValidation';
import validate from '../helpers/validationHelper';
import { ServiceUpdateValidationInput, serviceUpdateValidationSchema } from '../validations/serviceValidations/updateServiceInputValidations';
import { BadRequestException } from '../exceptions/badRequestException';


const servicesDataServiceProvider = new ServiceDataServiceProvider();

const filterHelper = new FilterHelper();

export class ServicesController {


  async addService(c: Context) {
    try {
      const serviceData = await c.req.json();

      const validatedData: ServiceValidationInput = await validate(serviceValidationSchema, serviceData);

      // const slug = slugify(validatedData.service_name, { lower: true });

      // validatedData.slug = slug;


      const newService = await servicesDataServiceProvider.insertService(serviceData);

      console.log(newService);


      return ResponseHelper.sendSuccessResponse(c, 201, SERVICES_MESSAGES.SERVICE_ADDED_SUCCESS, newService);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getService(c: Context) {
    try {
      console.log("try");

      const id = +c.req.param('id');

      if (isNaN(id)) {

        throw new BadRequestException(COMMON_VALIDATIONS.INVALID_SERVICE_ID);
      }

      const service = await servicesDataServiceProvider.getServiceById(id);

      if (!service) {
        throw new NotFoundException(SERVICES_MESSAGES.SERVICE_NOT_FOUND);
      }

      return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICE_FETCHED_SUCCESS, service);

    } catch (error) {
      throw error;
    }

  }



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

      const validatedData: ServiceUpdateValidationInput = await validate(serviceUpdateValidationSchema, body);


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


  async listServicesWiseInvoicesAmount(c: Context) {
    try {

      const query = c.req.query();

      const filters = filterHelper.services(query);

      const invoicesList: any = await servicesDataServiceProvider.getServiceForDashBoard(filters);

      return ResponseHelper.sendSuccessResponse(c, 200, "Services wise invoice amount fetched successfuly", invoicesList);


    } catch (error) {
      throw error;
    }
  }


  async getlistServiceForDropDown(c: Context) {

    try {

      const listServices = await servicesDataServiceProvider.listDropDown();

      return ResponseHelper.sendSuccessResponse(c, 200, SERVICES_MESSAGES.SERVICES_FETCHED_SUCCESS, listServices);

    } catch (error) {
      throw error;
    }
  }

  async getInvoiceAmountCountForRecurringServiceType(c: Context) {
    try {

      const filters = filterHelper.invoicesForRecurringServices(c.req.query());

      const totalAmount = await servicesDataServiceProvider.getInvoiceAmountCountBasedOnServiceType(filters);

      return ResponseHelper.sendSuccessResponse(c, 200, "Recurring service types invoice amount", totalAmount);

    } catch (error) {
      throw error;
    }
  }

  async getInvoiceAmountCountForOneTimeServiceType(c: Context) {
    try {

      const filters = filterHelper.invoicesForOneTimeServices(c.req.query());

      const totalAmount = await servicesDataServiceProvider.getInvoiceAmountCountBasedOnServiceType(filters);

      return ResponseHelper.sendSuccessResponse(c, 200, "One time service types invoice amount", totalAmount);

    } catch (error) {
      throw error;
    }
  }


}
