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

    // For now, combine all the new information into the message field
    // until the database is updated
    const enhancedMessage = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Start Date: ${startDate}
End Date: ${endDate}
Dog Picture: ${dogPicture ? dogPicture.name : 'None provided'}

Message:
${message || 'No additional message provided'}
    `.trim();

    // Insert into inquiries table with all required fields
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          name,
          email,
          phone,
          start_date: startDate,
          end_date: endDate,
          message: enhancedMessage,
          dog_picture_url: dogPicture ? dogPicture.name : null,
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
      dogPicture: dogPicture ? dogPicture.name : 'None'
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