# Deployment Guide - Fixing Production Issues

## Current Issue
The site at https://www.yourfamilydogsitter.com/ is showing a blank page with a client-side error. This is likely due to missing environment variables or dependencies.

## Quick Fixes

### 1. Environment Variables
Make sure these environment variables are set in your production environment (Vercel, Netlify, etc.):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### 2. Dependencies
Ensure all dependencies are installed:

```bash
npm install
```

### 3. Build Issues
The main issue was in the bookings API route. The fix has been applied:

```typescript
// Fixed query syntax
.or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
```

### 4. Missing Pages
Added missing pages that were referenced in navigation:
- `/services` - Services page
- `/profile` - User profile page  
- `/book/confirmation` - Booking confirmation page

### 5. Error Handling
Added error boundaries and graceful fallbacks for missing environment variables.

## Deployment Steps

### For Vercel:
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy

### For Netlify:
1. Connect your GitHub repository
2. Add environment variables in Netlify dashboard
3. Deploy

### For other platforms:
1. Set environment variables
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Deploy

## Testing Locally

1. Copy `env.example` to `.env.local`
2. Fill in your actual environment variables
3. Run: `npm run dev`
4. Test all pages and functionality

## Common Issues

### Blank Page
- Check browser console for errors
- Verify environment variables are set
- Ensure all dependencies are installed

### Build Failures
- Check TypeScript errors
- Verify all imports are correct
- Ensure all referenced pages exist

### API Errors
- Verify Supabase configuration
- Check Stripe API keys
- Ensure database tables exist

## Support

If issues persist:
- Check browser console for specific error messages
- Verify all environment variables are correctly set
- Test locally first before deploying
- Contact: info@yourfamilydogsitter.com 