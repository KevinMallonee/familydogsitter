-- Add new columns to the inquiries table
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS dog_picture_url TEXT;

-- Make the new fields required (NOT NULL) after adding them
-- Note: This will only work if the table is empty or all existing rows have values
-- If you have existing data, you'll need to update it first

-- Update existing rows to have default values if needed
UPDATE inquiries SET phone = 'Not provided' WHERE phone IS NULL;
UPDATE inquiries SET start_date = 'Not specified' WHERE start_date IS NULL;
UPDATE inquiries SET end_date = 'Not specified' WHERE end_date IS NULL;

-- Now make the fields NOT NULL (optional - only if you want them required)
-- ALTER TABLE inquiries ALTER COLUMN phone SET NOT NULL;
-- ALTER TABLE inquiries ALTER COLUMN start_date SET NOT NULL;
-- ALTER TABLE inquiries ALTER COLUMN end_date SET NOT NULL;

-- Create a storage bucket for dog pictures (run this in Supabase dashboard or via API)
-- The bucket should be named 'dog-pictures' with public access

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inquiries' 
ORDER BY ordinal_position; 