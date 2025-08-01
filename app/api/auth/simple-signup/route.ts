import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ 
        error: 'Email, password, and name are required' 
      }, { status: 400 });
    }

    console.log('Creating simple user account:', { email, name, phone });

    // Generate a UUID for the user
    const userId = crypto.randomUUID();

    // Create user record directly in our users table
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
        details: dbError.message 
      }, { status: 500 });
    }

    console.log('User created successfully:', dbUser);

    // Create a simple session token (in production, you'd want proper JWT)
    const sessionData = {
      user_id: userId,
      email: email,
      full_name: name,
      phone: phone,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return NextResponse.json({
      success: true,
      user: dbUser,
      session: sessionData,
      message: 'User account created successfully'
    });

  } catch (error) {
    console.error('Simple signup error:', error);
    return NextResponse.json({
      error: 'Signup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 