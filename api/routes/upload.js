import express from 'express';
import { upload } from '../config/cloudinary.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  res.status(200).json({ 
    message: 'Image uploaded successfully',
    url: req.file.path 
  });
});

export default router;
