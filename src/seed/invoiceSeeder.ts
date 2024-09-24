import { db } from '../db';
import { invoices } from '../schemas/invoices';
import { clients } from '../schemas/clients';
import { services } from '../schemas/services';
import { faker } from '@faker-js/faker';

const BATCH_SIZE = 1000;

async function getClientAndServiceData() {
    const clientIds = await db.select({ id: clients.id }).from(clients);
    const serviceIds = await db.select({ id: services.id }).from(services);
    return { clientIds, serviceIds };
}

const getRandomInvoiceDate = (): Date => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-08-31');
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const seedInvoices = async () => {
    try {
        const { clientIds, serviceIds } = await getClientAndServiceData();
        let invoiceData: {
            name: string;
            service_id: number;
            client_id: number;
            invoice_status: 'PENDING' | 'COMPLETED';
            remarks: string;
            invoice_date: string;
            payment_date: string | null;
            invoice_amount: string;
        }[] = [];

        clientIds.forEach(async (client) => {
            for (let i = 0; i < 8; i++) {
                const randomService = faker.helpers.arrayElement(serviceIds);
                invoiceData.push({
                    name: `Invoice ${faker.number.int({ min: 1000, max: 9999 })}`,
                    service_id: randomService.id,
                    client_id: client.id,
                    invoice_status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
                    remarks: faker.lorem.sentence(),
                    invoice_date: formatDateString(getRandomInvoiceDate()),
                    payment_date: Math.random() > 0.5 ? formatDateString(getRandomInvoiceDate()) : null,
                    invoice_amount: (Math.random() * (5000 - 100) + 100).toFixed(2)
                });

                if (invoiceData.length === BATCH_SIZE) {
                    console.log(`Inserting batch of ${invoiceData.length} invoices...`);
                    await db.insert(invoices).values(invoiceData);
                    invoiceData = [];  
                }
            }
        });

        if (invoiceData.length > 0) {
            console.log(`Inserting final batch of ${invoiceData.length} invoices...`);
            await db.insert(invoices).values(invoiceData);
        }

        console.log('Successfully seeded invoices.');
    } catch (error) {
        console.error('Error seeding invoices:', error);
    }
};

seedInvoices();
