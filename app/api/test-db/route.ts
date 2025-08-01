import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test if we can connect to the database
    const { data: services, error: servicesError } = await supabaseAdmin
      .from('services')
      .select('*')
      .limit(1);

    if (servicesError) {
      console.error('Services table error:', servicesError);
      return NextResponse.json({
        error: 'Database connection issue',
        details: servicesError.message
      }, { status: 500 });
    }

    // Test users table structure
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('Users table error:', usersError);
      return NextResponse.json({
        error: 'Users table issue',
        details: usersError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      servicesCount: services?.length || 0,
      usersCount: users?.length || 0,
      message: 'Database connection successful'
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 