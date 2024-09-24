// import { faker } from '@faker-js/faker';
// import { clients } from '../schemas/clients'; 
// import { db } from '../db'; 
// async function seedClients() {
//   const clientData: {
//     name: string;
//     poc: string;
//     role: string;
//     email: string;
//     phone: string;
//     secondary_phone: string;
//     status: "ACTIVE" | "INACTIVE";
//     remarks: string;
//     bussiness_url: string;
//     address: string;
//     state: string;
//     city: string;
//     gst: boolean;
//     country: string;
//     total_invoice_amount: string; 
//     created_at: Date;
//     updated_at: Date;
//   }[] = [];

//   for (let i = 0; i < 1000; i++) {
//     clientData.push({
//       name: faker.company.name(),
//       poc: faker.person.fullName(),
//       role: faker.person.jobTitle(),
//       email: faker.internet.email(),
//       phone: faker.phone.number(),
//       secondary_phone: faker.phone.number(),
//       status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
//       remarks: faker.lorem.sentence(),
//       bussiness_url: faker.internet.url(),
//       address: faker.location.streetAddress(),
//       state: faker.location.state(),
//       city: faker.location.city(),
//       gst: faker.datatype.boolean(),
//       country: faker.address.country(),
//       total_invoice_amount: parseFloat((Math.random() * (50000 - 1000) + 1000).toFixed(2)).toString(), 
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   try {
//     await db.insert(clients).values(clientData);
//     console.log('Successfully seeded 1000 clients.');
//   } catch (error) {
//     console.error('Error seeding clients:', error);
//   }
// }

// seedClients();
