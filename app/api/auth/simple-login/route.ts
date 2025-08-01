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

    console.log('Simple login attempt for:', { email });

    // For now, we'll do a simple check - in production you'd want proper password hashing
    // Since we don't have password storage in the current schema, we'll just check if the user exists
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (dbError) {
      console.error('Error fetching user:', dbError);
      return NextResponse.json({ 
        error: 'Invalid email or password',
        details: 'User not found'
      }, { status: 401 });
    }

    if (!dbUser) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // For demo purposes, accept any password for existing users
    // In production, you'd verify the password hash
    console.log('User logged in successfully:', dbUser);

    // Create a simple session token
    const sessionData = {
      user_id: dbUser.id,
      email: dbUser.email,
      full_name: dbUser.full_name,
      phone: dbUser.phone,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return NextResponse.json({
      success: true,
      user: dbUser,
      session: sessionData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Simple login error:', error);
    return NextResponse.json({
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 