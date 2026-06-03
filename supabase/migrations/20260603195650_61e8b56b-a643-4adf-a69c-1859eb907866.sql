
ALTER TABLE public.coffee_brands DROP CONSTRAINT IF EXISTS coffee_brands_roaster_id_fkey;
ALTER TABLE public.coffee_brands
  ADD CONSTRAINT coffee_brands_roaster_id_fkey
  FOREIGN KEY (roaster_id) REFERENCES public.roasters(id) ON DELETE CASCADE;
