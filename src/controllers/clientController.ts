import { Context } from 'hono';
import { ClientsDataServiceProvider } from '../services/clientsDataServiceProvider';
import { CLIENT_MESSAGES, COMMON_VALIDATIONS } from '../constants/messaegConstants';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { NotFoundException } from '../exceptions/notFoundException';
import { BadRequestException } from '../exceptions/badRequestException';
import { ClientValidationInput, clientValidationSchema } from '../validations/clientsValidations/addClientValidations';
import validate from '../helpers/validationHelper';
import { ResourceAlreadyExistsException } from '../exceptions/resourceAlreadyExistsException';
import { FilterHelper } from '../helpers/filterHelper';

const clientsDataServiceProvider = new ClientsDataServiceProvider();
const filterHelper = new FilterHelper();

export class ClientsController {

  async addClient(c: Context) {
    try {
      const clientData = await c.req.json();

      const validatedData: ClientValidationInput = await validate(clientValidationSchema, clientData);

      const existingClient = await clientsDataServiceProvider.findClientByEmail(validatedData.email);
      if (existingClient) {
        throw new ResourceAlreadyExistsException("email", CLIENT_MESSAGES.CLIENT_EMAIL_ALREADY_EXISTS);
      }

      const newClient = await clientsDataServiceProvider.insertClient(clientData);

      return ResponseHelper.sendSuccessResponse(c, 201, CLIENT_MESSAGES.CLIENT_ADDED_SUCCESS, newClient);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTotalClients(c: Context) {
    try {

      const filters = await filterHelper.clients(c.req.query());

      const totalClientCount = await clientsDataServiceProvider.getclientsCount(filters);

      if (!totalClientCount) {
        return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENTS_NOT_EXIST);
      }

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENTS_COUNT, totalClientCount);
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async listClients(c: Context) {
    try {
      const query = c.req.query();
      const page: number = parseInt(query.page || '1');
      const limit: number = parseInt(query.limit || '10');
      const skip: number = (page - 1) * limit;

      const sort: string = sortHelper.sort(query);

      const filters = filterHelper.clients(query);

      const [invoicesList, totalCount]: any = await Promise.all([
        clientsDataServiceProvider.getClientsWithPagenation({ skip, limit, filters, sort }),
        clientsDataServiceProvider.getclientsCount(filters)
      ]);

      const response = paginationHelper.getPaginationResponse({
        page,
        count: totalCount,
        limit,
        data: invoicesList,
        message: CLIENT_MESSAGES.CLIENT_LIST_FETCH_SUCCESS
      });

      return c.json(response);

    } catch (error) {
      throw error;
    }
  }


  async getClient(c: Context) {
    try {
      const id = +c.req.param('id');

      if (isNaN(id)) {

        throw new BadRequestException(COMMON_VALIDATIONS.INVALID_CLIENT_ID);
      }

      const client: any = await clientsDataServiceProvider.getClientById(id);

      if (!client) {
        return ResponseHelper.sendErrorResponse(c, 200, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_FETCH_SUCCESS, client);

    } catch (error) {
      throw error;
    }
  }

  async deleteClient(c: Context) {
    try {
      const id = +c.req.param('id');

      if (isNaN(id)) {
        throw new BadRequestException(COMMON_VALIDATIONS.INVALID_CLIENT_ID);
      }

      const client = await clientsDataServiceProvider.getClientById(id);

      if (!client) {
        throw new NotFoundException(CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      await clientsDataServiceProvider.deleteClient(id);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_DELETED_SUCCESS);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async updateClient(c: Context) {
    try {
      const id = +c.req.param('id');

      const body = await c.req.json();

      const client: any = await clientsDataServiceProvider.getClientById(id);

      if (!client) {
        throw new NotFoundException(CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      await clientsDataServiceProvider.editClient(id, body);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_UPDATE_SUCCESS);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }



  async getClientsWiseInvoiceAmountCount(c: Context) {
    try {      
      const clientsAmountCount = await clientsDataServiceProvider.allClientsInvoiceAmountCount();     
      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_BASED_SERVICES_FETCH_SUCCESS, clientsAmountCount);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }



  async getClientsWiseServices(c: Context) {
    try {

      const clientId = +c.req.param('id');

      const client = await clientsDataServiceProvider.getClientById(clientId);

      if (!client) {
        return ResponseHelper.sendErrorResponse(c, 200, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(clientId));
      }

      const clientsWiseServicesData = await clientsDataServiceProvider.getClientsWiseServices(clientId);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_BASED_SERVICES_FETCH_SUCCESS, clientsWiseServicesData);

    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getClientWiseInvoices(c: Context) {
    try {

      const clientId = +c.req.param('id');

      const query = c.req.query();

      let invoiceStatus: 'PENDING' | 'COMPLETED' | undefined;
      if (query.invoice_status === 'PENDING' || query.invoice_status === 'COMPLETED') {
        invoiceStatus = query.invoice_status;
      }

      const clientsWiseServicesData = await clientsDataServiceProvider.getClientsWiseInvoices(clientId, query.from_date, query.to_date, invoiceStatus);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_BASED_INVOICES_FETCH_SUCCESS, clientsWiseServicesData);

    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }


  async exportClientsAsJson(c: Context) {
    try {
      const clients = await clientsDataServiceProvider.getAllClients();

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_LIST_EXPORT_SUCCESS, clients);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


}

