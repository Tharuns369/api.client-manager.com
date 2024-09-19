export class InvoicesDataServiceProvider {
  async getTotalInvoicesAmount() {
    return { totalAmount: 5000 };
  }

  async getClientsTotalInvoicesAmount() {
    return { clients: [{ id: 1, totalAmount: 3000 }, { id: 2, totalAmount: 2000 }] };
  }

  async getServicesTotalInvoicesAmount() {
    return { services: [{ id: 1, totalAmount: 1500 }, { id: 2, totalAmount: 3500 }] };
  }

  async listInvoices() {
    return { invoices: [{ id: 1, amount: 1000 }, { id: 2, amount: 2000 }] };
  }

  async viewInvoice(id: string) {
    return { invoice: { id, amount: 1000 } };
  }

  async uploadInvoice() {
    return { message: 'Invoice uploaded successfully' };
  }

  async addInvoice() {
    return { message: 'Invoice added successfully' };
  }

  async updateInvoice(id: string) {
    return { message: `Invoice ${id} updated successfully` };
  }
}
