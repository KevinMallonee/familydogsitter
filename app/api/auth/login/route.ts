import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    console.log('Logging in user:', { email });

    // Sign in user with Supabase Auth
    const { data: { user, session }, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Error signing in user:', authError);
      return NextResponse.json({ 
        error: 'Invalid email or password',
        details: authError.message 
      }, { status: 401 });
    }

    if (!user || !session) {
      return NextResponse.json({ 
        error: 'Login failed' 
      }, { status: 500 });
    }

    // Get user data from our users table
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error('Error fetching user data:', dbError);
      return NextResponse.json({ 
        error: 'Failed to fetch user data',
        details: dbError.message 
      }, { status: 500 });
    }

    console.log('User logged in successfully:', dbUser);

    return NextResponse.json({
      success: true,
      user: dbUser,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 