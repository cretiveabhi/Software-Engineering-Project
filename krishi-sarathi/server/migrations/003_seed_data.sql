-- KRISHI SARATHI (कृषि सारथी)
-- Migration 003: Comprehensive Seed Data for Supabase PostgreSQL
-- Smart India Hackathon 2026 | PS: SIH26032 | Team: Off By One

-- 1. Insert 7 Crops
INSERT INTO crops (id, crop_code, name, hindi_name, season, msp, unit, procurement_window, description, icon_name, is_active)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'WHEAT', 'Wheat', 'गेहूं (Sharbati & Lokwan)', 'Rabi', 2275.00, 'Quintal', 'March 15 - May 31, 2026', 'High-grade MP wheat with golden luster and high protein content.', 'Wheat', true),
  ('c0000000-0000-0000-0000-000000000002', 'PADDY', 'Paddy (Common / Grade-A)', 'धान / चावल', 'Kharif', 2183.00, 'Quintal', 'October 1 - January 15, 2026', 'Paddy grain with standard moisture threshold under 17%.', 'Sprout', true),
  ('c0000000-0000-0000-0000-000000000003', 'SOYBEAN', 'Soybean (Yellow)', 'सोयाबीन (पीला सोना)', 'Kharif', 4600.00, 'Quintal', 'October 15 - December 31, 2026', 'Malwa region yellow soybean with high oil extraction ratio.', 'Bean', true),
  ('c0000000-0000-0000-0000-000000000004', 'MAIZE', 'Maize (Hybrid Corn)', 'मक्का', 'Kharif', 2090.00, 'Quintal', 'October 1 - December 20, 2026', 'Dry feed & food grade yellow hybrid maize.', 'Corn', true),
  ('c0000000-0000-0000-0000-000000000005', 'GRAM', 'Gram (Chana / Desi Chickpea)', 'चना (देसी व डॉलर)', 'Rabi', 5440.00, 'Quintal', 'March 1 - May 15, 2026', 'Clean bold grain desi gram with high pulse quality.', 'CircleDot', true),
  ('c0000000-0000-0000-0000-000000000006', 'MUSTARD', 'Mustard (Sarson / Rapeseed)', 'सरसों / राई', 'Rabi', 5650.00, 'Quintal', 'February 20 - April 30, 2026', 'High oil yield black and yellow mustard seeds.', 'Flower2', true),
  ('c0000000-0000-0000-0000-000000000007', 'COTTON', 'Cotton (Medium Staple)', 'कपास (सफेद सोना)', 'Kharif', 6620.00, 'Quintal', 'October 25 - February 28, 2026', 'Clean lint seed cotton certified under Cotton Corporation standards.', 'Cloud', true)
ON CONFLICT (id) DO UPDATE SET msp = EXCLUDED.msp;

-- 2. Insert 10 Sample Procurement Centres in Madhya Pradesh
INSERT INTO procurement_centres (id, centre_code, name, hindi_name, district, address, latitude, longitude, daily_capacity, available_quota, current_queue, operational_status, contact_phone, operator_name, is_demo)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'CEN-IND-01', 'Indore Laxmibai Nagar Mandi Hub (DEMO)', 'इंदौर लक्ष्मीबाई नगर कृषि उपज मंडी', 'Indore', 'Near Fort Railway Station, Laxmibai Nagar, Indore, MP 452006', 22.7533, 75.8637, 1500.00, 850.00, 12, 'Open', '+91-731-2521098', 'Shri Vikram Singh Chouhan', true),
  ('e0000000-0000-0000-0000-000000000002', 'CEN-IND-02', 'Sanwer Agricultural Mandi Yard (DEMO)', 'सांवेर कृषि उपज उपमंडी', 'Indore', 'Ujjain-Indore Road, Sanwer, District Indore, MP 453551', 22.9774, 75.8290, 1000.00, 620.00, 5, 'Open', '+91-732-2244101', 'Shri Rajesh Verma', true),
  ('e0000000-0000-0000-0000-000000000003', 'CEN-DEW-01', 'Dewas Central Krishi Upaj Mandi (DEMO)', 'देवास केंद्रीय कृषि उपज मंडी', 'Dewas', 'AB Road, Industrial Area, Dewas, MP 455001', 22.9676, 76.0534, 1400.00, 780.00, 8, 'Open', '+91-7272-251234', 'Shri Anand Joshi', true),
  ('e0000000-0000-0000-0000-000000000004', 'CEN-DEW-02', 'Sonkatch Agro Procurement Depot (DEMO)', 'सोनकच्छ उपमंडी उपार्जन केंद्र', 'Dewas', 'Bhopal-Indore Highway, Sonkatch, Dewas, MP 455118', 22.9812, 76.3719, 900.00, 410.00, 15, 'High Load', '+91-7270-244321', 'Shri Mahesh Tiwari', true),
  ('e0000000-0000-0000-0000-000000000005', 'CEN-UJJ-01', 'Ujjain Agar Road Krishi Mandi (DEMO)', 'उज्जैन आगर रोड कृषि उपज मंडी', 'Ujjain', 'Agar Road, Chimanganj Mandi, Ujjain, MP 456006', 23.1815, 75.7772, 2000.00, 1250.00, 18, 'Open', '+91-734-2550190', 'Shri Govind Sharma', true),
  ('e0000000-0000-0000-0000-000000000006', 'CEN-UJJ-02', 'Nagda Farmer Support Depot (DEMO)', 'नागदा किसान उपार्जन केंद्र', 'Ujjain', 'Bypass Road, Nagda, District Ujjain, MP 456335', 23.4542, 75.4184, 800.00, 320.00, 4, 'Open', '+91-7366-241088', 'Shri Dinesh Rathore', true),
  ('e0000000-0000-0000-0000-000000000007', 'CEN-UJJ-03', 'Tarana Grain Mandi (DEMO)', 'तराना अनाज उपमंडी केंद्र', 'Ujjain', 'Station Road, Tarana, District Ujjain, MP 456665', 23.3364, 76.0427, 750.00, 290.00, 6, 'Open', '+91-7368-232144', 'Shri Kailash Malviya', true),
  ('e0000000-0000-0000-0000-000000000008', 'CEN-BHP-01', 'Bhopal Karond Krishi Upaj Mandi (DEMO)', 'भोपाल करोंद कृषि उपज मंडी प्रांगण', 'Bhopal', 'Berasia Road, Karond, Bhopal, MP 462038', 23.2989, 77.3912, 1800.00, 950.00, 14, 'Open', '+91-755-2741990', 'Shri Pradeep Saxena', true),
  ('e0000000-0000-0000-0000-000000000009', 'CEN-BHP-02', 'Berasia Grain Procurement Depot (DEMO)', 'बैरसिया अनाज उपार्जन केंद्र', 'Bhopal', 'Vidisha Road, Berasia, District Bhopal, MP 463106', 23.6342, 77.4339, 950.00, 530.00, 7, 'Open', '+91-7561-222311', 'Shri Ramkrishna Patel', true),
  ('e0000000-0000-0000-0000-000000000010', 'CEN-SEH-01', 'Sehore Agricultural Mandi Yard (DEMO)', 'सीहोर कृषि उपज मंडी (भोपाल संभाग)', 'Sehore', 'Indore-Bhopal Highway, Sehore, MP 466001', 23.2031, 77.0844, 1100.00, 610.00, 9, 'Open', '+91-7562-224567', 'Shri Omprakash Sharma', true)
ON CONFLICT (id) DO UPDATE SET daily_capacity = EXCLUDED.daily_capacity;

-- 3. Insert Demo Profiles
-- Password hash for 'Farmer@123': $2a$10$wE9KvZ7B2oJb6qV9m4y1bOHP.W5n5Z3zX/6Q3p3J8p6g8m6e1a4e (or standard bcrypt)
INSERT INTO profiles (id, email, password_hash, role, full_name, mobile_number, avatar_url)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'farmer@krishisarathi.in', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'farmer', 'Rameshwar Patel (रामेश्वर पटेल)', '9826012345', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150'),
  ('a0000000-0000-0000-0000-000000000001', 'operator@krishisarathi.in', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'operator', 'Vikram Singh Chouhan (मंडी अधिकारी)', '9826098765', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('b0000000-0000-0000-0000-000000000001', 'admin@krishisarathi.in', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'admin', 'Krishi Vibhag Nodal Officer', '9425000001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('f0000000-0000-0000-0000-000000000002', 'rajesh.sharma@krishi.mp.gov', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'farmer', 'Rajesh Sharma', '9827011221', NULL),
  ('f0000000-0000-0000-0000-000000000003', 'mohanlal.dhakad@krishi.mp.gov', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'farmer', 'Mohanlal Dhakad', '9827011222', NULL),
  ('f0000000-0000-0000-0000-000000000004', 'sunita.bai@krishi.mp.gov', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'farmer', 'Smt. Sunita Bai Verma', '9827011223', NULL),
  ('f0000000-0000-0000-0000-000000000005', 'kailash.patidar@krishi.mp.gov', '$2a$10$8.e9X7rW7f1Ld8T7h3yX1eT1a1l1q1v1w1x1y1z1a1b1c1d1e1f1g', 'farmer', 'Kailash Chand Patidar', '9827011224', NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Farmers Table
INSERT INTO farmers (id, kisan_id, village, district, state, farmer_address, land_area, land_unit, preferred_language, bank_account_masked, ifsc_code)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'KS-MP-IND-01001', 'Manglia', 'Indore', 'Madhya Pradesh', 'Gali No. 3, Gram Manglia, Indore 453771', 18.5, 'Acres', 'Hindi', 'XXXX-XXXX-4821', 'SBIN0001234'),
  ('f0000000-0000-0000-0000-000000000002', 'KS-MP-IND-01002', 'Sanwer Kheda', 'Indore', 'Madhya Pradesh', 'Post Sanwer, Indore 453551', 12.0, 'Acres', 'Hindi', 'XXXX-XXXX-9102', 'BARB0SANWER'),
  ('f0000000-0000-0000-0000-000000000003', 'KS-MP-DEW-02001', 'Tonk Khurd', 'Dewas', 'Madhya Pradesh', 'Gram Tonk Khurd, Dewas 455116', 24.0, 'Acres', 'Hindi', 'XXXX-XXXX-3341', 'PUNB0245000'),
  ('f0000000-0000-0000-0000-000000000004', 'KS-MP-DEW-02002', 'Bhauraso', 'Dewas', 'Madhya Pradesh', 'Near Mandi Road, Sonkatch, Dewas 455118', 8.5, 'Acres', 'Hindi', 'XXXX-XXXX-7782', 'SBIN0005541'),
  ('f0000000-0000-0000-0000-000000000005', 'KS-MP-UJJ-03001', 'Tajpur', 'Ujjain', 'Madhya Pradesh', 'Maksi Road, Tajpur, Ujjain 456664', 32.0, 'Acres', 'Hindi', 'XXXX-XXXX-6612', 'CNRB0002100')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Bookings
INSERT INTO bookings (id, booking_reference, farmer_id, crop_id, total_quantity, is_split, booking_date, status, token_number, qr_code_data, current_step)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'BK-2026-IND-8812', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 100.00, true, '2026-11-08', 'Quality Assessed', 'A-042', '{"token":"A-042","kisanId":"KS-MP-IND-01001"}', 6),
  ('b1000000-0000-0000-0000-000000000002', 'BK-2026-IND-7731', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 50.00, false, '2026-11-04', 'Payment Completed', 'B-108', '{"token":"B-108","kisanId":"KS-MP-IND-01001"}', 9),
  ('b1000000-0000-0000-0000-000000000003', 'BK-2026-IND-9045', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 40.00, false, '2026-11-12', 'Slot Booked', 'C-019', '{"token":"C-019","kisanId":"KS-MP-IND-01001"}', 2)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Split Allocations (Booking 1: 100 Qtl -> 40 + 35 + 25)
INSERT INTO booking_allocations (id, booking_id, centre_id, allocated_quantity, status, slot_time_window)
VALUES
  ('ba000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 40.00, 'Reserved', '09:00 AM - 12:00 PM'),
  ('ba000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 35.00, 'Reserved', '12:00 PM - 03:00 PM'),
  ('ba000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 25.00, 'Reserved', '03:00 PM - 06:00 PM'),
  ('ba000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 50.00, 'Completed', '10:00 AM - 01:00 PM')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Sample Payments (Simulated DBT)
INSERT INTO payments (id, booking_id, farmer_id, accepted_quantity, msp_rate, gross_amount, mandi_cess, net_amount, payment_status, transaction_ref, dbt_batch_id, bank_account_masked, ifsc_code, is_simulated)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 50.00, 4600.00, 230000.00, 0.00, 230000.00, 'Completed', 'DBT-2026-MP-984210', 'PFMS-BATCH-MP-2611-009', 'XXXX-XXXX-4821', 'SBIN0001234', true),
  ('p0000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 40.00, 2275.00, 91000.00, 0.00, 91000.00, 'Initiated', 'DBT-2026-MP-PENDING-042', 'PFMS-BATCH-MP-2611-014', 'XXXX-XXXX-4821', 'SBIN0001234', true)
ON CONFLICT (id) DO NOTHING;
