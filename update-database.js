const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDatabase() {
  try {
    console.log('Updating inquiries table...');

    // Add new columns
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS start_date TEXT;
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS end_date TEXT;
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS dog_picture_url TEXT;
      `
    });

    if (alterError) {
      console.error('Error adding columns:', alterError);
    } else {
      console.log('✅ Successfully added new columns to inquiries table');
    }

    // Update existing rows with default values
    const { error: updateError } = await supabase
      .from('inquiries')
      .update({ 
        phone: 'Not provided',
        start_date: 'Not specified',
        end_date: 'Not specified'
      })
      .is('phone', null);

    if (updateError) {
      console.error('Error updating existing rows:', updateError);
    } else {
      console.log('✅ Updated existing rows with default values');
    }

    // Verify the table structure
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'inquiries')
      .order('ordinal_position');

    if (verifyError) {
      console.error('Error verifying table structure:', verifyError);
    } else {
      console.log('✅ Current inquiries table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    console.log('\n🎉 Database update completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Create a storage bucket named "dog-pictures" in your Supabase dashboard');
    console.log('2. Set the bucket to public access');
    console.log('3. Test the contact form with the new fields');

  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

updateDatabase(); 