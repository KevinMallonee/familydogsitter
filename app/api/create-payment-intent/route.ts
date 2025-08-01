import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { 
      bookingId, 
      amount, 
      isGuestBooking = false,
      guestInfo = null,
      serviceId = 1
    } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    console.log('Creating payment intent:', { bookingId, amount, isGuestBooking, guestInfo, serviceId });

    // Get service information including Stripe product ID
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    console.log('Service found:', service);

    // Create user data based on booking type
    let user = null;
    
    if (isGuestBooking && guestInfo) {
      // For guest bookings, use guest info
      user = {
        id: `guest-${Date.now()}`,
        email: guestInfo.email,
        name: guestInfo.name,
        phone: guestInfo.phone,
        stripe_customer_id: null
      };
    } else {
      // For regular bookings, try to get user from database
      if (bookingId) {
        const { data: booking, error } = await supabaseAdmin
          .from('bookings')
          .select(`
            *,
            user:users(*)
          `)
          .eq('id', bookingId)
          .single();

        if (!error && booking && booking.user) {
          user = booking.user;
        }
      }
    }

    // If no user found, create a temporary one
    if (!user) {
      user = {
        id: `temp-${Date.now()}`,
        email: 'guest@example.com',
        name: 'Guest User',
        phone: null,
        stripe_customer_id: null
      };
    }

    let customerId = user.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        phone: user.phone || undefined,
      });

      customerId = customer.id;
    }

    // Create PaymentIntent with product information
    const paymentIntentData: any = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        bookingId: bookingId || `temp-${Date.now()}`,
        userId: user.id,
        serviceId: serviceId,
        isGuestBooking: isGuestBooking.toString(),
        guestName: guestInfo?.name || '',
        guestEmail: guestInfo?.email || '',
        guestPhone: guestInfo?.phone || ''
      },
    };

    // Add product ID if available
    if (service.stripe_product_id) {
      paymentIntentData.metadata.productId = service.stripe_product_id;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    console.log('Payment intent created successfully:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 