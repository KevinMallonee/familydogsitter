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

    // Upload dog picture to Supabase storage if provided
    let dogPictureUrl = null;
    if (dogPicture) {
      const fileName = `${Date.now()}-${dogPicture.name}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('dogs')
        .upload(fileName, dogPicture);
      
      if (uploadError) {
        console.error('Error uploading dog picture:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload dog picture' },
          { status: 500 }
        );
      }
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('dogs')
        .getPublicUrl(fileName);
      
      dogPictureUrl = publicUrl;
    }

    // For now, combine all the new information into the message field
    // until the database is updated
    const enhancedMessage = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Start Date: ${startDate}
End Date: ${endDate}
Dog Picture: ${dogPictureUrl || 'None provided'}

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