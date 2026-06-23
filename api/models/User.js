import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'owner'], 
    default: 'admin' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  resetOtp: { 
    type: String 
  },
  resetOtpExpires: { 
    type: Date 
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
