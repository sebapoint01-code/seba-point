import express from 'express';
import WebSettings from '../models/WebSettings.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET website settings (Public)
router.get('/', async (req, res) => {
  try {
    let settings = await WebSettings.findOne();
    if (!settings) {
      // Create a default settings object if none exists in the DB
      settings = new WebSettings({
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
        contactWhatsapp: '+880 1813-884475'
      });
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings: ' + error.message });
  }
});

// PUT update website settings (Admin/Owner Only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    let settings = await WebSettings.findOne();
    if (!settings) {
      settings = new WebSettings();
    }
    
    // Update all fields passed in request body
    Object.assign(settings, req.body);
    const updatedSettings = await settings.save();
    
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings: ' + error.message });
  }
});

export default router;
