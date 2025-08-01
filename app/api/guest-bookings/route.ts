import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { serviceId, startTime, endTime, notes, guestName, guestEmail, guestPhone } = await request.json();

    console.log('Guest booking request:', { serviceId, startTime, endTime, guestName, guestEmail, guestPhone });

    if (!serviceId || !startTime || !endTime || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for booking conflicts - get all non-cancelled bookings for this service
    const { data: existingBookings, error: conflictError } = await supabaseAdmin
      .from('guest_bookings')
      .select('*')
      .eq('service_id', serviceId)
      .neq('status', 'cancelled');

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError);
      return NextResponse.json(
        { error: 'Failed to check booking conflicts' },
        { status: 500 }
      );
    }

    // Check for overlaps manually
    const hasConflict = existingBookings?.some(booking => {
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);
      const newStart = new Date(startTime);
      const newEnd = new Date(endTime);
      
      // Check if the new booking overlaps with existing booking
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Booking slot is not available' },
        { status: 409 }
      );
    }

    // Create guest booking
    const bookingData = {
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || null,
      service_id: serviceId,
      start_time: startTime,
      end_time: endTime,
      notes: notes || null,
      status: 'pending',
    };

    console.log('Creating guest booking with data:', bookingData);

    const { data: booking, error } = await supabaseAdmin
      .from('guest_bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating guest booking:', error);
      return NextResponse.json(
        { error: 'Failed to create booking', details: error.message },
        { status: 500 }
      );
    }

    console.log('Guest booking created successfully:', booking);
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error in guest bookings POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 