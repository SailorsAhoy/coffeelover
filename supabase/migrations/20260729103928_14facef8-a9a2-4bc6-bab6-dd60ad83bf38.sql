-- ============ PROFILES ============
DROP POLICY IF EXISTS "Authenticated can view profiles" ON public.profiles;

CREATE POLICY "Users and admins can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.profiles_public AS
  SELECT id, name, avatar_url, created_at FROM public.profiles;
REVOKE ALL ON public.profiles_public FROM anon;
GRANT SELECT ON public.profiles_public TO authenticated;

CREATE OR REPLACE FUNCTION public.lookup_profile(_q text)
RETURNS TABLE(id uuid, name text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  RETURN QUERY
    SELECT p.id, p.name FROM public.profiles p
    WHERE (_q ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND p.id = _q::uuid)
       OR (lower(p.email) = lower(trim(_q)))
    LIMIT 1;
END;
$$;
REVOKE ALL ON FUNCTION public.lookup_profile(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.lookup_profile(text) TO authenticated;

-- ============ COFFEE SHOP PROFILES ============
DROP POLICY IF EXISTS "Authenticated can view coffee shop profiles" ON public.coffee_shop_profiles;
CREATE POLICY "Owners and admins view coffee shop profiles"
ON public.coffee_shop_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.coffee_shop_profiles_public AS
  SELECT id, user_id, business_name, description, logo_url, website_url, address_id,
         has_bakery, has_wifi, has_outdoor_seating, opening_hours, shop_type_id,
         facebook_url, instagram_url, twitter_url, created_at, updated_at
  FROM public.coffee_shop_profiles;
GRANT SELECT ON public.coffee_shop_profiles_public TO authenticated, anon;

-- ============ ROASTER PROFILES ============
DROP POLICY IF EXISTS "Authenticated can view roaster profiles" ON public.roaster_profiles;
CREATE POLICY "Owners and admins view roaster profiles"
ON public.roaster_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.roaster_profiles_public AS
  SELECT id, user_id, business_name, description, logo_url, website_url,
         offers_free_shipping, has_discount_coupons, shop_type_id,
         facebook_url, instagram_url, twitter_url, created_at, updated_at
  FROM public.roaster_profiles;
GRANT SELECT ON public.roaster_profiles_public TO authenticated, anon;

-- ============ PRODUCER PROFILES ============
DROP POLICY IF EXISTS "Anyone can view producer profiles" ON public.producer_profiles;
CREATE POLICY "Owners and admins view producer profiles"
ON public.producer_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.producer_profiles_public AS
  SELECT id, user_id, business_name, description, farm_size_hectares, certifications,
         logo_url, website_url, created_at, updated_at
  FROM public.producer_profiles;
GRANT SELECT ON public.producer_profiles_public TO authenticated, anon;

-- ============ MANUFACTURERS ============
DROP POLICY IF EXISTS "Authenticated view manufacturers" ON public.manufacturers;
CREATE POLICY "Owners and admins view manufacturers"
ON public.manufacturers FOR SELECT
TO authenticated
USING (auth.uid() = owner_user_id OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.manufacturers_public AS
  SELECT id, business_name, slug, description, logo_url, website_url, country,
         owner_user_id, created_at, updated_at
  FROM public.manufacturers;
GRANT SELECT ON public.manufacturers_public TO authenticated, anon;

-- ============ SERVICE COMPANIES ============
DROP POLICY IF EXISTS "Authenticated view service_companies" ON public.service_companies;
CREATE POLICY "Owners and admins view service_companies"
ON public.service_companies FOR SELECT
TO authenticated
USING (auth.uid() = owner_user_id OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.service_companies_public AS
  SELECT id, business_name, slug, category, description, logo_url, website_url, country,
         owner_user_id, created_at, updated_at
  FROM public.service_companies;
GRANT SELECT ON public.service_companies_public TO authenticated, anon;

-- ============ INSTRUCTORS ============
DROP POLICY IF EXISTS "Authenticated view instructors" ON public.instructors;
CREATE POLICY "Admins view instructors"
ON public.instructors FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.instructors_public AS
  SELECT id, name, slug, bio, photo_url, academy_id, created_at, updated_at
  FROM public.instructors;
GRANT SELECT ON public.instructors_public TO authenticated, anon;