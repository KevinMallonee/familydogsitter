import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Insert into inquiries table
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          name,
          email,
          message: message || null,
        }
      ]);

    if (error) {
      console.error('Error inserting inquiry:', error);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Optional: Send email notification (placeholder)
    // In production, you would integrate with SendGrid, Mailgun, etc.
    console.log('New inquiry received:', { name, email, message });

    return NextResponse.json(
      { message: 'Inquiry submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 