DROP POLICY IF EXISTS "Authenticated view roasters (all fields)" ON public.roasters;
DROP POLICY IF EXISTS "Authenticated view shops (all fields)" ON public.shops;

DROP POLICY IF EXISTS "Owner or admin view shops" ON public.shops;
CREATE POLICY "Owner or admin view shops" ON public.shops FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Owner or admin view roasters" ON public.roasters;
CREATE POLICY "Owner or admin view roasters" ON public.roasters FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP VIEW IF EXISTS public.shops_public;
CREATE VIEW public.shops_public AS
  SELECT s.* FROM public.shops s;
ALTER VIEW public.shops_public SET (security_barrier = true);

DROP VIEW IF EXISTS public.roasters_public;
CREATE VIEW public.roasters_public AS
  SELECT r.* FROM public.roasters r;
ALTER VIEW public.roasters_public SET (security_barrier = true);