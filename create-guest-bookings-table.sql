-- Create guest_bookings table for guest users
CREATE TABLE IF NOT EXISTS guest_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    service_id INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guest_bookings_service_id ON guest_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_guest_bookings_status ON guest_bookings(status);
CREATE INDEX IF NOT EXISTS idx_guest_bookings_dates ON guest_bookings(start_time, end_time);

-- Add comment for documentation
COMMENT ON TABLE guest_bookings IS 'Guest bookings - allows anonymous users to book without user accounts'; 