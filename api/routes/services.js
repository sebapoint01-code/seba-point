import express from 'express';
import Service from '../models/Service.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET all active services (Public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isPaused: false });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching active services:', error);
    res.status(500).json({ error: 'Failed to fetch services: ' + error.message });
  }
});

// GET all services including paused (Admin/Owner Only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ error: 'Failed to fetch services: ' + error.message });
  }
});

// POST create a new service card (Admin/Owner Only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    // Generate a unique slug ID from title (e.g. "Import sol" -> "import-sol")
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if ID already exists
    const existing = await Service.findOne({ id });
    if (existing) {
      return res.status(400).json({ error: `A service with a similar title already exists.` });
    }

    const newService = new Service({
      ...req.body,
      id
    });
    
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service: ' + error.message });
  }
});

// PUT update a service card (Admin/Owner Only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service: ' + error.message });
  }
});

// DELETE a service card (Admin/Owner Only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ id: req.params.id });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service card deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service: ' + error.message });
  }
});

export default router;
