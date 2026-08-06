ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON public.blog_posts USING GIN (tags);