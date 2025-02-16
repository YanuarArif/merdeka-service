-- Add userId column to products table
ALTER TABLE "products" ADD COLUMN "user_id" TEXT;

-- Create foreign key constraint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

-- Set existing products to belong to the first user (you may want to adjust this)
UPDATE "products" SET "user_id" = (SELECT id FROM "users" LIMIT 1);

-- Make user_id required after setting default values
ALTER TABLE "products" ALTER COLUMN "user_id" SET NOT NULL;
