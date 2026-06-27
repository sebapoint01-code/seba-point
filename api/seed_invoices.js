import mongoose from 'mongoose';
import Invoice from './models/Invoice.js';

const MONGODB_URI = 'mongodb+srv://23303156_db_user:IKA12UtLBton4q00@ork.lguixt1.mongodb.net/?appName=ork';

async function generateFakeInvoices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // We want data from Oct 2025 to June 2026
    const startDate = new Date(2025, 9, 1); // Oct 1, 2025
    const endDate = new Date(2026, 5, 30); // June 30, 2026
    
    const statuses = ['Paid', 'Paid', 'Paid', 'Paid', 'Unpaid', 'Overdue'];
    
    const clients = [
        { name: 'Tech Solutions Inc', email: 'billing@techsol.com', address: '123 Tech Ln' },
        { name: 'Global Logistics', email: 'accounts@globallog.com', address: '456 Freight Blvd' },
        { name: 'Alpha Retail', email: 'finance@alpharetail.com', address: '789 Market St' },
        { name: 'Omega Services', email: 'pay@omegaserv.com', address: '321 Omega Dr' }
    ];

    const newInvoices = [];
    
    let counter = 202510;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        // Generate an invoice every week approx
        const itemsCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let subtotal = 0;
        
        for (let i = 0; i < itemsCount; i++) {
            const quantity = Math.floor(Math.random() * 5) + 1;
            const unitPrice = Math.floor(Math.random() * 1000) + 100;
            const amount = quantity * unitPrice;
            subtotal += amount;
            
            items.push({
                description: `Consulting Service Item ${i + 1}`,
                quantity,
                unitPrice,
                amount
            });
        }
        
        const taxRate = 5;
        const taxTotal = (subtotal * taxRate) / 100;
        const total = subtotal + taxTotal;
        
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        
        const issueDate = new Date(d);
        const dueDate = new Date(d);
        dueDate.setDate(dueDate.getDate() + 15);
        
        const invoice = {
            invoiceNumber: `INV-${counter++}`,
            issueDate: issueDate,
            dueDate: dueDate,
            status: status,
            client: client,
            sender: {
                name: 'Seba Point',
                email: 'hello@sebapoint.com',
                address: 'Dubai, UAE'
            },
            items: items,
            subtotal: subtotal,
            taxTotal: taxTotal,
            globalTaxRate: taxRate,
            total: total,
            balanceDue: status === 'Paid' ? 0 : total,
            amountPaid: status === 'Paid' ? total : 0
        };
        
        newInvoices.push(invoice);
    }
    
    // Check for existing invoice numbers to avoid unique constraint errors
    const existingInvoices = await Invoice.find({}, 'invoiceNumber');
    const existingNumbers = new Set(existingInvoices.map(inv => inv.invoiceNumber));
    
    const invoicesToInsert = newInvoices.filter(inv => !existingNumbers.has(inv.invoiceNumber));

    if (invoicesToInsert.length > 0) {
        await Invoice.insertMany(invoicesToInsert);
        console.log(`Successfully inserted ${invoicesToInsert.length} fake invoices.`);
    } else {
        console.log('No new invoices to insert. Maybe numbers are already taken.');
    }
    
  } catch (error) {
    console.error('Error generating fake invoices:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

generateFakeInvoices();
