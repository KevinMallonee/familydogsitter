import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Try to get a single user to see what columns exist
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({
        error: 'Error fetching users',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    // Try to insert a minimal user to see what's required
    const testUser = {
      email: 'test-schema@example.com',
    };

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting test user:', insertError);
      return NextResponse.json({
        error: 'Error inserting test user',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        existingUsers: users,
        attemptedInsert: testUser
      }, { status: 500 });
    }

    // Clean up the test user
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', 'test-schema@example.com');

    return NextResponse.json({
      success: true,
      message: 'Schema test successful',
      existingUsers: users,
      insertedUser: insertedUser
    });

  } catch (error) {
    console.error('Schema test error:', error);
    return NextResponse.json({
      error: 'Schema test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 