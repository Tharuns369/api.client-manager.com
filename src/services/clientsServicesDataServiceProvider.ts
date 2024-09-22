import { getAllRecords, getRecordByColumnValue, updateRecordById,insertRecord, deleteRecordById } from "../db/abstractions";
import { ClientService, clientServices } from "../schemas/clientServices";

export class ClientsServicesDataServiceProvider {
 

    async addClientService(clientServicesData:ClientService) {
        const insertedClientService = await insertRecord<ClientService>(clientServices, clientServicesData);
        return insertedClientService;
  }


  async getClientServiceById(id: number) {    
    const clientData = await getRecordByColumnValue<ClientService>(clientServices, 'id', id);    
    return clientData;
  }

  async getAllClientServices() {
    const allClientServices = await getAllRecords(clientServices);
    return allClientServices;
  }

  async deleteClientService(id: number) {
    const deletedClientService = await deleteRecordById(clientServices, id);
    return deletedClientService;
}



}