// Comprehensive Seed Data for Krishi Sarathi
// Smart India Hackathon 2026 | Team: Off By One
import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('Farmer@123', 10);
const operatorHash = bcrypt.hashSync('Operator@123', 10);
const adminHash = bcrypt.hashSync('Admin@123', 10);

export const cropsData = [
  {
    id: 'crop-001',
    crop_code: 'WHEAT',
    name: 'Wheat',
    hindi_name: 'गेहूं (Sharbati & Lokwan)',
    season: 'Rabi',
    msp: 2275.00,
    unit: 'Quintal',
    procurement_window: 'March 15 - May 31, 2026',
    description: 'High-grade MP wheat with golden luster and high protein content.',
    icon_name: 'Wheat',
    is_active: true
  },
  {
    id: 'crop-002',
    crop_code: 'PADDY',
    name: 'Paddy (Common / Grade-A)',
    hindi_name: 'धान / चावल',
    season: 'Kharif',
    msp: 2183.00,
    unit: 'Quintal',
    procurement_window: 'October 1 - January 15, 2026',
    description: 'Paddy grain with standard moisture threshold under 17%.',
    icon_name: 'Sprout',
    is_active: true
  },
  {
    id: 'crop-003',
    crop_code: 'SOYBEAN',
    name: 'Soybean (Yellow)',
    hindi_name: 'सोयाबीन (पीला सोना)',
    season: 'Kharif',
    msp: 4600.00,
    unit: 'Quintal',
    procurement_window: 'October 15 - December 31, 2026',
    description: 'Malwa region yellow soybean with high oil extraction ratio.',
    icon_name: 'Bean',
    is_active: true
  },
  {
    id: 'crop-004',
    crop_code: 'MAIZE',
    name: 'Maize (Hybrid Corn)',
    hindi_name: 'मक्का',
    season: 'Kharif',
    msp: 2090.00,
    unit: 'Quintal',
    procurement_window: 'October 1 - December 20, 2026',
    description: 'Dry feed & food grade yellow hybrid maize.',
    icon_name: 'Corn',
    is_active: true
  },
  {
    id: 'crop-005',
    crop_code: 'GRAM',
    name: 'Gram (Chana / Desi Chickpea)',
    hindi_name: 'चना (देसी व डॉलर)',
    season: 'Rabi',
    msp: 5440.00,
    unit: 'Quintal',
    procurement_window: 'March 1 - May 15, 2026',
    description: 'Clean bold grain desi gram with high pulse quality.',
    icon_name: 'CircleDot',
    is_active: true
  },
  {
    id: 'crop-006',
    crop_code: 'MUSTARD',
    name: 'Mustard (Sarson / Rapeseed)',
    hindi_name: 'सरसों / राई',
    season: 'Rabi',
    msp: 5650.00,
    unit: 'Quintal',
    procurement_window: 'February 20 - April 30, 2026',
    description: 'High oil yield black and yellow mustard seeds.',
    icon_name: 'Flower2',
    is_active: true
  },
  {
    id: 'crop-007',
    crop_code: 'COTTON',
    name: 'Cotton (Medium Staple)',
    hindi_name: 'कपास (सफेद सोना)',
    season: 'Kharif',
    msp: 6620.00,
    unit: 'Quintal',
    procurement_window: 'October 25 - February 28, 2026',
    description: 'Clean lint seed cotton certified under Cotton Corporation standards.',
    icon_name: 'Cloud',
    is_active: true
  }
];

export const centresData = [
  {
    id: 'centre-001',
    centre_code: 'CEN-IND-01',
    name: 'Indore Laxmibai Nagar Mandi Hub (DEMO)',
    hindi_name: 'इंदौर लक्ष्मीबाई नगर कृषि उपज मंडी',
    district: 'Indore',
    address: 'Near Fort Railway Station, Laxmibai Nagar, Indore, MP 452006',
    latitude: 22.7533,
    longitude: 75.8637,
    daily_capacity: 1500.00,
    available_quota: 850.00,
    current_queue: 12,
    operational_status: 'Open',
    contact_phone: '+91-731-2521098',
    operator_name: 'Shri Vikram Singh Chouhan',
    is_demo: true
  },
  {
    id: 'centre-002',
    centre_code: 'CEN-IND-02',
    name: 'Sanwer Agricultural Mandi Yard (DEMO)',
    hindi_name: 'सांवेर कृषि उपज उपमंडी',
    district: 'Indore',
    address: 'Ujjain-Indore Road, Sanwer, District Indore, MP 453551',
    latitude: 22.9774,
    longitude: 75.8290,
    daily_capacity: 1000.00,
    available_quota: 620.00,
    current_queue: 5,
    operational_status: 'Open',
    contact_phone: '+91-732-2244101',
    operator_name: 'Shri Rajesh Verma',
    is_demo: true
  },
  {
    id: 'centre-003',
    centre_code: 'CEN-DEW-01',
    name: 'Dewas Central Krishi Upaj Mandi (DEMO)',
    hindi_name: 'देवास केंद्रीय कृषि उपज मंडी',
    district: 'Dewas',
    address: 'AB Road, Industrial Area, Dewas, MP 455001',
    latitude: 22.9676,
    longitude: 76.0534,
    daily_capacity: 1400.00,
    available_quota: 780.00,
    current_queue: 8,
    operational_status: 'Open',
    contact_phone: '+91-7272-251234',
    operator_name: 'Shri Anand Joshi',
    is_demo: true
  },
  {
    id: 'centre-004',
    centre_code: 'CEN-DEW-02',
    name: 'Sonkatch Agro Procurement Depot (DEMO)',
    hindi_name: 'सोनकच्छ उपमंडी उपार्जन केंद्र',
    district: 'Dewas',
    address: 'Bhopal-Indore Highway, Sonkatch, Dewas, MP 455118',
    latitude: 22.9812,
    longitude: 76.3719,
    daily_capacity: 900.00,
    available_quota: 410.00,
    current_queue: 15,
    operational_status: 'High Load',
    contact_phone: '+91-7270-244321',
    operator_name: 'Shri Mahesh Tiwari',
    is_demo: true
  },
  {
    id: 'centre-005',
    centre_code: 'CEN-UJJ-01',
    name: 'Ujjain Agar Road Krishi Mandi (DEMO)',
    hindi_name: 'उज्जैन आगर रोड कृषि उपज मंडी',
    district: 'Ujjain',
    address: 'Agar Road, Chimanganj Mandi, Ujjain, MP 456006',
    latitude: 23.1815,
    longitude: 75.7772,
    daily_capacity: 2000.00,
    available_quota: 1250.00,
    current_queue: 18,
    operational_status: 'Open',
    contact_phone: '+91-734-2550190',
    operator_name: 'Shri Govind Sharma',
    is_demo: true
  },
  {
    id: 'centre-006',
    centre_code: 'CEN-UJJ-02',
    name: 'Nagda Farmer Support Depot (DEMO)',
    hindi_name: 'नागदा किसान उपार्जन केंद्र',
    district: 'Ujjain',
    address: 'Bypass Road, Nagda, District Ujjain, MP 456335',
    latitude: 23.4542,
    longitude: 75.4184,
    daily_capacity: 800.00,
    available_quota: 320.00,
    current_queue: 4,
    operational_status: 'Open',
    contact_phone: '+91-7366-241088',
    operator_name: 'Shri Dinesh Rathore',
    is_demo: true
  },
  {
    id: 'centre-007',
    centre_code: 'CEN-UJJ-03',
    name: 'Tarana Grain Mandi (DEMO)',
    hindi_name: 'तराना अनाज उपमंडी केंद्र',
    district: 'Ujjain',
    address: 'Station Road, Tarana, District Ujjain, MP 456665',
    latitude: 23.3364,
    longitude: 76.0427,
    daily_capacity: 750.00,
    available_quota: 290.00,
    current_queue: 6,
    operational_status: 'Open',
    contact_phone: '+91-7368-232144',
    operator_name: 'Shri Kailash Malviya',
    is_demo: true
  },
  {
    id: 'centre-008',
    centre_code: 'CEN-BHP-01',
    name: 'Bhopal Karond Krishi Upaj Mandi (DEMO)',
    hindi_name: 'भोपाल करोंद कृषि उपज मंडी प्रांगण',
    district: 'Bhopal',
    address: 'Berasia Road, Karond, Bhopal, MP 462038',
    latitude: 23.2989,
    longitude: 77.3912,
    daily_capacity: 1800.00,
    available_quota: 950.00,
    current_queue: 14,
    operational_status: 'Open',
    contact_phone: '+91-755-2741990',
    operator_name: 'Shri Pradeep Saxena',
    is_demo: true
  },
  {
    id: 'centre-009',
    centre_code: 'CEN-BHP-02',
    name: 'Berasia Grain Procurement Depot (DEMO)',
    hindi_name: 'बैरसिया अनाज उपार्जन केंद्र',
    district: 'Bhopal',
    address: 'Vidisha Road, Berasia, District Bhopal, MP 463106',
    latitude: 23.6342,
    longitude: 77.4339,
    daily_capacity: 950.00,
    available_quota: 530.00,
    current_queue: 7,
    operational_status: 'Open',
    contact_phone: '+91-7561-222311',
    operator_name: 'Shri Ramkrishna Patel',
    is_demo: true
  },
  {
    id: 'centre-010',
    centre_code: 'CEN-SEH-01',
    name: 'Sehore Agricultural Mandi Yard (DEMO)',
    hindi_name: 'सीहोर कृषि उपज मंडी (भोपाल संभाग)',
    district: 'Sehore',
    address: 'Indore-Bhopal Highway, Sehore, MP 466001',
    latitude: 23.2031,
    longitude: 77.0844,
    daily_capacity: 1100.00,
    available_quota: 610.00,
    current_queue: 9,
    operational_status: 'Open',
    contact_phone: '+91-7562-224567',
    operator_name: 'Shri Omprakash Sharma',
    is_demo: true
  }
];

// 22 User Profiles: 1 Demo Farmer, 1 Demo Operator, 1 Admin, plus 19 more Farmers = 20 Farmers total
export const profilesData = [
  // Primary Demo Farmer
  {
    id: 'usr-farmer-001',
    email: 'farmer@krishisarathi.in',
    password_hash: passwordHash,
    role: 'farmer',
    full_name: 'Rameshwar Patel (रामेश्वर पटेल)',
    mobile_number: '9826012345',
    avatar_url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150'
  },
  // Primary Demo Centre Operator
  {
    id: 'usr-operator-001',
    email: 'operator@krishisarathi.in',
    password_hash: operatorHash,
    role: 'operator',
    full_name: 'Vikram Singh Chouhan (मंडी अधिकारी)',
    mobile_number: '9826098765',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  // Admin / Govt Director
  {
    id: 'usr-admin-001',
    email: 'admin@krishisarathi.in',
    password_hash: adminHash,
    role: 'admin',
    full_name: 'Krishi Vibhag Nodal Officer',
    mobile_number: '9425000001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  // 19 Additional Sample Farmers across MP
  { id: 'usr-farmer-002', email: 'rajesh.sharma@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Rajesh Sharma', mobile_number: '9827011221' },
  { id: 'usr-farmer-003', email: 'mohanlal.dhakad@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Mohanlal Dhakad', mobile_number: '9827011222' },
  { id: 'usr-farmer-004', email: 'sunita.bai@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Smt. Sunita Bai Verma', mobile_number: '9827011223' },
  { id: 'usr-farmer-005', email: 'kailash.patidar@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Kailash Chand Patidar', mobile_number: '9827011224' },
  { id: 'usr-farmer-006', email: 'jagdish.yadav@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Jagdish Prasad Yadav', mobile_number: '9827011225' },
  { id: 'usr-farmer-007', email: 'dinesh.malviya@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Dinesh Kumar Malviya', mobile_number: '9827011226' },
  { id: 'usr-farmer-008', email: 'kamla.bai@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Smt. Kamla Bai Rathore', mobile_number: '9827011227' },
  { id: 'usr-farmer-009', email: 'radheshyam.gurjar@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Radheshyam Gurjar', mobile_number: '9827011228' },
  { id: 'usr-farmer-010', email: 'bherulal.solanki@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Bherulal Solanki', mobile_number: '9827011229' },
  { id: 'usr-farmer-011', email: 'santosh.tiwari@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Santosh Tiwari', mobile_number: '9827011230' },
  { id: 'usr-farmer-012', email: 'mahesh.meena@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Mahesh Chandra Meena', mobile_number: '9827011231' },
  { id: 'usr-farmer-013', email: 'bhagwan.tomar@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Bhagwan Singh Tomar', mobile_number: '9827011232' },
  { id: 'usr-farmer-014', email: 'premnarayan.lodhi@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Premnarayan Lodhi', mobile_number: '9827011233' },
  { id: 'usr-farmer-015', email: 'geeta.bai@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Smt. Geeta Bai Rajput', mobile_number: '9827011234' },
  { id: 'usr-farmer-016', email: 'anokhilal.sen@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Anokhilal Sen', mobile_number: '9827011235' },
  { id: 'usr-farmer-017', email: 'narayan.parihar@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Narayan Singh Parihar', mobile_number: '9827011236' },
  { id: 'usr-farmer-018', email: 'jagannath.baghel@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Jagannath Baghel', mobile_number: '9827011237' },
  { id: 'usr-farmer-019', email: 'govind.mukati@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Govind Ram Mukati', mobile_number: '9827011238' },
  { id: 'usr-farmer-020', email: 'balram.dangi@krishi.mp.gov', password_hash: passwordHash, role: 'farmer', full_name: 'Balram Dangi', mobile_number: '9827011239' }
];

export const farmersData = [
  {
    id: 'usr-farmer-001',
    kisan_id: 'KS-MP-IND-01001',
    village: 'Manglia',
    district: 'Indore',
    state: 'Madhya Pradesh',
    farmer_address: 'Gali No. 3, Gram Manglia, Indore 453771',
    land_area: 18.5,
    land_unit: 'Acres',
    preferred_language: 'Hindi',
    bank_account_masked: 'XXXX-XXXX-4821',
    ifsc_code: 'SBIN0001234'
  },
  { id: 'usr-farmer-002', kisan_id: 'KS-MP-IND-01002', village: 'Sanwer Kheda', district: 'Indore', state: 'Madhya Pradesh', farmer_address: 'Post Sanwer, Indore 453551', land_area: 12.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-9102', ifsc_code: 'BARB0SANWER' },
  { id: 'usr-farmer-003', kisan_id: 'KS-MP-DEW-02001', village: 'Tonk Khurd', district: 'Dewas', state: 'Madhya Pradesh', farmer_address: 'Gram Tonk Khurd, Dewas 455116', land_area: 24.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-3341', ifsc_code: 'PUNB0245000' },
  { id: 'usr-farmer-004', kisan_id: 'KS-MP-DEW-02002', village: 'Bhauraso', district: 'Dewas', state: 'Madhya Pradesh', farmer_address: 'Near Mandi Road, Sonkatch, Dewas 455118', land_area: 8.5, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-7782', ifsc_code: 'SBIN0005541' },
  { id: 'usr-farmer-005', kisan_id: 'KS-MP-UJJ-03001', village: 'Tajpur', district: 'Ujjain', state: 'Madhya Pradesh', farmer_address: 'Maksi Road, Tajpur, Ujjain 456664', land_area: 32.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-6612', ifsc_code: 'CNRB0002100' },
  { id: 'usr-farmer-006', kisan_id: 'KS-MP-UJJ-03002', village: 'Unhel', district: 'Ujjain', state: 'Madhya Pradesh', farmer_address: 'Gram Unhel, Nagda Road, Ujjain 456221', land_area: 15.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-1129', ifsc_code: 'SBIN0009842' },
  { id: 'usr-farmer-007', kisan_id: 'KS-MP-UJJ-03003', village: 'Rupakhedi', district: 'Ujjain', state: 'Madhya Pradesh', farmer_address: 'Tehsil Tarana, District Ujjain 456665', land_area: 10.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-5544', ifsc_code: 'UBIN0542311' },
  { id: 'usr-farmer-008', kisan_id: 'KS-MP-BHP-04001', village: 'Kolar Dam Marg', district: 'Bhopal', state: 'Madhya Pradesh', farmer_address: 'Gram Hinotiya, Kolar, Bhopal 462042', land_area: 14.5, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-9981', ifsc_code: 'SBIN0003011' },
  { id: 'usr-farmer-009', kisan_id: 'KS-MP-BHP-04002', village: 'Gunga', district: 'Bhopal', state: 'Madhya Pradesh', farmer_address: 'Berasia Road, Gram Gunga, Bhopal 463106', land_area: 21.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-4420', ifsc_code: 'BKID0009012' },
  { id: 'usr-farmer-010', kisan_id: 'KS-MP-SEH-05001', village: 'Bilkisganj', district: 'Sehore', state: 'Madhya Pradesh', farmer_address: 'Gram Bilkisganj, Sehore 466111', land_area: 16.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-8871', ifsc_code: 'SBIN0001099' },
  { id: 'usr-farmer-011', kisan_id: 'KS-MP-IND-01003', village: 'Depalpur', district: 'Indore', state: 'Madhya Pradesh', farmer_address: 'Depalpur Kasba, Indore 453115', land_area: 19.5, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-3349', ifsc_code: 'BARB0DEPALP' },
  { id: 'usr-farmer-012', kisan_id: 'KS-MP-IND-01004', village: 'Mhow (Dr. Ambedkar Nagar)', district: 'Indore', state: 'Madhya Pradesh', farmer_address: 'Gram Kodariya, Mhow, Indore 453441', land_area: 11.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-2291', ifsc_code: 'SBIN0000421' },
  { id: 'usr-farmer-013', kisan_id: 'KS-MP-DEW-02003', village: 'Bagli', district: 'Dewas', state: 'Madhya Pradesh', farmer_address: 'Gram Chapda, Bagli, Dewas 455227', land_area: 28.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-6510', ifsc_code: 'PUNB0192300' },
  { id: 'usr-farmer-014', kisan_id: 'KS-MP-DEW-02004', village: 'Kannod', district: 'Dewas', state: 'Madhya Pradesh', farmer_address: 'Khategaon Marg, Kannod, Dewas 455332', land_area: 13.5, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-4109', ifsc_code: 'SBIN0002871' },
  { id: 'usr-farmer-015', kisan_id: 'KS-MP-UJJ-03004', village: 'Barnagar', district: 'Ujjain', state: 'Madhya Pradesh', farmer_address: 'Ingoriya Marg, Barnagar, Ujjain 456771', land_area: 22.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-7325', ifsc_code: 'CNRB0001092' },
  { id: 'usr-farmer-016', kisan_id: 'KS-MP-UJJ-03005', village: 'Mahidpur', district: 'Ujjain', state: 'Madhya Pradesh', farmer_address: 'Kshipra Tat, Mahidpur, Ujjain 456443', land_area: 17.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-8812', ifsc_code: 'UBIN0532101' },
  { id: 'usr-farmer-017', kisan_id: 'KS-MP-BHP-04003', village: 'Phanda Kalan', district: 'Bhopal', state: 'Madhya Pradesh', farmer_address: 'Sehore Road, Phanda Kalan, Bhopal 462030', land_area: 9.5, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-1178', ifsc_code: 'SBIN0008441' },
  { id: 'usr-farmer-018', kisan_id: 'KS-MP-BHP-04004', village: 'Bhadbhada', district: 'Bhopal', state: 'Madhya Pradesh', farmer_address: 'Neelbad Marg, Bhadbhada, Bhopal 462044', land_area: 14.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-9904', ifsc_code: 'BKID0004510' },
  { id: 'usr-farmer-019', kisan_id: 'KS-MP-SEH-05002', village: 'Ashta', district: 'Sehore', state: 'Madhya Pradesh', farmer_address: 'Parbati Nadi Marg, Ashta, Sehore 466116', land_area: 30.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-5529', ifsc_code: 'SBIN0001890' },
  { id: 'usr-farmer-020', kisan_id: 'KS-MP-SEH-05003', village: 'Ichhawar', district: 'Sehore', state: 'Madhya Pradesh', farmer_address: 'Gram Veerpur, Ichhawar, Sehore 466115', land_area: 20.0, land_unit: 'Acres', preferred_language: 'Hindi', bank_account_masked: 'XXXX-XXXX-6670', ifsc_code: 'BARB0ICHHAW' }
];

export const farmerCropsData = [
  { id: 'fc-001', farmer_id: 'usr-farmer-001', crop_id: 'crop-001', acreage: 10.0, estimated_yield: 180.0, sowing_date: '2025-11-15' },
  { id: 'fc-002', farmer_id: 'usr-farmer-001', crop_id: 'crop-003', acreage: 8.5, estimated_yield: 95.0, sowing_date: '2025-06-20' },
  { id: 'fc-003', farmer_id: 'usr-farmer-002', crop_id: 'crop-001', acreage: 8.0, estimated_yield: 140.0, sowing_date: '2025-11-10' },
  { id: 'fc-004', farmer_id: 'usr-farmer-003', crop_id: 'crop-005', acreage: 12.0, estimated_yield: 110.0, sowing_date: '2025-11-05' },
  { id: 'fc-005', farmer_id: 'usr-farmer-004', crop_id: 'crop-003', acreage: 8.5, estimated_yield: 85.0, sowing_date: '2025-06-25' },
  { id: 'fc-006', farmer_id: 'usr-farmer-005', crop_id: 'crop-001', acreage: 18.0, estimated_yield: 320.0, sowing_date: '2025-11-12' },
  { id: 'fc-007', farmer_id: 'usr-farmer-006', crop_id: 'crop-006', acreage: 7.0, estimated_yield: 70.0, sowing_date: '2025-10-25' },
  { id: 'fc-008', farmer_id: 'usr-farmer-007', crop_id: 'crop-004', acreage: 10.0, estimated_yield: 210.0, sowing_date: '2025-07-01' }
];

// Sample Bookings for Primary Demo Farmer and others
export const bookingsData = [
  // Booking 1: Demo Split Selling Booking (Stage 6: Quality Assessed)
  {
    id: 'bk-demo-001',
    booking_reference: 'BK-2026-IND-8812',
    farmer_id: 'usr-farmer-001',
    crop_id: 'crop-001', // Wheat
    total_quantity: 100.00,
    is_split: true,
    booking_date: '2026-11-08',
    status: 'Quality Assessed',
    token_number: 'A-042',
    qr_code_data: JSON.stringify({
      bookingId: 'BK-2026-IND-8812',
      token: 'A-042',
      kisanId: 'KS-MP-IND-01001',
      farmer: 'Rameshwar Patel',
      crop: 'Wheat',
      totalQuantity: 100,
      centres: ['Indore Laxmibai Nagar', 'Sanwer Mandi', 'Dewas Central']
    }),
    current_step: 6,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  // Booking 2: Single Centre Booking (Stage 9: Payment Completed)
  {
    id: 'bk-demo-002',
    booking_reference: 'BK-2026-IND-7731',
    farmer_id: 'usr-farmer-001',
    crop_id: 'crop-003', // Soybean
    total_quantity: 50.00,
    is_split: false,
    booking_date: '2026-11-04',
    status: 'Payment Completed',
    token_number: 'B-108',
    qr_code_data: JSON.stringify({
      bookingId: 'BK-2026-IND-7731',
      token: 'B-108',
      kisanId: 'KS-MP-IND-01001',
      crop: 'Soybean',
      quantity: 50,
      centre: 'Indore Laxmibai Nagar'
    }),
    current_step: 9,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  // Booking 3: Fresh Booking (Stage 2: Slot Booked)
  {
    id: 'bk-demo-003',
    booking_reference: 'BK-2026-IND-9045',
    farmer_id: 'usr-farmer-001',
    crop_id: 'crop-005', // Gram
    total_quantity: 40.00,
    is_split: false,
    booking_date: '2026-11-12',
    status: 'Slot Booked',
    token_number: 'C-019',
    qr_code_data: JSON.stringify({
      bookingId: 'BK-2026-IND-9045',
      token: 'C-019',
      kisanId: 'KS-MP-IND-01001',
      crop: 'Gram',
      quantity: 40,
      centre: 'Dewas Central Krishi Upaj Mandi'
    }),
    current_step: 2,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Split allocations for Booking 1 (Example in Module 6: 100 quintals split: 40 + 35 + 25)
export const bookingAllocationsData = [
  {
    id: 'alloc-001',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001', // Indore
    allocated_quantity: 40.00,
    status: 'Reserved',
    slot_time_window: '09:00 AM - 12:00 PM',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'alloc-002',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-002', // Sanwer
    allocated_quantity: 35.00,
    status: 'Reserved',
    slot_time_window: '12:00 PM - 03:00 PM',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'alloc-003',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-003', // Dewas
    allocated_quantity: 25.00,
    status: 'Reserved',
    slot_time_window: '03:00 PM - 06:00 PM',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  // Single centre allocation for Booking 2
  {
    id: 'alloc-004',
    booking_id: 'bk-demo-002',
    centre_id: 'centre-001',
    allocated_quantity: 50.00,
    status: 'Completed',
    slot_time_window: '10:00 AM - 01:00 PM',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  // Allocation for Booking 3
  {
    id: 'alloc-005',
    booking_id: 'bk-demo-003',
    centre_id: 'centre-003',
    allocated_quantity: 40.00,
    status: 'Reserved',
    slot_time_window: '09:00 AM - 12:00 PM',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Quota ledger records for auditability and transparency
export const quotaLedgerData = [
  {
    id: 'ql-001',
    centre_id: 'centre-001',
    booking_id: 'bk-demo-001',
    crop_id: 'crop-001',
    quantity_change: -40.00,
    previous_quota: 890.00,
    new_quota: 850.00,
    change_type: 'RESERVATION',
    notes: 'Split sell slot booked: 40 qtl Wheat for Rameshwar Patel (Token A-042)',
    recorded_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'ql-002',
    centre_id: 'centre-002',
    booking_id: 'bk-demo-001',
    crop_id: 'crop-001',
    quantity_change: -35.00,
    previous_quota: 655.00,
    new_quota: 620.00,
    change_type: 'RESERVATION',
    notes: 'Split sell slot booked: 35 qtl Wheat for Rameshwar Patel (Token A-042)',
    recorded_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'ql-003',
    centre_id: 'centre-003',
    booking_id: 'bk-demo-001',
    crop_id: 'crop-001',
    quantity_change: -25.00,
    previous_quota: 805.00,
    new_quota: 780.00,
    change_type: 'RESERVATION',
    notes: 'Split sell slot booked: 25 qtl Wheat for Rameshwar Patel (Token A-042)',
    recorded_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// 9-Step Visual Timeline Events for Booking 1 (currently at Step 6: Quality Assessed)
export const procurementEventsData = [
  {
    id: 'evt-001',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 1,
    event_name: 'Registration Completed',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: 'Farmer profile and Kisan ID KS-MP-IND-01001 verified through state portal.',
    operator_name: 'Portal System',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'evt-002',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 2,
    event_name: 'Slot Booked',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: '100 Qtl allocated with atomic quota lock across Indore, Sanwer & Dewas centres.',
    operator_name: 'Smart Allocation Engine',
    created_at: new Date(Date.now() - 3600000 * 23.5).toISOString()
  },
  {
    id: 'evt-003',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 3,
    event_name: 'QR Token Generated',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: 'Digital Token A-042 issued with cryptographic gate QR code.',
    operator_name: 'Token Dispatcher',
    created_at: new Date(Date.now() - 3600000 * 23).toISOString()
  },
  {
    id: 'evt-004',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 4,
    event_name: 'Farmer Arrived',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: 'Vehicle MP-09-GA-4512 scanned at Mandi Gate #2 by security scanner.',
    operator_name: 'Mandi Gate Guard (Rajesh S.)',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'evt-005',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 5,
    event_name: 'Weighing Completed',
    status: 'COMPLETED',
    gross_weight: 124.50,
    tare_weight: 84.50,
    net_weight: 40.00,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: 'Electronic weighbridge WB-03 calibration certified. Net weight 40.00 Quintals verified.',
    operator_name: 'Weighbridge Officer (D. Malviya)',
    created_at: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'evt-006',
    booking_id: 'bk-demo-001',
    centre_id: 'centre-001',
    event_step: 6,
    event_name: 'Quality Assessment',
    status: 'IN_PROGRESS',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: 11.4,
    quality_grade: 'Grade-A (FAQ)',
    operator_notes: 'Moisture analyzer test: 11.4% (well within 12% ceiling). Sharbati grain purity 98.8%.',
    operator_name: 'Quality Inspector (Vikram Singh)',
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString()
  },

  // Events for Booking 2 (Completed All 9 Stages)
  {
    id: 'evt-007',
    booking_id: 'bk-demo-002',
    centre_id: 'centre-001',
    event_step: 7,
    event_name: 'Crop Accepted',
    status: 'COMPLETED',
    gross_weight: 95.0,
    tare_weight: 45.0,
    net_weight: 50.0,
    moisture_percentage: 10.2,
    quality_grade: 'Grade-A',
    operator_notes: 'Crop accepted in Silo Compartment #4.',
    operator_name: 'Mandi Inspector',
    created_at: new Date(Date.now() - 3600000 * 50).toISOString()
  },
  {
    id: 'evt-008',
    booking_id: 'bk-demo-002',
    centre_id: 'centre-001',
    event_step: 8,
    event_name: 'Payment Initiated',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: 'PFMS batch DBT-MP-2026-0814 generated.',
    operator_name: 'Accounts Section',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'evt-009',
    booking_id: 'bk-demo-002',
    centre_id: 'centre-001',
    event_step: 9,
    event_name: 'Payment Completed',
    status: 'COMPLETED',
    gross_weight: null,
    tare_weight: null,
    net_weight: null,
    moisture_percentage: null,
    quality_grade: null,
    operator_notes: '₹2,30,000 credited to SBI A/c XXXX-4821 via NPCI Aadhaar Bridge.',
    operator_name: 'State Bank Gateway',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Payments records (Module 10: simulated DBT records)
export const paymentsData = [
  {
    id: 'pay-001',
    booking_id: 'bk-demo-002',
    farmer_id: 'usr-farmer-001',
    accepted_quantity: 50.00,
    msp_rate: 4600.00, // Soybean MSP
    gross_amount: 230000.00,
    mandi_cess: 0.00,
    net_amount: 230000.00,
    payment_status: 'Completed',
    transaction_ref: 'DBT-2026-MP-984210',
    dbt_batch_id: 'PFMS-BATCH-MP-2611-009',
    bank_account_masked: 'XXXX-XXXX-4821',
    ifsc_code: 'SBIN0001234',
    is_simulated: true,
    payment_date: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'pay-002',
    booking_id: 'bk-demo-001',
    farmer_id: 'usr-farmer-001',
    accepted_quantity: 40.00,
    msp_rate: 2275.00, // Wheat MSP
    gross_amount: 91000.00,
    mandi_cess: 0.00,
    net_amount: 91000.00,
    payment_status: 'Initiated',
    transaction_ref: 'DBT-2026-MP-PENDING-042',
    dbt_batch_id: 'PFMS-BATCH-MP-2611-014',
    bank_account_masked: 'XXXX-XXXX-4821',
    ifsc_code: 'SBIN0001234',
    is_simulated: true,
    payment_date: new Date().toISOString()
  }
];

// Pre-seeded weather records for all 10 demo centres
export const weatherRecordsData = centresData.map((c, i) => ({
  id: `weather-${i + 1}`,
  centre_id: c.id,
  temperature: 28.5 + (i % 4),
  rain_probability: i === 3 ? 65 : 12 + (i * 3), // Sonkatch has high rain risk
  weather_code: i === 3 ? 61 : 1, // 61: rain, 1: clear
  condition_text: i === 3 ? 'Light Rain / High Moisture Risk' : 'Clear & Sunny (Ideal for Unloading)',
  wind_speed: 12.4 + (i % 5),
  humidity: i === 3 ? 84 : 45 + (i * 2),
  alert_level: i === 3 ? 'Moderate Risk' : 'Normal',
  alert_message: i === 3 ? 'High moisture forecast: Keep tarpaulin ready for grain protection' : 'Optimal unloading conditions',
  is_simulated: true,
  recorded_at: new Date().toISOString()
}));
