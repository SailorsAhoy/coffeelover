ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS brew_method text,
  ADD COLUMN IF NOT EXISTS beverage_type text,
  ADD COLUMN IF NOT EXISTS temperature text,
  ADD COLUMN IF NOT EXISTS flavors text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS difficulty text,
  ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;

GRANT SELECT ON public.recipes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO authenticated;
GRANT ALL ON public.recipes TO service_role;

CREATE OR REPLACE FUNCTION public.increment_recipe_views(_recipe_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.recipes SET views_count = views_count + 1 WHERE id = _recipe_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_recipe_views(uuid) TO anon, authenticated;

DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();