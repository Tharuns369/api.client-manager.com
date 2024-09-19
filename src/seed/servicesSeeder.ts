import { faker } from '@faker-js/faker';
import { db } from '../db/index';
import { services, } from '../schemas/services';
import { clients } from '../schemas/clients';

export const generateFakeService = (clientId: number) => {
    return {
        title: faker.company.catchPhrase(),
        type: faker.helpers.arrayElement(['Consulting', 'Development', 'Support', 'Design', 'Marketing']),
        clientId: clientId,
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        invoiceAmount: faker.number.int({ min: 1000, max: 50000 }).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export const generateServicesForClient = (clientId: number, numServices: number = 4) => {
    const fakeServices: any[] = [];

    for (let i = 0; i < numServices; i++) {
        fakeServices.push(generateFakeService(clientId));
    }
    return fakeServices;
};

export const insertServicesForClients = async (numClients: number, servicesPerClient: number = 5) => {
    try {
        const clientRows = await db.select({
            id: clients.id,
            name: clients.name
        }).from(clients);

        for (const client of clientRows) {
            const servicesBatch = generateServicesForClient(client.id, servicesPerClient);
            try {
                await db.insert(services).values(servicesBatch);
                console.log(`Inserted ${servicesPerClient} services for client with ID ${client.id}`);
            } catch (error) {
                console.error(`Error inserting services for client ID ${client.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
};

const numClients = 1000;
const servicesPerClient = 10;
insertServicesForClients(numClients, servicesPerClient)
    .then(() => {
        console.log(`Successfully inserted services for ${numClients} clients.`);
    })
    .catch((error) => {
        console.error('Error inserting services:', error);
    });