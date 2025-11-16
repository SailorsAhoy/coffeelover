-- Create brewing journal tables

-- Brew methods enum
CREATE TYPE public.brew_method AS ENUM ('espresso', 'pour_over', 'french_press', 'aeropress', 'cold_brew', 'moka_pot', 'drip');

-- User coffee products (products they own)
CREATE TABLE public.user_coffee_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coffee_brand_id UUID REFERENCES public.coffee_brands(id),
  roaster_name TEXT,
  product_name TEXT NOT NULL,
  country_of_origin TEXT,
  region TEXT,
  altitude_meters INTEGER,
  varietals TEXT[],
  processing_method TEXT,
  harvest_date DATE,
  is_decaf BOOLEAN DEFAULT false,
  farm_name TEXT,
  wash_station TEXT,
  producer_name TEXT,
  flavor_profile TEXT,
  roast_date DATE,
  weight_grams INTEGER,
  price_amount NUMERIC,
  cupping_score INTEGER,
  lot_number TEXT,
  product_url TEXT,
  notes TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User equipment (machines and grinders they own)
CREATE TABLE public.user_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  machine_id UUID REFERENCES public.machines(id),
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Brew sessions
CREATE TABLE public.brew_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_coffee_product_id UUID REFERENCES public.user_coffee_products(id),
  brew_method brew_method NOT NULL,
  equipment_ids UUID[],
  
  -- Grind settings
  grind_setting TEXT,
  
  -- Process parameters
  coffee_dose_grams NUMERIC,
  water_amount_grams NUMERIC,
  water_temp_celsius NUMERIC,
  brew_weight_grams NUMERIC,
  tds_percentage NUMERIC,
  extraction_time_seconds INTEGER,
  extraction_yield_percentage NUMERIC,
  coffee_to_water_ratio TEXT,
  coffee_to_brew_ratio TEXT,
  
  -- Flavor profile scores (0-10)
  aroma_score INTEGER,
  sweetness_score INTEGER,
  acidity_score INTEGER,
  bitterness_score INTEGER,
  body_score INTEGER,
  
  -- Overall
  flavor_profile_accuracy TEXT,
  overall_rating NUMERIC,
  notes TEXT,
  brew_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_coffee_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brew_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_coffee_products
CREATE POLICY "Users can view own coffee products"
ON public.user_coffee_products FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coffee products"
ON public.user_coffee_products FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coffee products"
ON public.user_coffee_products FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coffee products"
ON public.user_coffee_products FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coffee products"
ON public.user_coffee_products FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Roasters can view approved products"
ON public.user_coffee_products FOR SELECT
USING (is_approved = true);

-- RLS Policies for user_equipment
CREATE POLICY "Users can manage own equipment"
ON public.user_equipment FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for brew_sessions
CREATE POLICY "Users can manage own brew sessions"
ON public.brew_sessions FOR ALL
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_coffee_products_updated_at
BEFORE UPDATE ON public.user_coffee_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_equipment_updated_at
BEFORE UPDATE ON public.user_equipment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brew_sessions_updated_at
BEFORE UPDATE ON public.brew_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();