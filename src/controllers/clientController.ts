import { Context } from 'hono';
import { ClientsDataServiceProvider } from '../services/clientsDataServiceProvider';
import { CLIENT_MESSAGES, COMMON_VALIDATIONS } from '../constants/messaegConstants';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { ResponseHelper } from '../helpers/responseHelper';
const clientsDataServiceProvider = new ClientsDataServiceProvider();

export class ClientsController {

  async getTotalClients(c: Context) {
    try {
      const totalClientCount = await clientsDataServiceProvider.getTotalClientsCount();

      if (!totalClientCount) {
        return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENTS_NOT_EXIST);
      }

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENTS_COUNT, totalClientCount);
    }
    catch (error) {
      throw error;
    }
  }

  async listClients(c: Context) {
    try {
      const query = c.req.query();
      const page: number = parseInt(query.page || '1');
      const limit: number = parseInt(query.limit || '10');
      const sortString: string = sortHelper.resultsSort(query);

      const skip: number = (page - 1) * limit;

      const [invoicesList, totalCount]: any = await Promise.all([
        clientsDataServiceProvider.getClientsWithPagenation(limit, skip, sortString),
        clientsDataServiceProvider.getclientsCount()
      ]);

      if (!invoicesList || invoicesList.length === 0) {
        return ResponseHelper.sendErrorResponse(c, 404, CLIENT_MESSAGES.CLIENT_NOT_FOUND);

      }

      const response = paginationHelper.getPaginationResponse({
        page,
        count: totalCount,
        limit,
        data: invoicesList,
        message: CLIENT_MESSAGES.CLIENT_LIST_FETCH_SUCCESS
      });

      return c.json(response);

    } catch (error) {
      return error;
    }
  }

  async getClient(c: Context) {
    try {
      const queryId = c.req.param('id');
      const id = Number(queryId);

      if (isNaN(id)) {

        return ResponseHelper.sendErrorResponse(c, 400, COMMON_VALIDATIONS.INVALID_CLIENT_ID);
      }

      const client: any = await clientsDataServiceProvider.getClient(id);

      if (!client) {
        return ResponseHelper.sendErrorResponse(c, 200, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_FETCH_SUCCESS, client);

    } catch (error) {
      throw error;
    }
  }

  async addClient(c: Context) {
    const result = await clientsDataServiceProvider.addClient();
    return c.json(result);
  }


  async deleteClient(c: Context) {
    try {
      const queryId = c.req.param('id');
      const id = Number(queryId);

      if (isNaN(id)) {
        return ResponseHelper.sendErrorResponse(c, 400, COMMON_VALIDATIONS.INVALID_CLIENT_ID);
      }

      const client = await clientsDataServiceProvider.getClient(id);

      if (!client) {
        return ResponseHelper.sendErrorResponse(c, 404, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      await clientsDataServiceProvider.deleteClient(id);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_DELETED_SUCCESS);

    } catch (error) {
      throw error;
    }
  }


  async exportClients(c: Context) {
    const result = await clientsDataServiceProvider.exportClients();
    return c.json(result);
  }

  async updateClient(c: Context) {
    try {
      const id = parseInt(c.req.param('id'), 10);

      const body = await c.req.json();

      const client: any = await clientsDataServiceProvider.getClient(id);

      if (!client) {
        return ResponseHelper.sendErrorResponse(c, 404, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
      }

      await clientsDataServiceProvider.editClient(id, body);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_UPDATE_SUCCESS);

    } catch (error) {
      throw error;
    }
  }


  async getClientsWiseServices(c: Context) {
    try {

      const clientId = +c.req.param('id');

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

      const clientsWiseServicesData = await clientsDataServiceProvider.getClientsWiseInvoices(clientId);

      return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_BASED_INVOICES_FETCH_SUCCESS, clientsWiseServicesData);

    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }
}
