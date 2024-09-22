// import { faker } from '@faker-js/faker';
// import { db } from '../db';
// import { clientServices } from '../schemas/clientServices';
// import { invoices, NewInvoice } from '../schemas/invoices';

// function getPastMonthDate(monthsAgo: number): string {
//   const date = new Date();
//   date.setMonth(date.getMonth() - monthsAgo);
//   return date.toISOString().split('T')[0];
// }

// function chunkArray<T>(array: T[], chunkSize: number): T[][] {
//   const result: T[][] = [];
//   for (let i = 0; i < array.length; i += chunkSize) {
//     result.push(array.slice(i, i + chunkSize));
//   }
//   return result;
// }

// async function seedInvoices() {
//   const existingClientServices = await db.select().from(clientServices);

//   if (existingClientServices.length === 0) {
//     console.log('No client services found. Seeder aborted.');
//     return;
//   }

//   const invoicesData: NewInvoice[] = [];

//   existingClientServices.forEach(clientService => {
//     for (let monthsAgo = 1; monthsAgo <= 5; monthsAgo++) {
//       invoicesData.push({
//         client_service_id: clientService.id,
//         client_id: clientService.client_id,
//         invoice_status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
//         remarks: faker.lorem.sentence(),
//         invoice_date: getPastMonthDate(monthsAgo),
//         payment_date: getPastMonthDate(monthsAgo),
//         invoice_amount: parseFloat((Math.random() * (5000 - 100) + 100).toFixed(2)).toString(),
//         created_at: new Date(),
//         updated_at: new Date(),
//       });
//     }
//   });

//   const batchSize = 1000;
//   const batchedInvoices = chunkArray(invoicesData, batchSize);

//   for (let i = 0; i < batchedInvoices.length; i++) {
//     try {
//       await db.insert(invoices).values(batchedInvoices[i]);
//       console.log(`Batch ${i + 1}: Seeded ${batchedInvoices[i].length} invoices.`);
//     } catch (error) {
//       console.error(`Error seeding batch ${i + 1}:`, error);
//     }
//   }

//   console.log(`Successfully seeded ${invoicesData.length} invoices.`);
// }

// seedInvoices();
