CREATE OR REPLACE FUNCTION public.can_view_forum_thread(_thread_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.forum_threads t
    LEFT JOIN public.social_groups g ON g.id = t.group_id
    WHERE t.id = _thread_id
      AND (
        t.group_id IS NULL
        OR g.is_public
        OR (_user_id IS NOT NULL AND (
             g.owner_user_id = _user_id
             OR public.is_group_member(g.id, _user_id)
             OR public.has_role(_user_id, 'admin')
           ))
      )
  )
$$;

DROP POLICY IF EXISTS "View threads" ON public.forum_threads;
CREATE POLICY "View threads"
ON public.forum_threads
FOR SELECT
USING (
  group_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.social_groups g
    WHERE g.id = forum_threads.group_id
      AND (
        g.is_public
        OR (auth.uid() IS NOT NULL AND (
             g.owner_user_id = auth.uid()
             OR public.is_group_member(g.id, auth.uid())
             OR public.has_role(auth.uid(), 'admin')
           ))
      )
  )
);

DROP POLICY IF EXISTS "View posts" ON public.forum_posts;
CREATE POLICY "View posts"
ON public.forum_posts
FOR SELECT
USING (public.can_view_forum_thread(thread_id, auth.uid()));