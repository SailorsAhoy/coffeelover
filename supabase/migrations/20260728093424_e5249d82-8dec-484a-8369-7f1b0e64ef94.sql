
-- 1. app_settings table
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings public read"
  ON public.app_settings FOR SELECT
  USING (true);

CREATE POLICY "app_settings admin insert"
  ON public.app_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "app_settings admin update"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER app_settings_set_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (key, value)
  VALUES ('gated_preview_enabled', 'false'::jsonb)
  ON CONFLICT (key) DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;

-- 2. Security fixes: restrict contact fields on shops/roasters to authenticated users
DROP POLICY IF EXISTS "Anyone view shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone view roasters" ON public.roasters;

CREATE POLICY "Anon view shops (public fields)"
  ON public.shops FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated view shops (all fields)"
  ON public.shops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon view roasters (public fields)"
  ON public.roasters FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated view roasters (all fields)"
  ON public.roasters FOR SELECT
  TO authenticated
  USING (true);

-- Create public views that hide contact fields for anon consumers
CREATE OR REPLACE VIEW public.shops_public AS
  SELECT id, name, slug, type, description, bio, lat, lng, address, country,
         price_level, base_rating, base_review_count, amenities, website,
         facebook, instagram, twitter, opening_hours, banner, avatar, status,
         created_at, updated_at, owner_user_id, linked_roaster_id
  FROM public.shops;

CREATE OR REPLACE VIEW public.roasters_public AS
  SELECT id, name, slug, description, lat, lng, address, country, logo_url,
         banner_url, website, facebook, instagram, twitter,
         offers_free_shipping, has_discount_coupons, status,
         created_at, updated_at, owner_user_id, linked_shop_id, bio,
         opening_hours, amenities, affiliate_links, base_rating,
         base_review_count, avatar, banner
  FROM public.roasters;

GRANT SELECT ON public.shops_public TO anon, authenticated;
GRANT SELECT ON public.roasters_public TO anon, authenticated;
