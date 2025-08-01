# YourFamilyDogSitter.com - Next.js 14 Dog Sitting Booking System

A modern, full-stack dog sitting booking application built with Next.js 14, Supabase, and Stripe. Features a beautiful, responsive design with real-time booking capabilities and secure payment processing.

## 🚀 Features

- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **Real-time Booking**: FullCalendar integration for booking management
- **Secure Payments**: Stripe integration for payment processing
- **User Authentication**: Supabase Auth with email/password and Google OAuth
- **Database**: PostgreSQL with Supabase for data management
- **TypeScript**: Full type safety throughout the application
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Calendar**: FullCalendar
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd your-family-dog-sitter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Optional: Email Service (for contact form)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=info@yourfamilydogsitter.com
```

### 4. Supabase Database Setup

#### Create Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  service_id UUID REFERENCES services(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Allow public to view services" ON services
  FOR SELECT TO anon, authenticated USING (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow system to create payments" ON payments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow system to update payments" ON payments
  FOR UPDATE TO authenticated USING (true);

-- Inquiries policies
CREATE POLICY "Allow public to insert inquiries" ON inquiries
  FOR INSERT TO anon WITH CHECK (true);
```

#### Insert Sample Data

```sql
-- Insert sample services
INSERT INTO services (name, description, price, duration_hours) VALUES
('Daily Pet Sitting', 'In-home pet sitting visits with daily feeding, exercise, and care', 35.00, 24),
('Overnight Boarding', 'Full overnight care with 24/7 supervision in a comfortable home environment', 40.00, 24);
```

### 5. Stripe Setup

1. Create a Stripe account and get your API keys
2. Set up webhook endpoints in your Stripe dashboard:
   - URL: `https://yourdomain.com/api/stripe-webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copy the webhook secret to your environment variables

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── book/              # Booking pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── NavBar.tsx         # Navigation component
│   ├── Hero.tsx           # Hero section
│   ├── Services.tsx       # Services section
│   ├── About.tsx          # About section
│   ├── Pricing.tsx        # Pricing section
│   ├── Reviews.tsx        # Reviews section
│   ├── ServiceAreas.tsx   # Service areas
│   ├── ContactForm.tsx    # Contact form
│   ├── Footer.tsx         # Footer component
│   ├── BookingCalendar.tsx # FullCalendar component
│   ├── BookingForm.tsx    # Booking form
│   └── PaymentForm.tsx    # Stripe payment form
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe client
│   ├── utils.ts           # Utility functions
│   └── database.types.ts  # Database types
├── types.ts               # TypeScript interfaces
└── package.json           # Dependencies
```

## 🔧 Configuration

### Environment Variables

All required environment variables are listed in `.env.local.example`. Make sure to:

1. Set up your Supabase project and get the API keys
2. Configure Stripe with your publishable and secret keys
3. Set up webhook endpoints in Stripe dashboard
4. Optionally configure email service for contact form notifications

### Customization

- **Colors**: Update the Tailwind config in `tailwind.config.ts`
- **Content**: Modify the components in the `components/` directory
- **Services**: Update the services in the Supabase database
- **Styling**: Customize the design in `app/globals.css`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Stripe Test Cards

Use these test cards for payment testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Manual Testing

1. **Homepage**: Verify all sections load correctly
2. **Authentication**: Test sign up/login flow
3. **Booking**: Create a test booking
4. **Payment**: Test payment flow with test cards
5. **Contact Form**: Submit a test inquiry

## 🔒 Security

- All API keys are stored in environment variables
- Row Level Security (RLS) enabled on all database tables
- Authentication required for booking and profile pages
- Stripe webhook signature verification
- Input validation on all forms

## 📞 Support

For support or questions:

- Email: info@yourfamilydogsitter.com
- Phone: (916) 805-1250

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for dog lovers everywhere** 