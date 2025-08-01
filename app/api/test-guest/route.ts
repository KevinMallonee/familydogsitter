import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json();

    console.log('Testing guest user creation with:', { name, email, phone });

    const guestUserData = {
      email: email,
      full_name: name,
      phone: phone || null,
    };

    console.log('Guest user data to insert:', guestUserData);

    const { data: guestUser, error: guestError } = await supabaseAdmin
      .from('users')
      .insert([guestUserData])
      .select()
      .single();

    if (guestError) {
      console.error('Error creating guest user:', guestError);
      console.error('Guest user data that failed:', guestUserData);
      return NextResponse.json({
        error: 'Failed to create guest user',
        details: guestError.message,
        code: guestError.code,
        hint: guestError.hint,
        data: guestUserData
      }, { status: 500 });
    }

    console.log('Guest user created successfully:', guestUser);
    return NextResponse.json({
      success: true,
      user: guestUser,
      message: 'Guest user created successfully'
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 