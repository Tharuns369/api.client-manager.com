import { Context } from 'hono';
import { ServicesService } from '../services/servicesService';

export class ServicesController {
  private servicesService: ServicesService;

  constructor() {
    this.servicesService = new ServicesService();
  }

  async getTotalServices(c: Context) {
    const result = await this.servicesService.getTotalServices();
    return c.json(result);
  }

  async listServices(c: Context) {
    const result = await this.servicesService.listServices();
    return c.json(result);
  }

  async addService(c: Context) {
    const result = await this.servicesService.addService();
    return c.json(result);
  }

  async updateService(c: Context) {
    const { id } = c.req.param();
    const result = await this.servicesService.updateService(id);
    return c.json(result);
  }

  async deleteService(c: Context) {
    const { id } = c.req.param();
    const result = await this.servicesService.deleteService(id);
    return c.json(result);
  }
}
