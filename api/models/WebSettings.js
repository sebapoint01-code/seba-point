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
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  aboutTitle: { 
    type: String, 
    default: '' 
  },
  aboutContent: { 
    type: String, 
    default: 'Starting a business in Bangladesh should be exciting... (default text)' 
  },
  aboutBanner: {
    type: String,
    default: '/about_banner.png'
  },
  contactAddress: { 
    type: String, 
    default: 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh' 
  },
  contactPhone: { 
    type: String, 
    default: '01813-884475' 
  },
  contactEmail: { 
    type: String, 
    default: 'sebapoint01@gmail.com' 
  },
  contactFacebook: { 
    type: String, 
    default: 'https://www.facebook.com/sebapoint' 
  },
  contactWhatsapp: { 
    type: String, 
    default: '+880 1813-884475' 
  },
  contactBanner: {
    type: String,
    default: '/contact_banner.png'
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
