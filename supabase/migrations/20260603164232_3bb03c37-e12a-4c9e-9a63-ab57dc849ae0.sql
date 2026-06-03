
-- 1. Ownership columns
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS linked_roaster_id uuid;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS linked_shop_id uuid;
ALTER TABLE public.manufacturers ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.academies ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.service_companies ADD COLUMN IF NOT EXISTS owner_user_id uuid;

-- 2. Roaster parity fields
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS opening_hours jsonb;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS affiliate_links jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS base_rating numeric DEFAULT 0;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS base_review_count integer DEFAULT 0;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE public.roasters ADD COLUMN IF NOT EXISTS banner text;

-- 3. listing_claims table
CREATE TABLE IF NOT EXISTS public.listing_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type text NOT NULL CHECK (listing_type IN ('shop','roaster','manufacturer','academy','service_company')),
  listing_id uuid NOT NULL,
  claimant_user_id uuid NOT NULL,
  requested_role text NOT NULL DEFAULT 'user' CHECK (requested_role IN ('admin','user')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS listing_claims_active_unique
  ON public.listing_claims (listing_type, listing_id)
  WHERE status IN ('pending','approved');

CREATE INDEX IF NOT EXISTS listing_claims_claimant_idx
  ON public.listing_claims (claimant_user_id);

GRANT SELECT, INSERT ON public.listing_claims TO authenticated;
GRANT UPDATE, DELETE ON public.listing_claims TO authenticated;
GRANT ALL ON public.listing_claims TO service_role;

ALTER TABLE public.listing_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Claimants view their claims" ON public.listing_claims;
CREATE POLICY "Claimants view their claims" ON public.listing_claims
  FOR SELECT TO authenticated
  USING (auth.uid() = claimant_user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Authed users submit claim" ON public.listing_claims;
CREATE POLICY "Authed users submit claim" ON public.listing_claims
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = claimant_user_id AND status = 'pending');

DROP POLICY IF EXISTS "Admins update claims" ON public.listing_claims;
CREATE POLICY "Admins update claims" ON public.listing_claims
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins delete claims" ON public.listing_claims;
CREATE POLICY "Admins delete claims" ON public.listing_claims
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- 4. Owner manage policies for the listing tables
DROP POLICY IF EXISTS "Verified owners manage shops" ON public.shops;
CREATE POLICY "Verified owners manage shops" ON public.shops
  FOR ALL TO authenticated
  USING (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id)
  WITH CHECK (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Verified owners manage roasters" ON public.roasters;
CREATE POLICY "Verified owners manage roasters" ON public.roasters
  FOR ALL TO authenticated
  USING (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id)
  WITH CHECK (owner_user_id IS NOT NULL AND auth.uid() = owner_user_id);

-- 5. updated_at trigger
CREATE TRIGGER listing_claims_updated_at
  BEFORE UPDATE ON public.listing_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
