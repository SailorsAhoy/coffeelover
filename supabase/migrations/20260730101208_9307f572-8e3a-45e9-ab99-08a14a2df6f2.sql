DROP POLICY IF EXISTS "Anon view roasters (public fields)" ON public.roasters;
DROP POLICY IF EXISTS "Anon view shops (public fields)" ON public.shops;
REVOKE ALL ON public.roasters FROM anon;
REVOKE ALL ON public.shops FROM anon;