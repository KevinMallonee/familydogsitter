# Family Dog Sitter - Next.js Booking System

A modern dog sitting booking system built with Next.js 14, Supabase, and Stripe, featuring guest booking capabilities.

## Features

- **Guest Booking System**: Users can book services without creating an account
- **Real-time Calendar**: View available slots and existing bookings
- **Payment Integration**: Secure Stripe payment processing
- **Responsive Design**: Mobile-friendly interface
- **Contact Form**: Easy communication with the service provider

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Optional: Email Service (for contact form)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=info@yourfamilydogsitter.com
```

### 2. Database Setup

Create the following tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Services Table
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
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
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Inquiries Table
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Sample Data

Insert sample services:

```sql
INSERT INTO services (name, description, price, duration_hours) VALUES
('Overnight Boarding', 'Full overnight care with 24/7 supervision', 40.00, 24),
('Daily Pet Sitting', 'Daily visits for feeding, walking, and care', 35.00, 8);
```

### 4. Installation

```bash
npm install
npm run dev
```

## Guest Booking Flow

1. **No Authentication Required**: Users can access `/book` without logging in
2. **Contact Information**: Guest users provide name, email, and phone
3. **Service Selection**: Choose from available services
4. **Date/Time Selection**: Pick start and end times
5. **Payment**: Complete payment via Stripe
6. **Confirmation**: Receive booking confirmation

## API Routes

- `/api/bookings` - Create and retrieve bookings
- `/api/create-payment-intent` - Create Stripe payment intent
- `/api/stripe-webhook` - Handle Stripe webhooks
- `/api/contact` - Handle contact form submissions

## Components

- `BookingForm` - Service selection and guest information
- `BookingCalendar` - FullCalendar integration for viewing bookings
- `PaymentForm` - Stripe payment processing
- `NavBar` - Navigation with authentication state
- `ErrorBoundary` - Graceful error handling

## Deployment

### Vercel
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy

### Netlify
1. Connect your GitHub repository
2. Add environment variables in Netlify dashboard
3. Deploy

## Testing

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date, any 3-digit CVC

## Support

For issues or questions:
- Email: info@yourfamilydogsitter.com
- Phone: (916) 805-1250

## License

MIT License 