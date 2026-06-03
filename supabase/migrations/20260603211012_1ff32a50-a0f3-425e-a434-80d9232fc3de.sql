ALTER TABLE public.coffee_brands
  ADD COLUMN IF NOT EXISTS product_url text,
  ADD COLUMN IF NOT EXISTS variety text,
  ADD COLUMN IF NOT EXISTS process text,
  ADD COLUMN IF NOT EXISTS serviced_countries text[];