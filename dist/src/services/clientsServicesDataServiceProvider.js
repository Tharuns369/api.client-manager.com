import { getAllRecords, getRecordByColumnValue, insertRecord, deleteRecordById } from "../db/abstractions";
import { clientServices } from "../schemas/clientServices";
export class ClientsServicesDataServiceProvider {
    async addClientService(clientServicesData) {
        const insertedClientService = await insertRecord(clientServices, clientServicesData);
        return insertedClientService;
    }
    async getClientServiceById(id) {
        const clientData = await getRecordByColumnValue(clientServices, 'id', id);
        return clientData;
    }
    async getAllClientServices() {
        const allClientServices = await getAllRecords(clientServices);
        return allClientServices;
    }
    async deleteClientService(id) {
        const deletedClientService = await deleteRecordById(clientServices, id);
        return deletedClientService;
    }
}
