-- Remove foreign key constraints to allow guest bookings

-- Drop foreign key constraints if they exist
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_auth_users;

-- Now bookings can be created with any user_id without requiring a record in the users table
-- This allows anonymous users to book services

-- Add comments to explain the changes
COMMENT ON TABLE bookings IS 'Bookings table - allows guest bookings without user records';
COMMENT ON TABLE users IS 'Users table - can contain both authenticated and guest users'; 