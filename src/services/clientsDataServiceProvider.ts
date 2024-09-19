export class ClientsDataServiceProvider {
    async getTotalClients() {
      return { totalClients: 10 };
    }
  
    async listClients() {
      return { clients: [{ id: 1, name: 'Client A' }, { id: 2, name: 'Client B' }] };
    }
  
    async getClient(id: string) {
      return { client: { id, name: 'Client A' } };
    }
  
    async addClient() {
      return { message: 'Client added successfully' };
    }
  
    async updateClient(id: string) {
      return { message: `Client ${id} updated successfully` };
    }
  
    async deleteClient(id: string) {
      return { message: `Client ${id} deleted successfully` };
    }
  
    async exportClients() {
      return { message: 'Clients exported successfully' };
    }
  }
  