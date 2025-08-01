-- Add stripe_product_id column to services table if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

-- Update all services with their Stripe product IDs
UPDATE services SET stripe_product_id = 'prod_Smx2B7BpJ8etry' WHERE name = 'Daily Pet Sitting';
UPDATE services SET stripe_product_id = 'prod_Smx3Oj5L14nIRr' WHERE name = 'Overnight Boarding';
UPDATE services SET stripe_product_id = 'prod_Sn1Z8SCciLOags' WHERE name = 'Test Product';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_services_stripe_product_id ON services(stripe_product_id);

-- Verify the updates
SELECT id, name, price, stripe_product_id FROM services ORDER BY id; 