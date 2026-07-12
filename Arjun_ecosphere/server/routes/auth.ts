import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/mailer';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ecosphere_jwt_secret_key_12345';

interface InMemUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  xp: number;
  points: number;
  badges: string[];
  avatar: string;
}

// Pre-populate with hashed passwords so they can login out-of-the-box
const passwordHash = bcrypt.hashSync('password123', 10);

const inMemoryUsers: InMemUser[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'admin@ecosphere.com',
    passwordHash,
    role: 'admin',
    department: 'Corporate',
    xp: 2500,
    points: 1500,
    badges: ['b1', 'b2', 'b3'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'u2',
    name: 'Marcus Vance',
    email: 'manager@ecosphere.com',
    passwordHash,
    role: 'manager',
    department: 'Manufacturing',
    xp: 1200,
    points: 800,
    badges: ['b1', 'b4'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'u3',
    name: 'Aditi Rao',
    email: 'employee@ecosphere.com',
    passwordHash,
    role: 'user',
    department: 'Logistics',
    xp: 3910,
    points: 620,
    badges: ['b1', 'b2'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
];

// OTP store: email -> { code: string, expiry: number, verified: boolean }
const otpStore: Record<string, { code: string; expiry: number; verified: boolean }> = {};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailLower = email.toLowerCase();
    const userExists = inMemoryUsers.some(u => u.email.toLowerCase() === emailLower);
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: InMemUser = {
      id: `u_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email: emailLower,
      passwordHash: hashedPassword,
      role: (role === 'manager' ? 'manager' : 'user'),
      department: department || 'Manufacturing',
      xp: 100, // starting XP
      points: 50, // starting points
      badges: ['b1'], // starter badge
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
    };

    inMemoryUsers.push(newUser);
    console.log(`[Auth Register] Registered new user: ${newUser.name} (${newUser.email})`);
    
    // Return safe user object
    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error('[Auth Register Error]', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase();
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === emailLower);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    console.log(`[Auth Login] Login successful for: ${user.name} (${user.role})`);
    
    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (error: any) {
    console.error('[Auth Login Error]', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// 3. REQUEST OTP (FORGOT PASSWORD STEP 1)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const emailLower = email.toLowerCase();
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === emailLower);

    if (!user) {
      return res.status(404).json({ error: 'Business email address not registered in system' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 mins expiry

    otpStore[emailLower] = {
      code: otp,
      expiry,
      verified: false
    };

    // Send via Nodemailer
    const isEmailed = await sendOtpEmail(user.email, otp);

    return res.json({
      success: true,
      email: user.email,
      otp: !isEmailed ? otp : undefined, // expose to frontend only if SMTP isn't configured, so testing is seamless!
      message: isEmailed 
        ? 'A 6-digit secure verification code has been dispatched to your corporate email.' 
        : 'SMTP not configured: OTP has been generated in console and attached here for testing.'
    });
  } catch (error: any) {
    console.error('[Forgot Password Error]', error);
    return res.status(500).json({ error: 'Failed to request password reset' });
  }
});

// 4. VERIFY OTP (FORGOT PASSWORD STEP 2)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const emailLower = email.toLowerCase();
    const record = otpStore[emailLower];

    if (!record) {
      return res.status(400).json({ error: 'No verification session found for this email' });
    }

    if (Date.now() > record.expiry) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect 6-digit verification code' });
    }

    record.verified = true;
    return res.json({
      success: true,
      message: 'Identity authorized. Please provide your new secure password.'
    });
  } catch (error: any) {
    console.error('[Verify OTP Error]', error);
    return res.status(500).json({ error: 'Failed to verify OTP code' });
  }
});

// 5. RESET PASSWORD (FORGOT PASSWORD STEP 3)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const emailLower = email.toLowerCase();
    const record = otpStore[emailLower];

    if (!record || !record.verified) {
      return res.status(400).json({ error: 'Unauthorized security transition. Verify OTP first.' });
    }

    const user = inMemoryUsers.find(u => u.email.toLowerCase() === emailLower);
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Hash and update
    user.passwordHash = await bcrypt.hash(password, 10);
    
    // Clean up OTP store
    delete otpStore[emailLower];

    console.log(`[Auth Reset] Password updated successfully for: ${user.name}`);
    return res.json({
      success: true,
      message: 'Password restored. Please sign in with your new credentials.'
    });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    return res.status(500).json({ error: 'Failed to restore password' });
  }
});

export default router;
