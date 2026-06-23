import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import invoiceRouter from './routes/invoices.js';
import authRouter from './routes/auth.js';
import configRouter from './routes/config.js';
import servicesRouter from './routes/services.js';
import { activateLocalFallback } from './localDb.js';

// Schema imports for seeding
import User from './models/User.js';
import Service from './models/Service.js';
import WebSettings from './models/WebSettings.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Support base64 image payloads

// Connection Caching for serverless environments
let cachedDb = null;

// Add error listener to connection to prevent unhandled error event crashes
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

// Database Seeding Logic
async function seedDatabase() {
  try {
    // 1. Seed Owner Account
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultEmail = process.env.DEFAULT_OWNER_EMAIL || 'owner@sebapoint.com';
      const defaultPassword = process.env.DEFAULT_OWNER_PASSWORD || 'SebaOwner2026!';
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(defaultPassword, salt);
      
      const seedOwner = new User({
        email: defaultEmail,
        password: hashedPassword,
        role: 'owner',
        isActive: true
      });
      await seedOwner.save();
      console.log(`[SEED] Seeded master Owner account: ${defaultEmail}`);
    }

    // 2. Seed Default Website Settings
    const settingsCount = await WebSettings.countDocuments();
    if (settingsCount === 0) {
      const seedSettings = new WebSettings({
        siteName: 'SebaPoint',
        footerAddress: 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh.',
        footerPhone: '01813-884475',
        footerEmail: 'sebapoint01@gmail.com',
        socialLinks: { facebook: 'https://www.facebook.com/sebapoint' },
        aboutTitle: 'Our Mission & Story',
        aboutContent: 'Your One Stop Service Hub. We specialize in Trade Licenses, Company Registration, and Digital Business Solutions in Bangladesh.',
        contactAddress: 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh.',
        contactPhone: '01813-884475',
        contactEmail: 'sebapoint01@gmail.com',
        contactFacebook: 'https://www.facebook.com/sebapoint',
        contactWhatsapp: '+880 1813-884475',
        seo: {
          homepage: {
            title: 'SebaPoint - Trade License Broker & Consulting',
            description: 'Obtain all types of commercial business trade licenses in Bangladesh in 3 days.',
            headers: ['YOUR ONE STOP SERVICE HUB', 'Get Your Trade License Ready in 3 Days!'],
            subHeaders: ['৩ দিনে আপনার সব ধরনের লাইসেন্স রেডি!'],
            plainText: '"Our main purpose is to provide you with the best service." We handle new trade license registrations, renewals, NBR VAT (BIN) certificates, and company filings directly with government offices.'
          },
          about: {
            title: 'About Us - SebaPoint',
            description: 'SebaPoint is your premier consulting agency for trade license brokering in Dhaka, Bangladesh.',
            headers: ['Our Mission & Story', 'Why Choose SebaPoint?'],
            plainText: 'SebaPoint is a digital service point that offers comprehensive digital solutions for online success. We manage trade license type things in exchange for client convenience.'
          },
          contact: {
            title: 'Contact Us - SebaPoint',
            description: 'Get in touch with SebaPoint for fast and secure trade license processing in Gulshan, Dhaka.',
            headers: ['Office & Support Desk'],
            plainText: 'Our support desk handles Zoning applications, NBR BIN (VAT) registrations, holding taxes, and corporate filings. You can call us, email us, or visit our desk in Dhaka.'
          }
        }
      });
      await seedSettings.save();
      console.log('[SEED] Seeded default WebSettings');
    }

    // 3. Seed Default Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const defaultServices = [
        {
          id: 'new-license',
          title: 'New Trade License Registration',
          shortDescription: 'Obtain a fresh commercial trade license from Dhaka North or South City Corporation.',
          fullDescription: 'Our team coordinates the entire process of getting a new commercial trade license. We prepare the Application Form (Form K), verify holding tax receipts, establish landlord rent agreements, and manage inspections by City Corporation officers on your behalf.',
          image: '/assets/images/new_license.png',
          govtFee: '৳2,000 - ৳8,000 (depends on business type)',
          brokerFee: '৳1,500',
          timeline: '3 - 5 Business Days',
          documents: [
            'Copy of National ID (NID) of owner',
            'Recent Passport-sized Photo (3 copies)',
            'Rental Agreement of commercial space',
            'Holding Tax Receipt of landlord',
            'Holding Utility Bill (copy)'
          ]
        },
        {
          id: 'renewal',
          title: 'Trade License Annual Renewal',
          shortDescription: 'Stress-free annual renewal of your business trade licenses with City Corporations.',
          fullDescription: 'Avoid penalties and late fees. We pick up your old trade license, calculate the renewal taxes, pay the bank challans, submit the paperwork, and deliver the freshly stamped license back to your desk.',
          image: '/assets/images/license_renewal.png',
          govtFee: 'Depends on business classification & signboards',
          brokerFee: '৳1,000',
          timeline: '2 - 3 Business Days',
          documents: [
            'Original copy of the previous Trade License',
            'TIN Certificate (Tax Identification Number)',
            'Holding Tax paid receipt (if applicable)',
            'Challan/Bank receipt of previous payment'
          ]
        },
        {
          id: 'limited-company',
          title: 'Limited Company Registration',
          shortDescription: 'Register limited liability or One Person Companies (OPC) with RJSC Bangladesh.',
          fullDescription: 'We help you launch your business as a legal entity under the Registrar of Joint Stock Companies and Firms (RJSC). Services include Name Clearance, Drafting Memorandum of Association (MoA) and Articles of Association (AoA), getting Form XII, and obtaining the Incorporation Certificate.',
          image: '/assets/images/company_registry.png',
          govtFee: '৳5,000 - ৳25,000 (scales with Authorized Capital)',
          brokerFee: '৳5,000',
          timeline: '7 - 10 Business Days',
          documents: [
            'Proposed Company Names (for clearance)',
            'NID and Photos of all directors (minimum 2 for LTD, 1 for OPC)',
            'TIN Certificates of all directors',
            'Shareholding ratio & authorized capital details'
          ]
        },
        {
          id: 'vat-tin',
          title: 'TIN & VAT (BIN) Registration',
          shortDescription: 'Obtain 12-digit Tax TIN and Business Identification Number (BIN) certificates.',
          fullDescription: 'Secure your Tax TIN and VAT BIN certificates from the National Board of Revenue (NBR). We register your business under the correct NBR circle, submit utility papers, and deliver active certificates required for banking and imports.',
          image: '/assets/images/tax_vat.png',
          govtFee: 'Free (Government registration)',
          brokerFee: '৳1,000',
          timeline: '1 - 2 Business Days',
          documents: [
            'Copy of NID and Trade License',
            'Owner phone number (linked to NID)',
            'Company incorporation papers (if Limited)'
          ]
        },
        {
          id: 'irc-erc',
          title: 'Import (IRC) & Export (ERC) Licensing',
          shortDescription: 'Obtain IRC & ERC registrations from the CCI&E office to run international trades.',
          fullDescription: 'Get recommendations and clear licensing registration for commercial or industrial import/export. We handle the Chief Controller of Imports and Exports (CCI&E) filing, Chamber of Commerce membership, and bank solvency audits.',
          image: '/assets/images/import_export.png',
          govtFee: '৳5,000 - ৳45,000 (depends on limit categories)',
          brokerFee: '৳4,500',
          timeline: '5 - 7 Business Days',
          documents: [
            'Valid Trade License copy',
            'Valid TIN & VAT (BIN) certificates',
            'Bank Solvency Certificate & solvency profile',
            'Membership Certificate from local Chamber of Commerce'
          ]
        },
        {
          id: 'fire-env',
          title: 'Fire License & Environment Clearance',
          shortDescription: 'Secure safety certificates from Fire Service and Department of Environment (DoE).',
          fullDescription: 'Crucial for warehouse, factory, restaurant, or high-rise business spaces. We coordinate with the Fire Service & Civil Defence and Department of Environment (DoE) inspectors, prepare maps/diagrams, and get your clearance certificates.',
          image: '/assets/images/safety_clearance.png',
          govtFee: 'Depends on floor space & environment category',
          brokerFee: '৳3,500',
          timeline: '10 - 15 Business Days',
          documents: [
            'Trade License copy',
            'Emergency fire safety plan map/layout',
            'DoE Form/No-Objection Certificate (NOC)',
            'Landlord holding agreement'
          ]
        }
      ];
      await Service.insertMany(defaultServices);
      console.log('[SEED] Seeded default Service Cards');
    }
  } catch (error) {
    console.error('[SEED] Seeding error:', error);
  }
}

let localFallbackActive = false;

async function connectToDatabase() {
  if (localFallbackActive) {
    return;
  }
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sebainvoice';
  
  mongoose.set('strictQuery', true);
  try {
    const conn = await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2000 });
    cachedDb = conn;
    // Trigger seeding after successful connection
    await seedDatabase();
    return cachedDb;
  } catch (err) {
    console.warn('MongoDB connection failed. Activating local JSON file fallback database...', err.message);
    activateLocalFallback();
    localFallbackActive = true;
    await seedDatabase();
  }
}

// Middleware to ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed: ' + error.message });
  }
});

// Register API Routes
app.use('/api/invoices', invoiceRouter);
app.use('/api/auth', authRouter);
app.use('/api/config', configRouter);
app.use('/api/services', servicesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    databaseState: localFallbackActive ? 'fallback-local-json' : (mongoose.connection.readyState === 1 ? 'connected' : 'disconnected')
  });
});

// Fallback for local development running standard Express server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
