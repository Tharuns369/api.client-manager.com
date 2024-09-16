import { ClientsService } from '../services/clientsService';
export class ClientsController {
    clientsService;
    constructor() {
        this.clientsService = new ClientsService();
    }
    async getTotalClients(c) {
        const result = await this.clientsService.getTotalClients();
        return c.json(result);
    }
    async listClients(c) {
        const result = await this.clientsService.listClients();
        return c.json(result);
    }
    async getClient(c) {
        const { id } = c.req.param();
        const result = await this.clientsService.getClient(id);
        return c.json(result);
    }
    async addClient(c) {
        const result = await this.clientsService.addClient();
        return c.json(result);
    }
    async updateClient(c) {
        const { id } = c.req.param();
        const result = await this.clientsService.updateClient(id);
        return c.json(result);
    }
    async deleteClient(c) {
        const { id } = c.req.param();
        const result = await this.clientsService.deleteClient(id);
        return c.json(result);
    }
    async exportClients(c) {
        const result = await this.clientsService.exportClients();
        return c.json(result);
    }
}
