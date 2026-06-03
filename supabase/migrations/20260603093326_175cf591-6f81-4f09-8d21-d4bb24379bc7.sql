
CREATE TABLE public.field_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  role text NOT NULL,
  field_key text NOT NULL,
  can_edit boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (category, role, field_key)
);

GRANT SELECT ON public.field_permissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_permissions TO authenticated;
GRANT ALL ON public.field_permissions TO service_role;

ALTER TABLE public.field_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view field permissions"
  ON public.field_permissions FOR SELECT
  USING (true);

CREATE POLICY "Admins manage field permissions"
  ON public.field_permissions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_field_permissions_updated
  BEFORE UPDATE ON public.field_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed shop fields
INSERT INTO public.field_permissions (category, role, field_key, can_edit) VALUES
  -- admin / owner: full access
  ('shop','admin','name',true),('shop','admin','type',true),('shop','admin','priceLevel',true),
  ('shop','admin','description',true),('shop','admin','bio',true),('shop','admin','address',true),
  ('shop','admin','amenities',true),('shop','admin','opening_hours',true),
  ('shop','admin','banner',true),('shop','admin','avatar',true),
  ('shop','admin','phone',true),('shop','admin','whatsapp',true),('shop','admin','email',true),
  ('shop','admin','website',true),('shop','admin','instagram',true),('shop','admin','facebook',true),
  ('shop','admin','twitter',true),('shop','admin','affiliateLinks',true),

  ('shop','owner','name',true),('shop','owner','type',true),('shop','owner','priceLevel',true),
  ('shop','owner','description',true),('shop','owner','bio',true),('shop','owner','address',true),
  ('shop','owner','amenities',true),('shop','owner','opening_hours',true),
  ('shop','owner','banner',true),('shop','owner','avatar',true),
  ('shop','owner','phone',true),('shop','owner','whatsapp',true),('shop','owner','email',true),
  ('shop','owner','website',true),('shop','owner','instagram',true),('shop','owner','facebook',true),
  ('shop','owner','twitter',true),('shop','owner','affiliateLinks',true),

  -- regular user: basics only
  ('shop','user','name',true),('shop','user','type',true),('shop','user','priceLevel',true),
  ('shop','user','description',true),('shop','user','bio',true),('shop','user','address',true),
  ('shop','user','amenities',true),('shop','user','opening_hours',true),
  ('shop','user','banner',false),('shop','user','avatar',false),
  ('shop','user','phone',false),('shop','user','whatsapp',false),('shop','user','email',false),
  ('shop','user','website',false),('shop','user','instagram',false),('shop','user','facebook',false),
  ('shop','user','twitter',false),('shop','user','affiliateLinks',false);
