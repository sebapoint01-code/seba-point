import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sebapoint_secret_key_2026';

// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied: Session token missing' });
  
  // Dev bypass (only active when not in production environment)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && token === 'dev-bypass-token') {
    req.user = { email: 'owner@sebapoint.com', role: 'owner' };
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Access denied: Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

// Middleware to restrict by role
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access denied: Requires ${role} role` });
    }
    next();
  };
}

// Helper to send OTP email
async function sendOtpEmail(email, otp) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`\n======================================================`);
    console.log(`[DEVELOPMENT MAIL FALLBACK] OTP for ${email}: ${otp}`);
    console.log(`======================================================\n`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"SebaPoint Support" <${SMTP_USER}>`,
    to: email,
    subject: 'SebaPoint Password Reset OTP',
    text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a; margin-bottom: 20px;">SebaPoint Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:</p>
        <div style="font-size: 2rem; font-weight: 800; letter-spacing: 0.1em; text-align: center; padding: 15px; background-color: #f0fdf4; border: 1px solid #dcfce7; color: #16a34a; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.8rem; color: #64748b;">SebaPoint Consulting Agency. Office: Gulshan-1, Dhaka, Bangladesh.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

// POST User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials or inactive user' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// POST Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send the OTP
    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to request OTP: ' + error.message });
  }
});

// POST Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const user = await User.findOne({ 
      email, 
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    res.status(200).json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP: ' + error.message });
  }
});

// POST Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ 
      email, 
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired request' });
    }

    // Hash new password and save
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    
    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password: ' + error.message });
  }
});

// OWNER ONLY - Get list of Admins
router.get('/admins', authenticateToken, requireRole('owner'), async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// OWNER ONLY - Add Admin
router.post('/admins', authenticateToken, requireRole('owner'), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newAdmin = new User({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ 
      message: 'Admin account created successfully',
      admin: { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role }
    });
  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({ error: 'Failed to create admin: ' + error.message });
  }
});

// OWNER ONLY - Delete Admin
router.delete('/admins/:id', authenticateToken, requireRole('owner'), async (req, res) => {
  try {
    const deletedAdmin = await User.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }
    res.status(200).json({ message: 'Admin account deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Failed to delete admin: ' + error.message });
  }
});

export default router;
