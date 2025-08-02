-- Add new columns to the inquiries table
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS dog_picture_url TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inquiries' 
ORDER BY ordinal_position; 