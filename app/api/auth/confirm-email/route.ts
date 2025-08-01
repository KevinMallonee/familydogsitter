import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { user_id, email, full_name, phone } = await request.json();

    if (!user_id || !email || !full_name) {
      return NextResponse.json({ 
        error: 'User ID, email, and full name are required' 
      }, { status: 400 });
    }

    console.log('Creating user record after email confirmation:', { user_id, email, full_name, phone });

    // Create user record in our users table with the actual structure
    const userData = {
      id: user_id, // Use the auth user's ID to satisfy foreign key constraint
      email: email,
      full_name: full_name,
      phone: phone || null
    };

    console.log('Creating database user with data:', userData);

    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (dbError) {
      console.error('Error creating user record:', dbError);
      return NextResponse.json({ 
        error: 'Failed to create user record',
        details: dbError.message,
        code: dbError.code
      }, { status: 500 });
    }

    console.log('User record created successfully after email confirmation:', dbUser);

    return NextResponse.json({
      success: true,
      user: dbUser,
      message: 'User account activated successfully'
    });

  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json({
      error: 'Email confirmation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 