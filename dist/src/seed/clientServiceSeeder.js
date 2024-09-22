import { faker } from '@faker-js/faker';
import { db } from '../db';
import { clients } from '../schemas/clients';
import { clientServices } from '../schemas/clientServices';
async function seedClientServices() {
    const existingClients = await db.select().from(clients);
    if (existingClients.length === 0) {
        return;
    }
    const clientServicesData = [];
    existingClients.forEach(client => {
        for (let i = 0; i < 5; i++) {
            clientServicesData.push({
                title: faker.company.catchPhrase(),
                client_id: client.id,
                service_id: Math.floor(Math.random() * 100) + 1,
                status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
                invoice_amount: parseFloat((Math.random() * (5000 - 100) + 100).toFixed(2)).toString(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
    });
    try {
        await db.insert(clientServices).values(clientServicesData);
        console.log(`Seeded client services for ${existingClients.length * 5} records.`);
    }
    catch (error) {
        console.error('Error seeding client services:', error);
    }
}
seedClientServices();
