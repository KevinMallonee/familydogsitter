import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const message = formData.get('message') as string;
    const dogPicture = formData.get('dogPicture') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, email, phone, and dates are required' },
        { status: 400 }
      );
    }

    let dogPictureUrl = null;

    // Handle dog picture upload if provided
    if (dogPicture) {
      try {
        // Convert file to buffer
        const bytes = await dogPicture.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const fileExt = dogPicture.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('dog-pictures')
          .upload(fileName, buffer, {
            contentType: dogPicture.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading dog picture:', uploadError);
          // Continue without the picture if upload fails
        } else {
          // Get public URL
          const { data: urlData } = supabaseAdmin.storage
            .from('dog-pictures')
            .getPublicUrl(fileName);
          
          dogPictureUrl = urlData.publicUrl;
        }
      } catch (error) {
        console.error('Error processing dog picture:', error);
        // Continue without the picture if processing fails
      }
    }

    // Insert into inquiries table
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          name,
          email,
          phone,
          start_date: startDate,
          end_date: endDate,
          message: message || null,
          dog_picture_url: dogPictureUrl,
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
    console.log('New inquiry received:', { 
      name, 
      email, 
      phone, 
      startDate, 
      endDate, 
      message,
      dogPictureUrl 
    });

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