import { db } from '../db';
import { services } from '../schemas/services';
const serviceNames = [
    'WordPress',
    'Static',
    'Custom',
    'Web Application',
    'Mobile Application',
    'Social Media Marketing',
    'Maintenance Services',
    'Hosting'
];
const serviceTypes = ['RECURRING', 'ONE-TIME'];
const seedServices = async () => {
    const sampleServices = serviceNames.map((name) => ({
        service_name: name,
        type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        status: 'ACTIVE',
        invoice_amount: (Math.random() * 1000).toFixed(2),
        created_at: new Date(),
        updated_at: new Date(),
    }));
    try {
        await db.insert(services).values(sampleServices);
        console.log('Seeding completed successfully.');
    }
    catch (error) {
        console.error('Error seeding services:', error);
    }
};
seedServices();
