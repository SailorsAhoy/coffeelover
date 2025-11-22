-- Create shop_types table
CREATE TABLE public.shop_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon_color TEXT NOT NULL DEFAULT '#8B4513',
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_types ENABLE ROW LEVEL SECURITY;

-- Anyone can view shop types
CREATE POLICY "Anyone can view shop types"
ON public.shop_types
FOR SELECT
USING (true);

-- Only admins can manage shop types
CREATE POLICY "Admins can manage shop types"
ON public.shop_types
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add shop_type_id to coffee_shop_profiles
ALTER TABLE public.coffee_shop_profiles
ADD COLUMN shop_type_id UUID REFERENCES public.shop_types(id);

-- Add shop_type_id to roaster_profiles (for roaster shops)
ALTER TABLE public.roaster_profiles
ADD COLUMN shop_type_id UUID REFERENCES public.shop_types(id);

-- Add contact and social information to coffee_shop_profiles
ALTER TABLE public.coffee_shop_profiles
ADD COLUMN phone TEXT,
ADD COLUMN whatsapp TEXT,
ADD COLUMN email TEXT,
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN twitter_url TEXT;

-- Add contact and social information to roaster_profiles
ALTER TABLE public.roaster_profiles
ADD COLUMN phone TEXT,
ADD COLUMN whatsapp TEXT,
ADD COLUMN email TEXT,
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN twitter_url TEXT;

-- Create trigger for updated_at
CREATE TRIGGER update_shop_types_updated_at
BEFORE UPDATE ON public.shop_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default shop types
INSERT INTO public.shop_types (name, icon_color) VALUES
  ('Coffee Shop', '#8B4513'),
  ('Roastery', '#ef4444'),
  ('Vegan Café', '#10b981'),
  ('Bakery', '#f59e0b');