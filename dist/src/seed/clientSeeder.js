import { faker } from '@faker-js/faker';
import { db } from '../db/index';
import { clients } from '../schemas/clients';
const generatePhoneNumber = (country) => {
    if (country === 'IN') {
        return `+91 ${faker.number.int({ min: 1000000000, max: 9999999999 })}`;
    }
    else {
        const areaCode = faker.number.int({ min: 100, max: 999 });
        const firstPart = faker.number.int({ min: 100, max: 999 });
        const secondPart = faker.number.int({ min: 1000, max: 9999 });
        return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
    }
};
export const generateFakeClients = (numClients) => {
    const fakeClients = [];
    for (let i = 0; i < numClients; i++) {
        const country = faker.helpers.arrayElement(['IN', 'US']);
        fakeClients.push({
            name: faker.company.name(),
            poc: faker.person.fullName(),
            role: faker.person.jobTitle(),
            email: faker.internet.email(),
            phone: generatePhoneNumber(country),
            secondaryPhone: generatePhoneNumber(country),
            status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
            remarks: faker.lorem.sentence(),
            bussinessUrl: faker.internet.url(),
            address: faker.location.streetAddress(),
            state: faker.location.state(),
            city: faker.location.city(),
            gst: faker.datatype.boolean(),
            country: country === 'IN' ? 'India' : 'USA',
            totalInvoiceAmount: faker.number.int({ min: 1000, max: 50000 }).toFixed(2),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return fakeClients;
};
export const insertClientsInBatches = async (numClients, batchSize = 1000) => {
    const totalBatches = Math.ceil(numClients / batchSize);
    for (let batch = 0; batch < totalBatches; batch++) {
        const clientsBatch = generateFakeClients(batchSize);
        try {
            await db.insert(clients).values(clientsBatch);
            console.log(`Batch ${batch + 1} of ${totalBatches} inserted successfully.`);
        }
        catch (error) {
            console.error(`Error inserting batch ${batch + 1}:`, error);
        }
    }
};
const numClients = 1000;
insertClientsInBatches(numClients)
    .then(() => {
    console.log(`Successfully inserted ${numClients} clients.`);
})
    .catch((error) => {
    console.error('Error inserting clients:', error);
});
