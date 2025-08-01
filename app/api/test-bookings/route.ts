import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing bookings table...');

    // Test 1: Check if bookings table exists and get its structure
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .limit(1);

    console.log('Bookings table test:', { bookings, error: bookingsError });

    // Test 2: Check services table
    const { data: services, error: servicesError } = await supabaseAdmin
      .from('services')
      .select('*');

    console.log('Services table test:', { services, error: servicesError });

    // Test 3: Try to insert a test booking with proper UUID
    const testBooking = {
      user_id: 'a942cf1c-0712-4643-b4a7-d736f20458fe', // Use existing user ID
      service_id: services?.[0]?.id || 1,
      start_time: '2025-01-15T10:00:00Z',
      end_time: '2025-01-15T18:00:00Z',
      notes: 'Test booking',
      status: 'pending',
    };

    console.log('Attempting to insert test booking:', testBooking);

    const { data: insertedBooking, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert([testBooking])
      .select()
      .single();

    console.log('Insert test result:', { insertedBooking, error: insertError });

    return NextResponse.json({
      success: true,
      bookingsTable: { data: bookings, error: bookingsError },
      servicesTable: { data: services, error: servicesError },
      insertTest: { data: insertedBooking, error: insertError },
    });
  } catch (error) {
    console.error('Error testing bookings:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 