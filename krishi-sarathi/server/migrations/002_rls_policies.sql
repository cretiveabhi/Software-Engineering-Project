-- KRISHI SARATHI (कृषि सारथी)
-- Migration 002: Row Level Security (RLS) Policies for Supabase

-- Enable RLS on sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_records ENABLE ROW LEVEL SECURITY;

-- Crops: Anyone authenticated or anonymous can view available crops
CREATE POLICY "Public crops view" ON crops
    FOR SELECT USING (is_active = true);

-- Procurement Centres: Anyone can view operational centres
CREATE POLICY "Public centres view" ON procurement_centres
    FOR SELECT USING (true);

-- Weather: Anyone can view cached and live weather
CREATE POLICY "Public weather view" ON weather_records
    FOR SELECT USING (true);

-- Profiles: Users can view their own profile; operators/admins can view all
CREATE POLICY "Self profile access" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profile self update" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Farmers: Farmer can view and update their own farmer record
CREATE POLICY "Farmer self access" ON farmers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Farmer self update" ON farmers
    FOR UPDATE USING (auth.uid() = id);

-- Bookings: Farmer can view and insert their own bookings
CREATE POLICY "Farmer view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmer create booking" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Booking Allocations: Farmer can view their own allocations
CREATE POLICY "Farmer view own allocations" ON booking_allocations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_allocations.booking_id
            AND bookings.farmer_id = auth.uid()
        )
    );

-- Payments: Farmer can only view their own payments
CREATE POLICY "Farmer view own payments" ON payments
    FOR SELECT USING (auth.uid() = farmer_id);

-- Procurement Events: Farmer can view events for their bookings; operators can insert/update
CREATE POLICY "Farmer view booking events" ON procurement_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = procurement_events.booking_id
            AND bookings.farmer_id = auth.uid()
        )
    );
