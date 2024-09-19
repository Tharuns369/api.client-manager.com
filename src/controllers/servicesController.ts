import { Context } from 'hono';
import { ClientsServicesDataServiceProvider } from '../services/clientsServicesDataServiceProvider';
import { COMMON_VALIDATIONS, INVOICES_MESSAGES, SERVICES_MESSAGES } from '../constants/messaegConstants';
import { sortHelper } from '../helpers/sortHelper';
import { paginationHelper } from '../helpers/paginationResponseHelper';
import { ResponseHelper } from '../helpers/responseHelper';
import { NotFoundException } from '../exceptions/notFoundException';
import bcrypt from 'bcryptjs';


const clientsServicesDataServiceProvider = new ClientsServicesDataServiceProvider();

export class ServicesController {

  async getTotalServices(c: Context) {
    try {
      
    const totalClientCount = await clientsServicesDataServiceProvider.getTotalServicesCount();
    if(!totalClientCount){
      return c.json({
        status:false,
        message:SERVICES_MESSAGES.SERVICES_NOT_EXIST,
        data:[]
    },200)        
    }

    return c.json({
        status:true,
        message:SERVICES_MESSAGES.SERVICE_COUNT,
        data:totalClientCount
    },200)        
    }
    catch (error) {
        console.error('Error at Services count:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
      }
  }


  async listServices(c: Context) {
    try {
        
        const query = c.req.query();
        const page: number = parseInt(query.page || '1');
        const limit: number = parseInt(query.limit || '10');
        const sortString: string = sortHelper.resultsSort(query);

        const skip: number = (page - 1) * limit;

        const [invoicesList, totalCount]: any = await Promise.all([
            clientsServicesDataServiceProvider.getServices(limit, skip, sortString),
            clientsServicesDataServiceProvider.getSrvicesCount()
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

    } catch (error) {
        console.error('Error at list of Services:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
       }
    }


  async addService(c: Context) {
    const result = await clientsServicesDataServiceProvider.addService();
    return c.json(result);
  }

  async updateService(c: Context) {
    try {
        const id = parseInt(c.req.param('id'), 10); 
        
        const body = await c.req.json();

        const invoice:any = await clientsServicesDataServiceProvider.getService(id);

        if (!invoice) {
            throw new NotFoundException(INVOICES_MESSAGES.INVOICE_NOT_FOUND);
          }

          const hashedPassword = await bcrypt.hash(body.password, 10);
          body.password = hashedPassword;
    

        const updatedInvoice = await clientsServicesDataServiceProvider.editService(id, body);

        return ResponseHelper.sendSuccessResponse(c, 200,INVOICES_MESSAGES.INVOICE_UPDATE_SUCCESS,updatedInvoice);

    } catch (error) {
        console.error('Error at edit Client:', error);
        return c.json({
            success: false,
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            data: []
        }, 500);
    }
   }

  async deleteService(c: Context) {
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

        const service = await clientsServicesDataServiceProvider.getService(id);

        if (!service ) {
          return c.json({
              success: false,
              message: SERVICES_MESSAGES.SERVICE_ID_NOT_FOUND(id),
              data: []
          });
      }

        await clientsServicesDataServiceProvider.deleteService(id);

        return c.json({
            success: true,
            message: SERVICES_MESSAGES.SERVICE_DELETED_SUCCESS,
            data: service 
        });
    } catch (error) {
        console.error('Error at delete Service:', error);
        return c.json({
            success: false,
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
            data: []
        }, 500);
    }
}

}
