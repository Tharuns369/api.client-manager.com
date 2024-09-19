export class clientsServicesDataServiceProvider {
    async getTotalServices() {
        return { status: "Suuccess", totalServices: 5 };
    }
    async listServices() {
        return { status: "Suuccess", services: [{ id: 1, title: 'Service A' }, { id: 2, title: 'Service B' }] };
    }
    async addService() {
        return { status: "Suuccess", message: 'Service added successfully' };
    }
    async updateService(id) {
        return { status: "Suuccess", message: `Service ${id} updated successfully` };
    }
    async deleteService(id) {
        return { status: "Suuccess", message: `Service ${id} deleted successfully` };
    }
}
