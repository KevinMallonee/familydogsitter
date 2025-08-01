import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Updating services with Stripe product IDs...');

    // Update Daily Pet Sitting
    const { data: dailyPetSitting, error: error1 } = await supabaseAdmin
      .from('services')
      .update({ stripe_product_id: 'prod_Smx2B7BpJ8etry' })
      .eq('name', 'Daily Pet Sitting')
      .select()
      .single();

    if (error1) {
      console.error('Error updating Daily Pet Sitting:', error1);
    } else {
      console.log('Updated Daily Pet Sitting:', dailyPetSitting);
    }

    // Update Overnight Boarding
    const { data: overnightBoarding, error: error2 } = await supabaseAdmin
      .from('services')
      .update({ stripe_product_id: 'prod_Smx3Oj5L14nIRr' })
      .eq('name', 'Overnight Boarding')
      .select()
      .single();

    if (error2) {
      console.error('Error updating Overnight Boarding:', error2);
    } else {
      console.log('Updated Overnight Boarding:', overnightBoarding);
    }

    // Update Test Product
    const { data: testProduct, error: error3 } = await supabaseAdmin
      .from('services')
      .update({ stripe_product_id: 'prod_Sn1Z8SCciLOags' })
      .eq('name', 'Test Product')
      .select()
      .single();

    if (error3) {
      console.error('Error updating Test Product:', error3);
    } else {
      console.log('Updated Test Product:', testProduct);
    }

    // Get all services to verify
    const { data: allServices, error: fetchError } = await supabaseAdmin
      .from('services')
      .select('id, name, price, stripe_product_id')
      .order('id');

    if (fetchError) {
      console.error('Error fetching services:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch services',
        details: fetchError.message 
      }, { status: 500 });
    }

    console.log('All services updated successfully:', allServices);

    return NextResponse.json({
      success: true,
      services: allServices,
      message: 'Services updated with Stripe product IDs'
    });

  } catch (error) {
    console.error('Error updating services:', error);
    return NextResponse.json({
      error: 'Failed to update services',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 