import { Context } from 'hono';
import { ClientsDataServiceProvider } from '../services/clientsDataServiceProvider';
import { CLIENT_MESSAGES, COMMON_VALIDATIONS } from '../constants/messaegConstants';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { sortHelper } from '../helpers/sortHelper';
const clientsDataServiceProvider = new ClientsDataServiceProvider();

export class ClientsController {
  
  async getTotalClients(c: Context) {
    try {

    const totalClientCount = await clientsDataServiceProvider.getTotalClients();

    if(!totalClientCount){
      return c.json({
        status:false,
        message:CLIENT_MESSAGES.CLIENTS_NOT_EXIST,
        data:[]
    },200)        
    }

    return c.json({
        status:true,
        message:CLIENT_MESSAGES.CLIENTS_COUNT,
        data:totalClientCount
    },200)        
    }
    catch (error) {
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
            clientsDataServiceProvider.getClientsWithPagenation(limit, skip, sortString),
            clientsDataServiceProvider.getclientsCount()
        ]);

        if (!invoicesList || invoicesList.length === 0) {
            return c.json({
                status: 'False',
                message: CLIENT_MESSAGES.CLIENT_NOT_FOUND,
                data: []
            });
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
        console.error('Error at list of Clients:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
       }
    }   
  

  async getClient(c: Context) {
    try {
      const queryId = c.req.param('id');
        const id = Number(queryId);
        
        if (isNaN(id)) {
            return c.json({
                success: false,
                message: COMMON_VALIDATIONS.INVALID_CLIENT_ID,
                data: []
            },400);
        }

        const client:any = await clientsDataServiceProvider.getClient(id);
        
        if (!client ) {
          return c.json({
              success: false,
              message: CLIENT_MESSAGES. CLIENT_ID_NOT_FOUND(id),
              data: []
          },200);
      }

      return c.json({
        success: true,
        message: CLIENT_MESSAGES.CLIENT_FETCH_SUCCESS,
        data: client
    },200);
  
    } catch (error) {
      console.error('Error at get Client:', error);
      return c.json({
          success: false,
          message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
          data: []
      }, 500);
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
            return c.json({
                success: false,
                message: COMMON_VALIDATIONS.INVALID_CLIENT_ID,
                data: []
            },400);
        }

        const client : any = await clientsDataServiceProvider.getClient(id);

        if (!client) {
          return c.json({
              success: false,
              message: CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id),
              data: []
          },404);
      }

        await clientsDataServiceProvider.deleteClient(id);

        return c.json({
            success: true,
            message: CLIENT_MESSAGES.CLIENT_DELETED_SUCCESS,
            data: client 
        });
    } catch (error) {
        console.error('Error at delete Client:', error);
        return c.json({
            success: false,
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            data: []
        }, 500);
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

        const client:any = await clientsDataServiceProvider.getClient(id);

        if (!client) {
            return c.json({
                success: false,
                message: CLIENT_MESSAGES.CLIENT_ID_NOT_FOUND(id),
                data: []
            });
        }

        const updatedClient = await clientsDataServiceProvider.editClient(id, body);

        return c.json({
            success: true,
            message: CLIENT_MESSAGES.CLIENT_UPDATE_SUCCESS,
            data: updatedClient
        });

    } catch (error) {
        console.error('Error at edit Client:', error);
        return c.json({
            success: false,
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            data: []
        }, 500);
    }
   }
}
