import { ClientsDataServiceProvider } from '../services/clientsDataServiceProvider';
import { CLIENT_MESSAGES, COMMON_VALIDATIONS } from '../constants/messaegConstants';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { sortHelper } from '../helpers/sortHelper';
import { ResponseHelper } from '../helpers/responseHelper';
const clientsDataServiceProvider = new ClientsDataServiceProvider();
export class ClientsController {
    async getTotalClients(c) {
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
    async listClients(c) {
        try {
            const query = c.req.query();
            const page = parseInt(query.page || '1');
            const limit = parseInt(query.limit || '10');
            const sortString = sortHelper.resultsSort(query);
            const skip = (page - 1) * limit;
            const [invoicesList, totalCount] = await Promise.all([
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
        }
        catch (error) {
            return error;
        }
    }
    async getClient(c) {
        try {
            const queryId = c.req.param('id');
            const id = Number(queryId);
            if (isNaN(id)) {
                return ResponseHelper.sendErrorResponse(c, 400, COMMON_VALIDATIONS.INVALID_CLIENT_ID);
            }
            const client = await clientsDataServiceProvider.getClient(id);
            if (!client) {
                return ResponseHelper.sendErrorResponse(c, 200, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
            }
            return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_FETCH_SUCCESS);
        }
        catch (error) {
            throw error;
        }
    }
    async addClient(c) {
        const result = await clientsDataServiceProvider.addClient();
        return c.json(result);
    }
    async deleteClient(c) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async exportClients(c) {
        const result = await clientsDataServiceProvider.exportClients();
        return c.json(result);
    }
    async updateClient(c) {
        try {
            const id = parseInt(c.req.param('id'), 10);
            const body = await c.req.json();
            const client = await clientsDataServiceProvider.getClient(id);
            if (!client) {
                return ResponseHelper.sendErrorResponse(c, 404, CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id));
            }
            const updatedClient = await clientsDataServiceProvider.editClient(id, body);
            return ResponseHelper.sendSuccessResponse(c, 200, CLIENT_MESSAGES.CLIENT_UPDATE_SUCCESS, updatedClient);
        }
        catch (error) {
            throw error;
        }
    }
}
