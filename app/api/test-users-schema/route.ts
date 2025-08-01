import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing users table schema...');

    // Test different column combinations to see what exists
    const testCases = [
      { id: 'test-user-1', email: 'test1@example.com' },
      { id: 'test-user-2', email: 'test2@example.com', password_hash: '$2b$10$example' },
      { id: 'test-user-3', email: 'test3@example.com', subscription_plan: 'free' },
      { id: 'test-user-4', email: 'test4@example.com', password_hash: '$2b$10$example', subscription_plan: 'free' },
    ];

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Testing case ${i + 1}:`, testCase);

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([testCase])
        .select()
        .single();

      results.push({
        case: i + 1,
        data: testCase,
        result: { data, error },
      });

      // Clean up after each test
      if (data) {
        await supabaseAdmin.from('users').delete().eq('id', testCase.id);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error testing users schema:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 