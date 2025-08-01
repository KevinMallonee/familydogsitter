-- Check and remove foreign key constraints that prevent guest bookings

-- First, let's see what constraints exist
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('bookings', 'users') 
    AND tc.constraint_type = 'FOREIGN KEY';

-- Now remove the foreign key constraints
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_users_id_fkey;

ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_auth_users;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_auth_users_id_fkey;

-- Check again to confirm constraints are removed
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name IN ('bookings', 'users') 
    AND tc.constraint_type = 'FOREIGN KEY';

-- Test if we can insert a booking now
INSERT INTO bookings (user_id, service_id, start_time, end_time, notes, status)
VALUES (
    'a942cf1c-0712-4643-b4a7-d736f20458fe',
    1,
    '2025-01-15T10:00:00Z',
    '2025-01-15T18:00:00Z',
    'Test booking after constraint removal',
    'pending'
);

-- Clean up the test booking
DELETE FROM bookings WHERE notes = 'Test booking after constraint removal'; 