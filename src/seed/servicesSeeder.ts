import { db } from '../db'; 
import { services, statusEnum } from '../schemas/services'; 

const seedServices = async () => {
    const sampleServices = Array.from({ length: 20 }, (_, index) => ({
        type: `Service Type ${index + 1}`, 
        status: index % 2 === 0 ? 'ACTIVE' : 'INACTIVE' as 'ACTIVE' | 'INACTIVE', 
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
