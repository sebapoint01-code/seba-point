import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  shortDescription: { 
    type: String, 
    required: true 
  },
  fullDescription: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    default: '' 
  },
  govtFee: { 
    type: String, 
    required: true 
  },
  brokerFee: { 
    type: String, 
    required: true 
  },
  timeline: { 
    type: String, 
    required: true 
  },
  documents: { 
    type: [String], 
    default: [] 
  },
  isPaused: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
