import mongoose from 'mongoose';

const pageSeoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  headers: { type: [String], default: [] },
  subHeaders: { type: [String], default: [] },
  plainText: { type: String, default: '' },
  tables: { type: [mongoose.Schema.Types.Mixed], default: [] } // For custom tables
}, { _id: false });

const webSettingsSchema = new mongoose.Schema({
  siteName: { 
    type: String, 
    default: 'SebaPoint' 
  },
  logo: { 
    type: String, 
    default: '' // Base64 representation of the logo
  },
  slides: { 
    type: [String], 
    default: [] // Base64 slider images
  },
  footerAddress: { 
    type: String, 
    default: '' 
  },
  footerPhone: { 
    type: String, 
    default: '' 
  },
  footerEmail: { 
    type: String, 
    default: '' 
  },
  socialLinks: {
    facebook: { type: String, default: '' }
  },
  aboutTitle: { 
    type: String, 
    default: '' 
  },
  aboutContent: { 
    type: String, 
    default: '' 
  },
  contactAddress: { 
    type: String, 
    default: '' 
  },
  contactPhone: { 
    type: String, 
    default: '' 
  },
  contactEmail: { 
    type: String, 
    default: '' 
  },
  contactFacebook: { 
    type: String, 
    default: '' 
  },
  contactWhatsapp: { 
    type: String, 
    default: '' 
  },
  seo: {
    homepage: { type: pageSeoSchema, default: () => ({}) },
    about: { type: pageSeoSchema, default: () => ({}) },
    contact: { type: pageSeoSchema, default: () => ({}) }
  }
}, {
  timestamps: true
});

const WebSettings = mongoose.models.WebSettings || mongoose.model('WebSettings', webSettingsSchema);
export default WebSettings;
