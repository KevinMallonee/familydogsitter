-- Fix the booking system to allow guest bookings
-- This removes the foreign key constraint that prevents anonymous users from booking

-- Drop the foreign key constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_user_id;

-- Now bookings can be created with any user_id without requiring a record in the users table
-- This allows anonymous users to book services

-- Optional: Add a comment to explain the change
COMMENT ON TABLE bookings IS 'Bookings table - allows guest bookings without user records'; 