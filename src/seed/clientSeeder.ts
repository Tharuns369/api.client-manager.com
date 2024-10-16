import { faker, NumberModule } from '@faker-js/faker';
import { clients, NewClient } from '../schemas/clients'; 
import { db } from '../db'; 

async function seedClients() {
  const clientData: NewClient[] = [];

  for (let i = 0; i < 500; i++) {
    clientData.push({
      client_name: faker.company.name(),
      client_phone: faker.phone.number(),
      client_email: faker.internet.email(),
      company_name: faker.company.name(),
      poc: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      secondary_phone: faker.phone.number(),
      status: faker.helpers.arrayElement(['ACTIVE']),
      remarks: faker.lorem.sentence(),
      bussiness_url: faker.internet.url(),
      address: faker.location.streetAddress(),
      state: faker.location.state(),
      city: faker.location.city(),
      gst: faker.datatype.boolean(),
      country: faker.location.country(),
      total_invoice_amount: "0",
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  try {
    await db.insert(clients).values(clientData);
    console.log('Successfully seeded 1000 clients.');
  } catch (error) {
    console.error('Error seeding clients:', error);
  }
}

seedClients();
