import { ServicesService } from '../services/servicesService';
export class ServicesController {
    servicesService;
    constructor() {
        this.servicesService = new ServicesService();
    }
    async getTotalServices(c) {
        const result = await this.servicesService.getTotalServices();
        return c.json(result);
    }
    async listServices(c) {
        const result = await this.servicesService.listServices();
        return c.json(result);
    }
    async addService(c) {
        const result = await this.servicesService.addService();
        return c.json(result);
    }
    async updateService(c) {
        const { id } = c.req.param();
        const result = await this.servicesService.updateService(id);
        return c.json(result);
    }
    async deleteService(c) {
        const { id } = c.req.param();
        const result = await this.servicesService.deleteService(id);
        return c.json(result);
    }
}
