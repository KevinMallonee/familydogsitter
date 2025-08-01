-- Fix the users table to have auto-generating UUIDs
-- Run this in your Supabase SQL editor

-- First, let's see what the current users table structure looks like
-- Then we'll fix it to have proper auto-generating UUIDs

-- Option 1: If you want to keep existing data, alter the table
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Option 2: If you want to recreate the table (this will delete existing data)
-- DROP TABLE IF EXISTS users CASCADE;
-- CREATE TABLE users (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   email TEXT UNIQUE NOT NULL,
--   full_name TEXT,
--   phone TEXT,
--   stripe_customer_id TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Test the fix by inserting a user
INSERT INTO users (email, full_name, phone) VALUES 
('test@example.com', 'Test User', '555-123-4567')
ON CONFLICT (email) DO NOTHING;

-- Verify the user was created with auto-generated UUID
SELECT * FROM users WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM users WHERE email = 'test@example.com'; 