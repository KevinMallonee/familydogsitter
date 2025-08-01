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

    console.log('Creating user account:', { email, name, phone });

    // Create user in Supabase Auth - email will need to be confirmed
    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm - user must confirm email
      user_metadata: { 
        full_name: name,
        phone: phone || null
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ 
        error: 'Failed to create user account',
        details: authError.message,
        code: authError.status
      }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'No user created' 
      }, { status: 500 });
    }

    console.log('Auth user created successfully (pending email confirmation):', user.id);

    // Don't create the database record yet - wait for email confirmation
    // The user will be created in the database when they confirm their email

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to confirm your account before signing in.',
      user_id: user.id,
      email: user.email
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      error: 'Signup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 