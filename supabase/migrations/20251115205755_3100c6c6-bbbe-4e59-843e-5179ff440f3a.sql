-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'roaster', 'coffee_shop', 'producer', 'user');

-- Create enum for coffee types
CREATE TYPE public.coffee_type AS ENUM ('arabica', 'robusta', 'liberica', 'excelsa', 'blend');

-- Create enum for roast levels
CREATE TYPE public.roast_level AS ENUM ('light', 'medium', 'medium_dark', 'dark');

-- Create enum for machine types
CREATE TYPE public.machine_type AS ENUM ('espresso', 'drip', 'french_press', 'pour_over', 'cold_brew', 'moka_pot', 'aeropress');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create countries table for address helpers
CREATE TABLE public.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES public.countries(id),
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state_province TEXT,
    postal_code TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create producer profiles table
CREATE TABLE public.producer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    description TEXT,
    farm_size_hectares DECIMAL(10, 2),
    certifications TEXT[],
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create roaster profiles table
CREATE TABLE public.roaster_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    offers_free_shipping BOOLEAN DEFAULT FALSE,
    has_discount_coupons BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create coffee shop profiles table
CREATE TABLE public.coffee_shop_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    address_id UUID REFERENCES public.addresses(id),
    has_bakery BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_outdoor_seating BOOLEAN DEFAULT FALSE,
    opening_hours JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create coffee brands table
CREATE TABLE public.coffee_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roaster_id UUID NOT NULL REFERENCES public.roaster_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    coffee_type coffee_type,
    roast_level roast_level,
    origin_country TEXT,
    price_per_kg DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    affiliate_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewable_type TEXT NOT NULL,
    reviewable_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, reviewable_type, reviewable_id)
);

-- Create preparation guides table
CREATE TABLE public.preparation_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    machine_type machine_type NOT NULL,
    coffee_type coffee_type,
    instructions TEXT NOT NULL,
    grind_size TEXT,
    water_temp_celsius INTEGER,
    brew_time_seconds INTEGER,
    coffee_to_water_ratio TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    coffee_brand_id UUID REFERENCES public.coffee_brands(id),
    ingredients JSONB NOT NULL,
    instructions TEXT NOT NULL,
    prep_time_minutes INTEGER,
    servings INTEGER DEFAULT 1,
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create machine brands table
CREATE TABLE public.machine_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create machines table
CREATE TABLE public.machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.machine_brands(id),
    name TEXT NOT NULL,
    description TEXT,
    machine_type machine_type NOT NULL,
    price DECIMAL(10, 2),
    image_url TEXT,
    seller_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create accessories table
CREATE TABLE public.accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    seller_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roaster_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_shop_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preparation_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machine_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
ON public.user_roles FOR SELECT
USING (TRUE);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for countries (public read)
CREATE POLICY "Anyone can view countries"
ON public.countries FOR SELECT
USING (TRUE);

CREATE POLICY "Only admins can modify countries"
ON public.countries FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for addresses
CREATE POLICY "Users can view own addresses"
ON public.addresses FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own addresses"
ON public.addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON public.addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON public.addresses FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for producer profiles
CREATE POLICY "Anyone can view producer profiles"
ON public.producer_profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can manage own producer profile"
ON public.producer_profiles FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for roaster profiles
CREATE POLICY "Anyone can view roaster profiles"
ON public.roaster_profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can manage own roaster profile"
ON public.roaster_profiles FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for coffee shop profiles
CREATE POLICY "Anyone can view coffee shop profiles"
ON public.coffee_shop_profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can manage own coffee shop profile"
ON public.coffee_shop_profiles FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for coffee brands
CREATE POLICY "Anyone can view coffee brands"
ON public.coffee_brands FOR SELECT
USING (TRUE);

CREATE POLICY "Roasters can manage their brands"
ON public.coffee_brands FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.roaster_profiles
    WHERE id = coffee_brands.roaster_id
    AND user_id = auth.uid()
  )
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (TRUE);

CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for preparation guides (public read, admin write)
CREATE POLICY "Anyone can view guides"
ON public.preparation_guides FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage guides"
ON public.preparation_guides FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for recipes
CREATE POLICY "Anyone can view recipes"
ON public.recipes FOR SELECT
USING (TRUE);

CREATE POLICY "Authenticated users can insert recipes"
ON public.recipes FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own recipes"
ON public.recipes FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own recipes"
ON public.recipes FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for machine brands (public read, admin write)
CREATE POLICY "Anyone can view machine brands"
ON public.machine_brands FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage machine brands"
ON public.machine_brands FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for machines (public read, admin write)
CREATE POLICY "Anyone can view machines"
ON public.machines FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage machines"
ON public.machines FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for accessories (public read, admin write)
CREATE POLICY "Anyone can view accessories"
ON public.accessories FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage accessories"
ON public.accessories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_producer_profiles_updated_at
BEFORE UPDATE ON public.producer_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roaster_profiles_updated_at
BEFORE UPDATE ON public.roaster_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coffee_shop_profiles_updated_at
BEFORE UPDATE ON public.coffee_shop_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coffee_brands_updated_at
BEFORE UPDATE ON public.coffee_brands
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_preparation_guides_updated_at
BEFORE UPDATE ON public.preparation_guides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
BEFORE UPDATE ON public.machines
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at
BEFORE UPDATE ON public.accessories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();