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

    console.log('Booking request:', { serviceId, startTime, endTime, totalAmount, userId, guestInfo });

    if (!serviceId || !startTime || !endTime || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this is a guest booking (anonymous user)
    const isGuestBooking = userId.includes('anonymous') || userId.includes('guest') || !userId.includes('@');

    if (isGuestBooking) {
      // Use guest_bookings table for anonymous users
      if (!guestInfo || !guestInfo.name || !guestInfo.email) {
        return NextResponse.json(
          { error: 'Guest information is required for guest bookings' },
          { status: 400 }
        );
      }

      // Check for booking conflicts in guest_bookings
      const { data: existingGuestBookings, error: conflictError } = await supabaseAdmin
        .from('guest_bookings')
        .select('*')
        .eq('service_id', serviceId)
        .neq('status', 'cancelled');

      if (conflictError) {
        console.error('Error checking guest booking conflicts:', conflictError);
        return NextResponse.json(
          { error: 'Failed to check booking conflicts' },
          { status: 500 }
        );
      }

      // Check for overlaps manually
      const hasConflict = existingGuestBookings?.some(booking => {
        const existingStart = new Date(booking.start_time);
        const existingEnd = new Date(booking.end_time);
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        
        return (newStart < existingEnd && newEnd > existingStart);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Booking slot is not available' },
          { status: 409 }
        );
      }

      // Create guest booking
      const guestBookingData = {
        guest_name: guestInfo.name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone || null,
        service_id: serviceId,
        start_time: startTime,
        end_time: endTime,
        notes: notes || null,
        status: 'pending',
      };

      console.log('Creating guest booking with data:', guestBookingData);

      const { data: guestBooking, error } = await supabaseAdmin
        .from('guest_bookings')
        .insert([guestBookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating guest booking:', error);
        return NextResponse.json(
          { error: 'Failed to create guest booking', details: error.message },
          { status: 500 }
        );
      }

      console.log('Guest booking created successfully:', guestBooking);
      return NextResponse.json(guestBooking);

    } else {
      // Use regular bookings table for authenticated users
      // Check if user exists in users table
      const { data: existingUser, error: userCheckError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error('Error checking user:', userCheckError);
        return NextResponse.json(
          { error: 'Failed to check user' },
          { status: 500 }
        );
      }

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found. Please sign in to book services.' },
          { status: 401 }
        );
      }

      // Check for booking conflicts in regular bookings
      const { data: existingBookings, error: conflictError } = await supabaseAdmin
        .from('bookings')
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
        
        return (newStart < existingEnd && newEnd > existingStart);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Booking slot is not available' },
          { status: 409 }
        );
      }

      // Create regular booking
      const bookingData = {
        user_id: userId,
        service_id: serviceId,
        start_time: startTime,
        end_time: endTime,
        notes: notes || null,
        status: 'pending',
      };

      console.log('Creating regular booking with data:', bookingData);

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

      console.log('Regular booking created successfully:', booking);
      return NextResponse.json(booking);
    }
  } catch (error) {
    console.error('Error in bookings POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 