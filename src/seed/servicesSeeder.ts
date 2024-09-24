import { db } from '../db'; 
import { services } from '../schemas/services'; 

const serviceTypes = [
    'WordPress', 
    'Static', 
    'Custom', 
    'Web Application', 
    'Mobile Application', 
    'Social Media Marketing', 
    'Maintenance Services', 
    'Hosting'
];

const seedServices = async () => {
    const sampleServices = Array.from({ length: 8 }, () => ({
        type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)], 
        status: 'ACTIVE', 
        invoice_amount: (Math.random() * 1000).toFixed(2),
        created_at: new Date(),
        updated_at: new Date(),
    }));

    try {
        await db.insert(services).values(sampleServices);
        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding services:', error);
    }
};

seedServices();
