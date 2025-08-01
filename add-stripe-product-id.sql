-- Add stripe_product_id column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

-- Update existing services with their Stripe product IDs
-- You'll need to get these from your Stripe dashboard
UPDATE services SET stripe_product_id = 'prod_Sn1Z8SCciLOags' WHERE name = 'Test Product';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_services_stripe_product_id ON services(stripe_product_id); 