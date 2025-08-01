-- Remove foreign key constraints to enable guest bookings

-- Drop the foreign key constraint on bookings table
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_user_id;

-- Drop the foreign key constraint on users table  
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_auth_users;

-- Verify the constraints are removed
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name IN ('bookings', 'users') 
    AND tc.constraint_type = 'FOREIGN KEY'; 