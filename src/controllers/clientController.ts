import { Context } from 'hono';
import { ClientsService } from '../services/clientsService';

export class ClientsController {
  private clientsService: ClientsService;

  constructor() {
    this.clientsService = new ClientsService();
  }

  async getTotalClients(c: Context) {
    const result = await this.clientsService.getTotalClients();
    return c.json(result);
  }

  async listClients(c: Context) {
    const result = await this.clientsService.listClients();
    return c.json(result);
  }

  async getClient(c: Context) {
    const { id } = c.req.param();
    const result = await this.clientsService.getClient(id);
    return c.json(result);
  }

  async addClient(c: Context) {
    const result = await this.clientsService.addClient();
    return c.json(result);
  }

  async updateClient(c: Context) {
    const { id } = c.req.param();
    const result = await this.clientsService.updateClient(id);
    return c.json(result);
  }

  async deleteClient(c: Context) {
    const { id } = c.req.param();
    const result = await this.clientsService.deleteClient(id);
    return c.json(result);
  }

  async exportClients(c: Context) {
    const result = await this.clientsService.exportClients();
    return c.json(result);
  }
}
