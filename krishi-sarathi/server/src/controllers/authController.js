// Krishi Sarathi - Authentication Controller (Farmer Registration & Login)
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db, { isPostgres, getLocalStore, persistLocalStore } from '../config/database.js';
import { generateToken } from '../middleware/authMiddleware.js';

// District code abbreviations for Kisan ID generation
const DISTRICT_CODES = {
  'indore': 'IND',
  'dewas': 'DEW',
  'ujjain': 'UJJ',
  'bhopal': 'BHP',
  'sehore': 'SEH',
  'dhar': 'DHA',
  'khargone': 'KHA'
};

function generateKisanId(district) {
  const code = DISTRICT_CODES[district?.toLowerCase()] || 'MP';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `KS-MP-${code}-${randomNum}`;
}

export async function register(req, res) {
  try {
    const {
      full_name,
      mobile_number,
      email,
      password,
      village,
      district,
      state = 'Madhya Pradesh',
      farmer_address,
      land_area,
      preferred_language = 'Hindi'
    } = req.body;

    // Field validations
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a valid full name.' });
    }
    if (!mobile_number || !/^\d{10}$/.test(mobile_number.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (!village || !district || !farmer_address) {
      return res.status(400).json({ success: false, message: 'Village, District, and Farmer address are required.' });
    }
    const parsedLand = parseFloat(land_area);
    if (isNaN(parsedLand) || parsedLand <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid positive land area in acres.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile_number.trim();

    if (isPostgres()) {
      // Check existing profile
      const checkRes = await db.query(
        'SELECT id FROM profiles WHERE LOWER(email) = $1 OR mobile_number = $2',
        [cleanEmail, cleanMobile]
      );
      if (checkRes.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email or mobile number already exists. Please log in.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const kisanId = generateKisanId(district);

      // Insert profile and farmer record atomically
      await db.withTransaction(async (tx) => {
        await tx.query(`
          INSERT INTO profiles (id, email, password_hash, role, full_name, mobile_number)
          VALUES ($1, $2, $3, 'farmer', $4, $5)
        `, [userId, cleanEmail, passwordHash, full_name.trim(), cleanMobile]);

        await tx.query(`
          INSERT INTO farmers (id, kisan_id, village, district, state, farmer_address, land_area, land_unit, preferred_language)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'Acres', $8)
        `, [userId, kisanId, village.trim(), district.trim(), state.trim(), farmer_address.trim(), parsedLand, preferred_language]);
      });

      const user = {
        id: userId,
        email: cleanEmail,
        role: 'farmer',
        full_name: full_name.trim(),
        mobile_number: cleanMobile,
        kisan_id: kisanId,
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        farmer_address: farmer_address.trim(),
        land_area: parsedLand,
        preferred_language
      };

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        message: 'Farmer registration completed successfully!',
        token,
        user
      });
    } else {
      // Local relational storage
      const store = getLocalStore();
      const existing = store.profiles.find(
        p => p.email.toLowerCase() === cleanEmail || p.mobile_number === cleanMobile
      );
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email or mobile number already exists. Please log in.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `usr-farmer-${Date.now()}`;
      const kisanId = generateKisanId(district);

      const newProfile = {
        id: userId,
        email: cleanEmail,
        password_hash: passwordHash,
        role: 'farmer',
        full_name: full_name.trim(),
        mobile_number: cleanMobile,
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      const newFarmer = {
        id: userId,
        kisan_id: kisanId,
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        farmer_address: farmer_address.trim(),
        land_area: parsedLand,
        land_unit: 'Acres',
        preferred_language,
        bank_account_masked: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
        ifsc_code: 'SBIN000' + Math.floor(1000 + Math.random() * 9000),
        created_at: new Date().toISOString()
      };

      store.profiles.push(newProfile);
      store.farmers.push(newFarmer);
      persistLocalStore();

      const user = {
        id: userId,
        email: cleanEmail,
        role: 'farmer',
        full_name: newProfile.full_name,
        mobile_number: newProfile.mobile_number,
        kisan_id: kisanId,
        village: newFarmer.village,
        district: newFarmer.district,
        state: newFarmer.state,
        farmer_address: newFarmer.farmer_address,
        land_area: newFarmer.land_area,
        preferred_language: newFarmer.preferred_language,
        bank_account_masked: newFarmer.bank_account_masked
      };

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        message: 'Farmer registration completed successfully!',
        token,
        user
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration: ' + err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    let profile = null;
    let farmer = null;

    if (isPostgres()) {
      const pRes = await db.query('SELECT * FROM profiles WHERE LOWER(email) = $1', [cleanEmail]);
      if (pRes.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      profile = pRes.rows[0];

      if (profile.role === 'farmer') {
        const fRes = await db.query('SELECT * FROM farmers WHERE id = $1', [profile.id]);
        farmer = fRes.rows[0] || null;
      }
    } else {
      const store = getLocalStore();
      profile = store.profiles.find(p => p.email.toLowerCase() === cleanEmail);
      if (!profile) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      if (profile.role === 'farmer') {
        farmer = store.farmers.find(f => f.id === profile.id);
      }
    }

    const isMatch = await bcrypt.compare(password, profile.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
      mobile_number: profile.mobile_number,
      avatar_url: profile.avatar_url,
      kisan_id: farmer?.kisan_id || null,
      village: farmer?.village || null,
      district: farmer?.district || null,
      state: farmer?.state || null,
      farmer_address: farmer?.farmer_address || null,
      land_area: farmer?.land_area || null,
      preferred_language: farmer?.preferred_language || 'Hindi',
      bank_account_masked: farmer?.bank_account_masked || null
    };

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login: ' + err.message });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user.id;
    let profile = null;
    let farmer = null;

    if (isPostgres()) {
      const pRes = await db.query('SELECT id, email, role, full_name, mobile_number, avatar_url, created_at FROM profiles WHERE id = $1', [userId]);
      if (pRes.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
      profile = pRes.rows[0];

      if (profile.role === 'farmer') {
        const fRes = await db.query('SELECT * FROM farmers WHERE id = $1', [userId]);
        farmer = fRes.rows[0] || null;
      }
    } else {
      const store = getLocalStore();
      profile = store.profiles.find(p => p.id === userId);
      if (!profile) return res.status(404).json({ success: false, message: 'User not found.' });
      if (profile.role === 'farmer') {
        farmer = store.farmers.find(f => f.id === userId);
      }
    }

    const user = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
      mobile_number: profile.mobile_number,
      avatar_url: profile.avatar_url,
      kisan_id: farmer?.kisan_id || null,
      village: farmer?.village || null,
      district: farmer?.district || null,
      state: farmer?.state || null,
      farmer_address: farmer?.farmer_address || null,
      land_area: farmer?.land_area || null,
      preferred_language: farmer?.preferred_language || 'Hindi',
      bank_account_masked: farmer?.bank_account_masked || null
    };

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export function getDemoCredentials(req, res) {
  return res.json({
    success: true,
    demoAccounts: [
      {
        role: 'Farmer (Demo)',
        email: 'farmer@krishisarathi.in',
        password: 'Farmer@123',
        description: 'Rameshwar Patel - Kisan ID: KS-MP-IND-01001 (Indore)',
        type: 'farmer'
      },
      {
        role: 'Mandi Centre Operator (Demo)',
        email: 'operator@krishisarathi.in',
        password: 'Operator@123',
        description: 'Shri Vikram Singh Chouhan - Indore Mandi Hub Gate Operator',
        type: 'operator'
      },
      {
        role: 'Government Administrator',
        email: 'admin@krishisarathi.in',
        password: 'Admin@123',
        description: 'State Krishi Vibhag Nodal Officer',
        type: 'admin'
      }
    ]
  });
}

export default {
  register,
  login,
  getMe,
  getDemoCredentials
};
