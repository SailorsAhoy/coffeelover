
-- Shops
CREATE TABLE public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  type text,
  description text,
  bio text,
  lat numeric, lng numeric,
  address text, country text,
  price_level int CHECK (price_level BETWEEN 1 AND 4),
  base_rating numeric DEFAULT 0,
  base_review_count int DEFAULT 0,
  amenities jsonb DEFAULT '{}'::jsonb,
  phone text, whatsapp text, website text, email text,
  facebook text, instagram text, twitter text,
  opening_hours jsonb,
  banner text, avatar text,
  status text DEFAULT 'approved',
  created_by uuid,
  created_by_role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shops TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shops TO authenticated;
GRANT ALL ON public.shops TO service_role;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Admins manage shops" ON public.shops FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Owners manage own shops" ON public.shops FOR ALL USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Roasters
CREATE TABLE public.roasters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  lat numeric, lng numeric,
  address text, country text,
  logo_url text, banner_url text, website text,
  phone text, whatsapp text, email text,
  facebook text, instagram text, twitter text,
  offers_free_shipping boolean DEFAULT false,
  has_discount_coupons boolean DEFAULT false,
  status text DEFAULT 'approved',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roasters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roasters TO authenticated;
GRANT ALL ON public.roasters TO service_role;
ALTER TABLE public.roasters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view roasters" ON public.roasters FOR SELECT USING (true);
CREATE POLICY "Admins manage roasters" ON public.roasters FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Owners manage own roasters" ON public.roasters FOR ALL USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Manufacturers
CREATE TABLE public.manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  slug text UNIQUE,
  description text,
  logo_url text, website_url text,
  email text, phone text, country text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.manufacturers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturers TO authenticated;
GRANT ALL ON public.manufacturers TO service_role;
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view manufacturers" ON public.manufacturers FOR SELECT USING (true);
CREATE POLICY "Admins manage manufacturers" ON public.manufacturers FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Service Companies
CREATE TABLE public.service_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  slug text UNIQUE,
  category text NOT NULL CHECK (category IN ('equipment_sales','services','academy')),
  description text,
  logo_url text, website_url text,
  email text, phone text, country text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_companies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_companies TO authenticated;
GRANT ALL ON public.service_companies TO service_role;
ALTER TABLE public.service_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view service_companies" ON public.service_companies FOR SELECT USING (true);
CREATE POLICY "Admins manage service_companies" ON public.service_companies FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Academies
CREATE TABLE public.academies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  logo_url text, website_url text, country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academies TO authenticated;
GRANT ALL ON public.academies TO service_role;
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view academies" ON public.academies FOR SELECT USING (true);
CREATE POLICY "Admins manage academies" ON public.academies FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Instructors
CREATE TABLE public.instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  bio text,
  photo_url text,
  email text,
  academy_id uuid REFERENCES public.academies(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.instructors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instructors TO authenticated;
GRANT ALL ON public.instructors TO service_role;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view instructors" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "Admins manage instructors" ON public.instructors FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  level text,
  duration_min int,
  image_url text,
  instructor_id uuid REFERENCES public.instructors(id) ON DELETE SET NULL,
  academy_id uuid REFERENCES public.academies(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (instructor_id IS NOT NULL OR academy_id IS NOT NULL)
);
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Extend existing tables with optional parent refs
ALTER TABLE public.coffee_brands ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL;
ALTER TABLE public.coffee_brands ALTER COLUMN roaster_id DROP NOT NULL;

ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS manufacturer_id uuid REFERENCES public.manufacturers(id) ON DELETE SET NULL;
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS service_company_id uuid REFERENCES public.service_companies(id) ON DELETE SET NULL;
ALTER TABLE public.machines ALTER COLUMN brand_id DROP NOT NULL;

ALTER TABLE public.accessories ADD COLUMN IF NOT EXISTS manufacturer_id uuid REFERENCES public.manufacturers(id) ON DELETE SET NULL;
ALTER TABLE public.accessories ADD COLUMN IF NOT EXISTS service_company_id uuid REFERENCES public.service_companies(id) ON DELETE SET NULL;

ALTER TABLE public.shop_staff ADD COLUMN IF NOT EXISTS roaster_id uuid REFERENCES public.roasters(id) ON DELETE SET NULL;
ALTER TABLE public.shop_staff ALTER COLUMN shop_id DROP NOT NULL;
