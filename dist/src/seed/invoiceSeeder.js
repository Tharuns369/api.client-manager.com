import { faker } from '@faker-js/faker';
import { db } from '../db/index';
import { invoices } from '../schemas/invoices';
import { services } from '../schemas/services';
import { eq } from 'drizzle-orm';
const generateFakeInvoice = (serviceId, clientId, monthOffset) => {
    const currentDate = new Date();
    const invoiceDate = new Date(currentDate.setMonth(currentDate.getMonth() - monthOffset));
    return {
        service_id: serviceId,
        client_id: clientId,
        invoice_status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
        remarks: faker.lorem.sentence(),
        invoice_date: invoiceDate.toISOString(),
        payment_date: faker.helpers.maybe(() => faker.date.past().toISOString(), { probability: 0.5 }),
        invoice_amount: faker.number.int({ min: 1000, max: 50000 }).toFixed(2),
        created_at: new Date(),
        updated_at: new Date(),
    };
};
const generateInvoicesForService = (serviceId, clientId, numInvoices = 10) => {
    const fakeInvoices = [];
    for (let i = 0; i < numInvoices; i++) {
        fakeInvoices.push(generateFakeInvoice(serviceId, clientId, i));
    }
    return fakeInvoices;
};
const insertInvoicesBatch = async (invoicesBatch) => {
    try {
        await db.insert(invoices).values(invoicesBatch);
        console.log(`Inserted ${invoicesBatch.length} invoices.`);
    }
    catch (error) {
        console.error('Error inserting invoices batch:', error);
    }
};
const insertInvoicesForClient = async (clientId, numInvoices = 10) => {
    try {
        const serviceRows = await db.select({
            id: services.id,
            client_id: services.client_id
        }).from(services).where(eq(services.client_id, clientId));
        for (const service of serviceRows) {
            const allInvoices = generateInvoicesForService(service.id, service.client_id, numInvoices);
            const batchSize = 1000;
            for (let i = 0; i < allInvoices.length; i += batchSize) {
                const invoicesBatch = allInvoices.slice(i, i + batchSize);
                await insertInvoicesBatch(invoicesBatch);
            }
            console.log(`Processed service with ID ${service.id} for client ID ${clientId}`);
        }
    }
    catch (error) {
        console.error(`Error fetching services for client ID ${clientId}:`, error);
    }
};
const insertInvoicesForClients = async (clientIds, numInvoices = 10) => {
    for (const clientId of clientIds) {
        await insertInvoicesForClient(clientId, numInvoices);
    }
};
const clientIds = Array.from({ length: 1001 }, (_, i) => i + 1);
const numInvoices = 10;
insertInvoicesForClients(clientIds, numInvoices)
    .then(() => {
    console.log(`Successfully inserted invoices for ${clientIds.length} clients.`);
})
    .catch((error) => {
    console.error('Error inserting invoices:', error);
});
