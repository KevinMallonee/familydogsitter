import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        service:services(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error in bookings GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serviceId, startTime, endTime, notes, userId, totalAmount, guestInfo } = await request.json();

    console.log('Booking request:', { serviceId, startTime, endTime, totalAmount, guestInfo });

    if (!serviceId || !startTime || !endTime || !totalAmount || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for booking conflicts using proper date range overlap logic
    const { data: conflicts, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('service_id', serviceId)
      .neq('status', 'cancelled')
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError);
      return NextResponse.json(
        { error: 'Failed to check booking conflicts' },
        { status: 500 }
      );
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Booking slot is not available' },
        { status: 409 }
      );
    }

    // Create booking
    const bookingData = {
      user_id: userId,
      service_id: serviceId,
      start_time: startTime,
      end_time: endTime,
      notes: notes || null,
      status: 'pending',
      total_amount: totalAmount,
    };

    console.log('Creating booking with data:', bookingData);

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json(
        { error: 'Failed to create booking', details: error.message },
        { status: 500 }
      );
    }

    console.log('Booking created successfully:', booking);
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error in bookings POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 