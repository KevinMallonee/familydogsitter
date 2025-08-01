import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, isGuestBooking = false } = await request.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let booking;
    let user = null;

    if (isGuestBooking) {
      // Handle guest booking
      const { data: guestBooking, error: guestBookingError } = await supabaseAdmin
        .from('guest_bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (guestBookingError || !guestBooking) {
        return NextResponse.json(
          { error: 'Guest booking not found' },
          { status: 404 }
        );
      }

      booking = guestBooking;
      
      // Create a temporary user object for guest bookings
      user = {
        id: `guest-${bookingId}`,
        email: guestBooking.guest_email,
        name: guestBooking.guest_name,
        phone: guestBooking.guest_phone,
        stripe_customer_id: null
      };
    } else {
      // Handle regular booking
      const { data: regularBooking, error: bookingError } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          user:users(*)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !regularBooking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      booking = regularBooking;
      user = booking.user;
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    let customerId = user.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        phone: user.phone || undefined,
      });

      // Update user with Stripe customer ID (only for regular users)
      if (!isGuestBooking) {
        await supabaseAdmin
          .from('users')
          .update({ stripe_customer_id: customer.id })
          .eq('id', user.id);
      }

      customerId = customer.id;
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        bookingId,
        userId: user.id,
        serviceId: booking.service_id,
        isGuestBooking: isGuestBooking.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 