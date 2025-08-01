import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeConfig } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    switch (event.type) {
      case 'payment_intent.created':
        console.log('Payment intent created:', paymentIntent.id);
        // Payment intent was created but not yet confirmed
        break;

      case 'payment_intent.processing':
        console.log('Payment intent processing:', paymentIntent.id);
        // Payment is being processed (e.g., bank transfer)
        await supabaseAdmin
          .from('payments')
          .update({ status: 'pending' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        break;

      case 'payment_intent.requires_action':
        console.log('Payment intent requires action:', paymentIntent.id);
        // Payment requires additional authentication (3D Secure, etc.)
        await supabaseAdmin
          .from('payments')
          .update({ status: 'pending' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', paymentIntent.id);
        // Payment was successful
        await supabaseAdmin
          .from('payments')
          .update({ status: 'succeeded' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        // Also update booking status to confirmed
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', paymentIntent.metadata.bookingId);
        break;

      case 'payment_intent.partially_funded':
        console.log('Payment intent partially funded:', paymentIntent.id);
        // Payment was partially funded (e.g., partial bank transfer)
        await supabaseAdmin
          .from('payments')
          .update({ status: 'pending' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', paymentIntent.id);
        // Payment failed
        await supabaseAdmin
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        // Also update booking status to pending (allow retry)
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'pending' })
          .eq('id', paymentIntent.metadata.bookingId);
        break;

      case 'payment_intent.canceled':
        console.log('Payment intent canceled:', paymentIntent.id);
        // Payment was canceled
        await supabaseAdmin
          .from('payments')
          .update({ status: 'cancelled' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        // Also update booking status to cancelled
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', paymentIntent.metadata.bookingId);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 