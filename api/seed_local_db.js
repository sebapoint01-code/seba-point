import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), '../local-db.json');

function generateFakeInvoices() {
    let db = { users: [], services: [], websettings: [], invoices: [] };
    
    if (fs.existsSync(DB_FILE)) {
        try {
            db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        } catch(e) {
            console.error("Error parsing local-db.json");
        }
    }
    
    if (!db.invoices) db.invoices = [];
    
    const startDate = new Date(2025, 9, 1); // Oct 1, 2025
    const endDate = new Date(2026, 5, 30); // June 30, 2026
    
    const statuses = ['Paid', 'Paid', 'Paid', 'Paid', 'Unpaid', 'Overdue'];
    
    const clients = [
        { name: 'Tech Solutions Inc', email: 'billing@techsol.com', address: '123 Tech Ln', phone: '', taxId: '' },
        { name: 'Global Logistics', email: 'accounts@globallog.com', address: '456 Freight Blvd', phone: '', taxId: '' },
        { name: 'Alpha Retail', email: 'finance@alpharetail.com', address: '789 Market St', phone: '', taxId: '' },
        { name: 'Omega Services', email: 'pay@omegaserv.com', address: '321 Omega Dr', phone: '', taxId: '' }
    ];

    const newInvoices = [];
    let counter = 202510;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
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
                taxRate: 0,
                discount: 0,
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
        
        const _id = Math.random().toString(36).substring(2, 11);
        
        const invoice = {
            _id,
            invoiceNumber: `INV-${counter++}`,
            issueDate: issueDate.toISOString(),
            dueDate: dueDate.toISOString(),
            paymentTerms: 'Due on Receipt',
            currency: 'USD',
            accentColor: '#2563eb',
            status: status,
            client: client,
            sender: {
                name: 'Seba Point',
                email: 'hello@sebapoint.com',
                address: 'Dubai, UAE',
                phone: '',
                logoUrl: '',
                taxId: ''
            },
            items: items,
            globalDiscountRate: 0,
            globalTaxRate: taxRate,
            taxName: 'Tax',
            shippingFee: 0,
            subtotal: subtotal,
            discountTotal: 0,
            taxTotal: taxTotal,
            total: total,
            balanceDue: status === 'Paid' ? 0 : total,
            amountPaid: status === 'Paid' ? total : 0,
            notes: '',
            terms: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        newInvoices.push(invoice);
    }
    
    // Check existing numbers
    const existingNumbers = new Set(db.invoices.map(inv => inv.invoiceNumber));
    const invoicesToInsert = newInvoices.filter(inv => !existingNumbers.has(inv.invoiceNumber));

    if (invoicesToInsert.length > 0) {
        db.invoices.push(...invoicesToInsert);
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log(`Successfully inserted ${invoicesToInsert.length} fake invoices into local-db.json.`);
    } else {
        console.log('No new invoices to insert.');
    }
}

generateFakeInvoices();
