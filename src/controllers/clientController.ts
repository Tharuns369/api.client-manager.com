import { Context } from 'hono';
import { ClientsService } from '../services/clientsService';
import { CLIENT_VALIDATIONS, COMMON_VALIDATIONS } from '../constants/messaegConstants';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { sortHelper } from '../helpers/sortHelper';

const clientsService = new ClientsService();

export class ClientsController {
  
  async getTotalClients(c: Context) {
    try {

    const totalClientCount = await clientsService.getTotalClients();

    return c.json({
       
        status:"True",
        message:CLIENT_VALIDATIONS.CLIENTS_COUNT,
        data:totalClientCount
    })        
    }catch (error) {
        console.error('Error at clients count:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
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
            clientsService.getClientsWithPagenation(limit, skip, sortString),
            clientsService.getclientsCount()
        ]);

        if (!invoicesList || invoicesList.length === 0) {
            return c.json({
                status: 'False',
                message: CLIENT_VALIDATIONS.CLIENT_NOT_FOUND,
                data: []
            });
        }

        const response = paginationHelper.getPaginationResponse({
            page,
            count: totalCount, 
            limit,
            data: invoicesList,
            message: CLIENT_VALIDATIONS.CLIENT_LIST_FETCH_SUCCESS
        });

        return c.json(response);

    } catch (error) {
        console.error('Error at list of Clients:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
       }
    }   
  

//   async getClient(c: Context) {
//     const { id } = c.req.param();
//     const result = await clientsService.getClient(id);
//     return c.json(result);
//   }

  async addClient(c: Context) {
    const result = await clientsService.addClient();
    return c.json(result);
  }

  async updateClient(c: Context) {
    const { id } = c.req.param();
    const result = await clientsService.updateClient(id);
    return c.json(result);
  }

  async deleteClient(c: Context) {
    try {
        const queryId = c.req.query('id') || ''; 
        const id = parseInt(queryId);
        
        if (isNaN(id)) {
            return c.json({
                success: false,
                message: "Invalid client ID provided",
                data: []
            });
        }
        

        const client = await clientsService.getClient(id);

        if (!client) {
            return c.json({
                success: false,
                message: "Client not found with the given ID",
                data: []
            });
        }

        await clientsService.deleteClient(id);

        return c.json({
            success: true,
            message: "Client deleted successfully.",
            data: client
        });
    } catch (error) {
        console.error('Error at delete Client:', error);
        return c.json({
            status: 'Error',
            message: 'Something went wrong while deleting the client',
        }, 500);
    }
   }

  async exportClients(c: Context) {
    const result = await clientsService.exportClients();
    return c.json(result);
  }
}
