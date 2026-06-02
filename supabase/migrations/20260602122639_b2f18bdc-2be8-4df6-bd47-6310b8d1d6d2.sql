
-- 1. Extend role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'company';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pro_user';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';

-- 2. Subscription plans (catalog)
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  modules text[] NOT NULL DEFAULT '{}',
  price_cents integer NOT NULL DEFAULT 0,
  billing_period text NOT NULL DEFAULT 'monthly',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT ALL ON public.subscription_plans TO service_role;

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage plans"
  ON public.subscription_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. User subscriptions
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Company members (staff linked to a company owner user)
CREATE TABLE public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_user_id uuid NOT NULL,
  member_user_id uuid NOT NULL,
  title text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_user_id, member_user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_members TO authenticated;
GRANT ALL ON public.company_members TO service_role;

ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners view members"
  ON public.company_members FOR SELECT
  USING (auth.uid() = company_user_id OR auth.uid() = member_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners manage members"
  ON public.company_members FOR ALL
  USING (auth.uid() = company_user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = company_user_id OR public.has_role(auth.uid(), 'admin'));

-- 5. Helper: has_active_subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid, _module text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON sp.id = us.plan_id
    WHERE us.user_id = _user_id
      AND us.status = 'active'
      AND (us.expires_at IS NULL OR us.expires_at > now())
      AND _module = ANY(sp.modules)
  )
$$;

-- 6. updated_at triggers
CREATE TRIGGER trg_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_company_members_updated_at
  BEFORE UPDATE ON public.company_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Seed plans
INSERT INTO public.subscription_plans (code, name, description, modules, price_cents, billing_period) VALUES
  ('free', 'Free', 'Default access for all users', ARRAY['community']::text[], 0, 'monthly'),
  ('pro_user', 'Pro User', 'Advanced journal, job search tools, unlimited brews', ARRAY['journal_pro','jobs_apply']::text[], 900, 'monthly'),
  ('company_basic', 'Company Basic', 'List your shop, roastery or equipment', ARRAY['shop_listing','roaster_listing','equipment_listing']::text[], 2900, 'monthly'),
  ('company_plus', 'Company Plus', 'Everything in Basic plus job posting and analytics', ARRAY['shop_listing','roaster_listing','equipment_listing','jobs_post','analytics']::text[], 5900, 'monthly'),
  ('teacher', 'Academy Teacher', 'Publish and monetize Academy courses', ARRAY['course_publishing']::text[], 1900, 'monthly');
