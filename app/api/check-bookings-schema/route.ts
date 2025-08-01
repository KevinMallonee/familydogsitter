import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Checking bookings table schema...');

    // Try to get the table structure by attempting different column combinations
    const testCases = [
      { user_id: 'test', service_id: 1, start_time: '2025-01-15T10:00:00Z', end_time: '2025-01-15T18:00:00Z', notes: 'test', status: 'pending' },
      { user_id: 'test', service_id: 1, start_time: '2025-01-15T10:00:00Z', end_time: '2025-01-15T18:00:00Z', notes: 'test', status: 'pending', total_amount: 100 },
      { user_id: 'test', service_id: 1, start_time: '2025-01-15T10:00:00Z', end_time: '2025-01-15T18:00:00Z', notes: 'test', status: 'pending', amount: 100 },
      { user_id: 'test', service_id: 1, start_time: '2025-01-15T10:00:00Z', end_time: '2025-01-15T18:00:00Z', notes: 'test', status: 'pending', price: 100 },
    ];

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Testing case ${i + 1}:`, testCase);

      const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert([testCase])
        .select()
        .single();

      results.push({
        case: i + 1,
        data: testCase,
        result: { data, error },
      });
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error checking bookings schema:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 