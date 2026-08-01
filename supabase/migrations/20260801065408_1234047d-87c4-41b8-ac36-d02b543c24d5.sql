CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  banner_url text,
  overlay_color text NOT NULL DEFAULT '#3B2717',
  overlay_opacity numeric NOT NULL DEFAULT 0.4,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog categories readable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "admins manage blog categories" ON public.blog_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  banner_url text,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_status_check CHECK (status IN ('draft','published'))
);
CREATE INDEX blog_posts_published_idx ON public.blog_posts (status, published_at DESC);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "published posts readable by everyone" ON public.blog_posts FOR SELECT
  USING (status = 'published');
CREATE POLICY "authors read own posts" ON public.blog_posts FOR SELECT TO authenticated
  USING (author_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "authors create posts" ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.has_role(auth.uid(),'author') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "authors update own posts" ON public.blog_posts FOR UPDATE TO authenticated
  USING ((author_id = auth.uid() AND public.has_role(auth.uid(),'author')) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK ((author_id = auth.uid() AND public.has_role(auth.uid(),'author')) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "authors delete own posts" ON public.blog_posts FOR DELETE TO authenticated
  USING ((author_id = auth.uid() AND public.has_role(auth.uid(),'author')) OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_post_views(_post_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.blog_posts SET views_count = views_count + 1 WHERE id = _post_id AND status = 'published';
$$;

INSERT INTO public.blog_categories (slug, name, description, overlay_color, overlay_opacity, banner_url) VALUES
  ('industry-news','Industry News','What is moving the specialty coffee world.','#3B2717',0.45,'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80'),
  ('brewing','Brewing','Techniques, ratios and gear talk.','#6B4423',0.4,'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80'),
  ('origin','Origin Stories','Farms, producers and terroir.','#A66B2E',0.4,'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1600&q=80'),
  ('community','Community','People, shops and events.','#3B2717',0.35,'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80');