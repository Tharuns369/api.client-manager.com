import { faker } from '@faker-js/faker';
import { db } from '../db/index';
import { invoices } from '../schemas/invoices';
import { clientServices } from '../schemas/clientServices';
import { eq } from 'drizzle-orm';

const generateFakeInvoice = (serviceId: number, monthOffset: number) => {
    const currentDate = new Date();
    const invoiceDate = new Date(currentDate.setMonth(currentDate.getMonth() - monthOffset));

    return {
        serviceId: serviceId,
        invoiceStatus: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
        remarks: faker.lorem.sentence(),
        invoiceDate: invoiceDate.toISOString(),
        paymentDate: faker.helpers.maybe(() => faker.date.past().toISOString(), { probability: 0.5 }),
        invoiceAmount: faker.number.int({ min: 1000, max: 50000 }).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

const generateInvoicesForService = (serviceId: number, numInvoices: number = 10) => {
    const fakeInvoices: any[] = [];

    for (let i = 0; i < numInvoices; i++) {
        fakeInvoices.push(generateFakeInvoice(serviceId, i));
    }

    return fakeInvoices;
};

const insertInvoicesBatch = async (invoicesBatch: any) => {
    try {
        await db.insert(invoices).values(invoicesBatch);
        console.log(`Inserted ${invoicesBatch.length} invoices.`);
    } catch (error) {
        console.error('Error inserting invoices batch:', error);
    }
};

const insertInvoicesForClient = async (clientId: number, numInvoices: number = 10) => {
    try {
        const serviceRows = await db.select({
            id: clientServices.id
        }).from(clientServices).where(eq(clientServices.client_id, clientId));

        for (const service of serviceRows) {
            const allInvoices = generateInvoicesForService(service.id, numInvoices);

            const batchSize = 1000;
            for (let i = 0; i < allInvoices.length; i += batchSize) {
                const invoicesBatch = allInvoices.slice(i, i + batchSize);
                await insertInvoicesBatch(invoicesBatch);
            }

            console.log(`Processed service with ID ${service.id}`);
        }
    } catch (error) {
        console.error(`Error fetching services for client ID ${clientId}:`, error);
    }
};

const insertInvoicesForClients = async (clientIds: number[], numInvoices: number = 10) => {
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