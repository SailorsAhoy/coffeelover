
-- profiles: authenticated-only SELECT
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- user_roles: only self + admins
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users view own role or admins view all"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.user_roles FROM anon;

-- coffee_shop_profiles: authenticated-only
DROP POLICY IF EXISTS "Anyone can view coffee shop profiles" ON public.coffee_shop_profiles;
CREATE POLICY "Authenticated can view coffee shop profiles"
  ON public.coffee_shop_profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.coffee_shop_profiles FROM anon;

-- roaster_profiles: authenticated-only
DROP POLICY IF EXISTS "Anyone can view roaster profiles" ON public.roaster_profiles;
CREATE POLICY "Authenticated can view roaster profiles"
  ON public.roaster_profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.roaster_profiles FROM anon;

-- instructors: authenticated-only
DROP POLICY IF EXISTS "Anyone view instructors" ON public.instructors;
CREATE POLICY "Authenticated view instructors"
  ON public.instructors FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.instructors FROM anon;

-- manufacturers: authenticated-only
DROP POLICY IF EXISTS "Anyone view manufacturers" ON public.manufacturers;
CREATE POLICY "Authenticated view manufacturers"
  ON public.manufacturers FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.manufacturers FROM anon;

-- service_companies: authenticated-only
DROP POLICY IF EXISTS "Anyone view service_companies" ON public.service_companies;
CREATE POLICY "Authenticated view service_companies"
  ON public.service_companies FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.service_companies FROM anon;

-- field_permissions: admin-only SELECT
DROP POLICY IF EXISTS "Anyone can view field permissions" ON public.field_permissions;
CREATE POLICY "Admins view field permissions"
  ON public.field_permissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.field_permissions FROM anon;

-- user_coffee_products: approved-products read requires auth
DROP POLICY IF EXISTS "Roasters can view approved products" ON public.user_coffee_products;
CREATE POLICY "Authenticated view approved products"
  ON public.user_coffee_products FOR SELECT
  TO authenticated
  USING (is_approved = true);

-- user_subscriptions: remove self insert/update
DROP POLICY IF EXISTS "Users insert own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users update own subscriptions" ON public.user_subscriptions;
