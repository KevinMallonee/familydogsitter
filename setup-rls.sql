-- RLS Policies for Family Dog Sitter Booking System
-- Run this in your Supabase SQL editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow system to create users (for anonymous sign-ins)
CREATE POLICY "Allow system to create users" ON users
  FOR INSERT WITH CHECK (true);

-- Services table policies
-- Allow public to view services (no authentication required)
CREATE POLICY "Allow public to view services" ON services
  FOR SELECT TO anon, authenticated USING (true);

-- Bookings table policies
-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Allow system to manage bookings (for admin operations)
CREATE POLICY "Allow system to manage bookings" ON bookings
  FOR ALL TO authenticated USING (true);

-- Payments table policies
-- Users can view payments for their own bookings
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Allow system to create and update payments
CREATE POLICY "Allow system to manage payments" ON payments
  FOR ALL TO authenticated USING (true);

-- Inquiries table policies
-- Allow public to insert inquiries (contact form)
CREATE POLICY "Allow public to insert inquiries" ON inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow system to view inquiries (for admin)
CREATE POLICY "Allow system to view inquiries" ON inquiries
  FOR SELECT TO authenticated USING (true);

-- Additional policies for anonymous users
-- Anonymous users can create bookings (they will have auth.uid())
CREATE POLICY "Anonymous users can create bookings" ON bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Anonymous users can view their own bookings
CREATE POLICY "Anonymous users can view own bookings" ON bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Anonymous users can update their own bookings
CREATE POLICY "Anonymous users can update own bookings" ON bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id); 