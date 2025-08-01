import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Try to get table information
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Error accessing users table',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    // Try to insert a test user to see what columns are available
    const testUser = {
      email: 'test-check@example.com',
    };

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        error: 'Error inserting test user',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        existingData: data
      }, { status: 500 });
    }

    // Clean up
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', 'test-check@example.com');

    return NextResponse.json({
      success: true,
      message: 'Table structure check successful',
      existingData: data,
      insertedUser: insertedUser,
      tableStructure: 'Users table is accessible and can insert data'
    });

  } catch (error) {
    console.error('Table check error:', error);
    return NextResponse.json({
      error: 'Table check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 