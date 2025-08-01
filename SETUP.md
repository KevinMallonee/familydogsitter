# Setup Guide - Fixing Guest Booking Issues

## Current Issue
The "Failed to create guest user" error occurs when trying to book as a guest. This is likely due to missing environment variables or database configuration.

## Quick Fix Steps

### 1. Environment Variables Setup

Create a `.env.local` file in the root directory with your actual Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Stripe Configuration (optional for testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### 2. Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create users table with proper structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample services
INSERT INTO services (name, description, price, duration_hours) VALUES
('Overnight Boarding', 'Full overnight care with 24/7 supervision', 40.00, 24),
('Daily Pet Sitting', 'Daily visits for feeding, walking, and care', 35.00, 8)
ON CONFLICT DO NOTHING;
```

### 3. Test Database Connection

Visit `http://localhost:3000/api/test-db` to test if your database connection is working.

### 4. Common Issues & Solutions

#### Issue: "Failed to create guest user"
**Solution**: Check that:
- Environment variables are set correctly
- Database tables exist with proper structure
- Supabase service role key has proper permissions

#### Issue: "Database connection issue"
**Solution**: 
- Verify your Supabase URL and keys
- Check that your Supabase project is active
- Ensure the service role key has admin permissions

#### Issue: "Users table issue"
**Solution**:
- Run the SQL commands above to create the tables
- Check that the `users` table has the correct structure
- Verify that `is_guest` and `phone` columns exist

### 5. Testing the Guest Booking

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/book`
3. Fill in guest information (name, email, phone)
4. Select a service and dates
5. Click "Continue to Payment"

### 6. Debug Information

The updated API now provides detailed error messages. Check the browser console and server logs for:
- Database connection status
- Guest user creation details
- Booking creation process
- Any specific error codes or hints

### 7. Environment Variables Checklist

Make sure these are set in your `.env.local`:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### 8. Database Tables Checklist

Verify these tables exist in your Supabase database:

- ✅ `users` table with columns: `id`, `email`, `name`, `phone`, `is_guest`, `created_at`, `updated_at`
- ✅ `services` table with columns: `id`, `name`, `description`, `price`, `duration_hours`
- ✅ `bookings` table with columns: `id`, `user_id`, `service_id`, `start_time`, `end_time`, `notes`, `status`, `total_amount`

## Support

If issues persist:
1. Check the browser console for error details
2. Visit `/api/test-db` to test database connection
3. Verify all environment variables are set correctly
4. Ensure database tables are created with proper structure 