import { faker } from '@faker-js/faker';
import { db } from '../db';
import { clientServices } from '../schemas/clientServices';
import { invoices } from '../schemas/invoices';
function getPastMonthDate(monthsAgo) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toISOString().split('T')[0];
}
function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
async function seedInvoices() {
    const existingClientServices = await db.select().from(clientServices);
    if (existingClientServices.length === 0) {
        console.log('No client services found. Seeder aborted.');
        return;
    }
<<<<<<< HEAD
    catch (error) {
        console.error('Error inserting invoices batch:', error);
    }
};
const insertInvoicesForClient = async (clientId, numInvoices = 10) => {
    try {
        const serviceRows = await db.select({
            id: clientServices.id
        }).from(clientServices).where(eq(clientServices.client_id, clientId));
        for (const service of serviceRows) {
            const allInvoices = generateInvoicesForService(service.id, service.client_id, numInvoices);
            const batchSize = 1000;
            for (let i = 0; i < allInvoices.length; i += batchSize) {
                const invoicesBatch = allInvoices.slice(i, i + batchSize);
                await insertInvoicesBatch(invoicesBatch);
            }
            console.log(`Processed service with ID ${service.id} for client ID ${clientId}`);
=======
    const invoicesData = [];
    existingClientServices.forEach(clientService => {
        for (let monthsAgo = 1; monthsAgo <= 5; monthsAgo++) {
            invoicesData.push({
                client_service_id: clientService.id,
                client_id: clientService.client_id,
                invoice_status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
                remarks: faker.lorem.sentence(),
                invoice_date: getPastMonthDate(monthsAgo),
                payment_date: getPastMonthDate(monthsAgo),
                invoice_amount: parseFloat((Math.random() * (5000 - 100) + 100).toFixed(2)).toString(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
    });
    const batchSize = 1000;
    const batchedInvoices = chunkArray(invoicesData, batchSize);
    for (let i = 0; i < batchedInvoices.length; i++) {
        try {
            await db.insert(invoices).values(batchedInvoices[i]);
            console.log(`Batch ${i + 1}: Seeded ${batchedInvoices[i].length} invoices.`);
        }
        catch (error) {
            console.error(`Error seeding batch ${i + 1}:`, error);
>>>>>>> features/seed
        }
    }
    console.log(`Successfully seeded ${invoicesData.length} invoices.`);
}
seedInvoices();
