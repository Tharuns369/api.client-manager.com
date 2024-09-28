import { faker } from '@faker-js/faker';
import { db } from '../db'; // Your database connection
import { services } from '../schemas/services'; // Import services schema
async function seedServices() {
    const serviceNames = [
        'WordPress',
        'Static',
        'Custom',
        'Web Application',
        'Mobile Application',
        'Social Media Marketing',
        'Maintenance Services',
        'Hosting Services'
    ];
    const serviceData = [];
    for (let i = 0; i < serviceNames.length; i++) {
        serviceData.push({
            service_name: serviceNames[i], // Ensure this matches the expected string type
            type: faker.helpers.arrayElement(["RECURRING", "ONE-TIME"]), // Match the enum type
            status: faker.helpers.arrayElement(["ACTIVE"]), // Match the enum type exactly
            invoice_amount: "0", // This is fine as a string
            created_at: new Date(), // Ensure these match the expected timestamp types
            updated_at: new Date(),
        });
    }
    try {
        // Insert the seed data into the 'services' table
        await db.insert(services).values(serviceData);
        console.log(`Successfully seeded ${serviceNames.length} services.`);
    }
    catch (error) {
        console.error('Error seeding services:', error);
    }
}
// Call the seed function
seedServices();
