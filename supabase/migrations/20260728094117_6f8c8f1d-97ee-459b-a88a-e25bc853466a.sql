
-- Group membership visibility: replace public SELECT with member/owner/admin-only
DROP POLICY IF EXISTS "View group memberships" ON public.group_members;

-- Helper to avoid recursion in policies that reference group_members
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND user_id = _user_id
  )
$$;

CREATE POLICY "Members, owners and admins view group memberships"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_group_member(group_id, auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.social_groups g
      WHERE g.id = group_members.group_id AND g.owner_user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Ensure anon has no access
REVOKE SELECT ON public.group_members FROM anon;

-- Reaffirm shop/roaster column-level restrictions (idempotent)
REVOKE SELECT (email, phone, whatsapp) ON public.shops FROM anon;
REVOKE SELECT (email, phone, whatsapp) ON public.roasters FROM anon;
