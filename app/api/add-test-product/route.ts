import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Adding test product to services table...');

    const testProduct = {
      name: 'Test Product',
      description: 'A test product for $1',
      price: 1.00
    };

    console.log('Test product data:', testProduct);

    const { data: service, error } = await supabaseAdmin
      .from('services')
      .insert([testProduct])
      .select()
      .single();

    if (error) {
      console.error('Error adding test product:', error);
      return NextResponse.json({ 
        error: 'Failed to add test product',
        details: error.message 
      }, { status: 500 });
    }

    console.log('Test product added successfully:', service);

    return NextResponse.json({
      success: true,
      service,
      message: 'Test product added successfully'
    });

  } catch (error) {
    console.error('Error adding test product:', error);
    return NextResponse.json({
      error: 'Failed to add test product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 