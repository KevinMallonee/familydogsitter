import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Checking users table structure...');

    // Try to get the table structure by attempting different column combinations
    const testCases = [
      { email: 'test1@example.com' },
      { email: 'test2@example.com', name: 'Test User' },
      { email: 'test3@example.com', phone: '555-123-4567' },
      { email: 'test4@example.com', name: 'Test User', phone: '555-123-4567' },
      { email: 'test5@example.com', full_name: 'Test User' },
      { email: 'test6@example.com', is_guest: false }
    ];

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testData = testCases[i];
      console.log(`Testing case ${i + 1}:`, testData);

      try {
        const { data, error } = await supabaseAdmin
          .from('users')
          .insert([testData])
          .select()
          .single();

        if (error) {
          results.push({
            case: i + 1,
            data: testData,
            error: {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            }
          });
        } else {
          results.push({
            case: i + 1,
            data: testData,
            success: true,
            insertedData: data
          });
          
          // Clean up the test data
          await supabaseAdmin
            .from('users')
            .delete()
            .eq('email', testData.email);
        }
      } catch (error) {
        results.push({
          case: i + 1,
          data: testData,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
            type: 'exception'
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Users table structure test completed'
    });

  } catch (error) {
    console.error('Error checking users structure:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 