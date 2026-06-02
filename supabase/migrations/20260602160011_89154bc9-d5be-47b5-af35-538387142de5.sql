
-- shop_photos: official vs user-contributed
ALTER TABLE public.shop_photos
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'user'
    CHECK (kind IN ('official','user'));

CREATE INDEX IF NOT EXISTS idx_shop_photos_shop_kind
  ON public.shop_photos(shop_id, kind, created_at DESC);

-- shop_staff
CREATE TABLE IF NOT EXISTS public.shop_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_path TEXT,
  managed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shop_staff_shop ON public.shop_staff(shop_id);

GRANT SELECT ON public.shop_staff TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_staff TO authenticated;
GRANT ALL ON public.shop_staff TO service_role;

ALTER TABLE public.shop_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop staff"
  ON public.shop_staff FOR SELECT USING (true);

CREATE POLICY "Auth can add shop staff"
  ON public.shop_staff FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = managed_by);

CREATE POLICY "Manager can update own shop staff"
  ON public.shop_staff FOR UPDATE TO authenticated
  USING (auth.uid() = managed_by);

CREATE POLICY "Manager can delete own shop staff"
  ON public.shop_staff FOR DELETE TO authenticated
  USING (auth.uid() = managed_by);

CREATE TRIGGER update_shop_staff_updated_at
  BEFORE UPDATE ON public.shop_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- shop_branding
CREATE TABLE IF NOT EXISTS public.shop_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id TEXT NOT NULL UNIQUE,
  banner_path TEXT,
  avatar_path TEXT,
  managed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shop_branding TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_branding TO authenticated;
GRANT ALL ON public.shop_branding TO service_role;

ALTER TABLE public.shop_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop branding"
  ON public.shop_branding FOR SELECT USING (true);

CREATE POLICY "Auth can add shop branding"
  ON public.shop_branding FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = managed_by);

CREATE POLICY "Manager updates branding"
  ON public.shop_branding FOR UPDATE TO authenticated
  USING (auth.uid() = managed_by);

CREATE POLICY "Manager deletes branding"
  ON public.shop_branding FOR DELETE TO authenticated
  USING (auth.uid() = managed_by);

CREATE TRIGGER update_shop_branding_updated_at
  BEFORE UPDATE ON public.shop_branding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
