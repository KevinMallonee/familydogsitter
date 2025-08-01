import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing anonymous authentication...');

    // Test creating an anonymous user using the client method
    const { data: { user: anonymousUser }, error: signInError } = await supabaseAdmin.auth.signInAnonymously();

    if (signInError) {
      console.error('Error creating anonymous user:', signInError);
      return NextResponse.json({
        success: false,
        error: signInError.message,
        message: 'Failed to create anonymous user'
      });
    }

    if (!anonymousUser) {
      return NextResponse.json({
        success: false,
        error: 'No user created',
        message: 'Anonymous user creation failed'
      });
    }

    console.log('Anonymous user created:', anonymousUser);

    // Test if we can get the user from auth
    const { data: authUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(anonymousUser.id);

    if (getUserError) {
      console.error('Error getting user:', getUserError);
      return NextResponse.json({
        success: false,
        error: getUserError.message,
        message: 'Failed to get user from auth'
      });
    }

    console.log('Auth user retrieved:', authUser);

    return NextResponse.json({
      success: true,
      anonymousUser,
      authUser,
      message: 'Anonymous authentication working'
    });
  } catch (error) {
    console.error('Error in test-anonymous:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 