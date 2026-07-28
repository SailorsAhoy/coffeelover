
DROP VIEW IF EXISTS public.shops_public;
DROP VIEW IF EXISTS public.roasters_public;

-- Column-level: revoke sensitive contact columns from anon
REVOKE SELECT (email, phone, whatsapp) ON public.shops FROM anon;
REVOKE SELECT (email, phone, whatsapp) ON public.roasters FROM anon;

-- Ensure authenticated still has all columns
GRANT SELECT ON public.shops TO authenticated;
GRANT SELECT ON public.roasters TO authenticated;
