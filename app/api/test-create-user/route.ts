import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone } = await request.json();

    console.log('Testing direct user creation:', { email, name, phone });

    // Generate a UUID for the user
    const userId = crypto.randomUUID();

    const userData = {
      id: userId,
      email: email,
      full_name: name,
      phone: phone || null
    };

    console.log('User data to insert:', userData);

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
        code: dbError.code,
        data: userData
      }, { status: 500 });
    }

    console.log('User created successfully:', dbUser);

    return NextResponse.json({
      success: true,
      user: dbUser,
      message: 'User created successfully in database'
    });

  } catch (error) {
    console.error('Test create user error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 