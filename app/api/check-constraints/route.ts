import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Checking foreign key constraints...');

    // Query to check foreign key constraints on bookings table
    const { data: constraints, error } = await supabaseAdmin.rpc('get_foreign_keys', {
      table_name: 'bookings'
    });

    if (error) {
      console.error('Error checking constraints:', error);
      
      // Try a different approach - check if we can insert a booking
      const testBooking = {
        user_id: 'test-user-id',
        service_id: 1,
        start_time: '2025-01-15T10:00:00Z',
        end_time: '2025-01-15T18:00:00Z',
        notes: 'Test constraint check',
        status: 'pending',
      };

      const { data: insertTest, error: insertError } = await supabaseAdmin
        .from('bookings')
        .insert([testBooking])
        .select()
        .single();

      return NextResponse.json({
        success: true,
        constraints: null,
        insertTest: { data: insertTest, error: insertError },
        message: 'Checked via insert test'
      });
    }

    return NextResponse.json({
      success: true,
      constraints,
      message: 'Foreign key constraints found'
    });
  } catch (error) {
    console.error('Error in check-constraints:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 