-- KRISHI SARATHI (कृषि सारथी)
-- Smart India Hackathon 2026 | PS: SIH26032 | Team: Off By One
-- Migration 001: Initial Database Schema for Supabase PostgreSQL

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'operator', 'admin', 'government')),
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: farmers
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    kisan_id VARCHAR(50) UNIQUE NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Madhya Pradesh',
    farmer_address TEXT NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL CHECK (land_area > 0),
    land_unit VARCHAR(20) DEFAULT 'Acres',
    preferred_language VARCHAR(20) DEFAULT 'Hindi' CHECK (preferred_language IN ('Hindi', 'English', 'Malvi', 'Nimadi')),
    bank_account_masked VARCHAR(50) DEFAULT 'XXXX-XXXX-4821',
    ifsc_code VARCHAR(20) DEFAULT 'SBIN0001234',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: crops
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL CHECK (season IN ('Rabi', 'Kharif', 'Zaid')),
    msp NUMERIC(10, 2) NOT NULL CHECK (msp > 0),
    unit VARCHAR(20) DEFAULT 'Quintal',
    procurement_window VARCHAR(100),
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: farmer_crops
CREATE TABLE IF NOT EXISTS farmer_crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    acreage NUMERIC(10, 2) NOT NULL CHECK (acreage > 0),
    estimated_yield NUMERIC(10, 2) NOT NULL CHECK (estimated_yield > 0),
    sowing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(farmer_id, crop_id)
);

-- Table 5: procurement_centres
CREATE TABLE IF NOT EXISTS procurement_centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    daily_capacity NUMERIC(10, 2) NOT NULL CHECK (daily_capacity > 0),
    available_quota NUMERIC(10, 2) NOT NULL CHECK (available_quota >= 0),
    current_queue INTEGER NOT NULL DEFAULT 0 CHECK (current_queue >= 0),
    operational_status VARCHAR(50) DEFAULT 'Open' CHECK (operational_status IN ('Open', 'High Load', 'Weather Alert', 'Maintenance', 'Closed')),
    contact_phone VARCHAR(20),
    operator_name VARCHAR(100),
    is_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 6: centre_crops
CREATE TABLE IF NOT EXISTS centre_crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    daily_crop_limit NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    current_allocated NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(centre_id, crop_id)
);

-- Table 7: centre_slots
CREATE TABLE IF NOT EXISTS centre_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_vehicles INTEGER NOT NULL DEFAULT 20,
    booked_vehicles INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(centre_id, slot_date, start_time, end_time)
);

-- Table 8: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id),
    total_quantity NUMERIC(10, 2) NOT NULL CHECK (total_quantity > 0),
    is_split BOOLEAN DEFAULT false,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Slot Booked' CHECK (status IN (
        'Slot Booked',
        'Farmer Arrived',
        'Weighing Completed',
        'Quality Assessed',
        'Crop Accepted',
        'Payment Initiated',
        'Payment Completed',
        'Cancelled'
    )),
    token_number VARCHAR(20) NOT NULL,
    qr_code_data TEXT NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 2, -- 1: Reg, 2: Booked, 3: QR, 4: Arrived, 5: Weighed, 6: Quality, 7: Accepted, 8: Pay Init, 9: Completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 9: booking_allocations (For split-selling across centres)
CREATE TABLE IF NOT EXISTS booking_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id UUID NOT NULL REFERENCES procurement_centres(id),
    slot_id UUID REFERENCES centre_slots(id),
    allocated_quantity NUMERIC(10, 2) NOT NULL CHECK (allocated_quantity > 0),
    status VARCHAR(50) DEFAULT 'Reserved' CHECK (status IN ('Reserved', 'Completed', 'Cancelled')),
    slot_time_window VARCHAR(50) DEFAULT '09:00 AM - 12:00 PM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 10: quota_ledger (Audit and atomic reservation lock)
CREATE TABLE IF NOT EXISTS quota_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID NOT NULL REFERENCES procurement_centres(id),
    booking_id UUID REFERENCES bookings(id),
    crop_id UUID REFERENCES crops(id),
    quantity_change NUMERIC(10, 2) NOT NULL,
    previous_quota NUMERIC(10, 2) NOT NULL,
    new_quota NUMERIC(10, 2) NOT NULL,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('RESERVATION', 'CANCELLATION', 'REALLOCATION', 'ADMIN_ADJUSTMENT')),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 11: procurement_events (Tracking 9 stages)
CREATE TABLE IF NOT EXISTS procurement_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id UUID REFERENCES procurement_centres(id),
    event_step INTEGER NOT NULL CHECK (event_step BETWEEN 1 AND 9),
    event_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    gross_weight NUMERIC(10, 2),
    tare_weight NUMERIC(10, 2),
    net_weight NUMERIC(10, 2),
    moisture_percentage NUMERIC(5, 2),
    quality_grade VARCHAR(20),
    operator_notes TEXT,
    operator_name VARCHAR(100) DEFAULT 'System Automated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 12: payments (Simulated Direct Bank Transfer DBT)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    accepted_quantity NUMERIC(10, 2) NOT NULL,
    msp_rate NUMERIC(10, 2) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    mandi_cess NUMERIC(10, 2) DEFAULT 0.00,
    net_amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Initiated' CHECK (payment_status IN ('Pending', 'Initiated', 'Completed', 'Failed')),
    transaction_ref VARCHAR(100) NOT NULL,
    dbt_batch_id VARCHAR(100) NOT NULL,
    bank_account_masked VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    is_simulated BOOLEAN DEFAULT true,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 13: weather_records (Open-Meteo cache & fallback)
CREATE TABLE IF NOT EXISTS weather_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    temperature NUMERIC(5, 2) NOT NULL,
    rain_probability NUMERIC(5, 2) NOT NULL,
    weather_code INTEGER NOT NULL,
    condition_text VARCHAR(100) NOT NULL,
    wind_speed NUMERIC(5, 2) NOT NULL,
    humidity NUMERIC(5, 2),
    alert_level VARCHAR(50) DEFAULT 'Normal' CHECK (alert_level IN ('Normal', 'Moderate Risk', 'Severe Alert')),
    alert_message TEXT,
    is_simulated BOOLEAN DEFAULT false,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 14: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES profiles(id),
    payload JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farmers_kisan_id ON farmers(kisan_id);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer_id ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_procurement_events_booking ON procurement_events(booking_id, event_step);
CREATE INDEX IF NOT EXISTS idx_booking_allocations_centre ON booking_allocations(centre_id);
CREATE INDEX IF NOT EXISTS idx_centre_slots_date ON centre_slots(centre_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_weather_centre ON weather_records(centre_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_farmer ON payments(farmer_id);
