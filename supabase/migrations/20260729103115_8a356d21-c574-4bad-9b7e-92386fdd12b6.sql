DROP POLICY IF EXISTS "app_settings public read" ON public.app_settings;

CREATE POLICY "app_settings admin read"
ON public.app_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT ON public.app_settings FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

CREATE OR REPLACE FUNCTION public.get_public_app_setting(_key text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.value
  FROM public.app_settings s
  WHERE s.key = _key
    AND s.key IN ('gated_preview_enabled')
$$;

GRANT EXECUTE ON FUNCTION public.get_public_app_setting(text) TO anon, authenticated;