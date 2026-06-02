
-- ============ ROLES ============
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manufacturer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';

-- ============ CATALOG: MANUFACTURER PRODUCTS ============
CREATE TABLE public.manufacturer_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  category text,
  image_url text,
  base_price numeric,
  currency text DEFAULT 'USD',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.manufacturer_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_products TO authenticated;
GRANT ALL ON public.manufacturer_products TO service_role;
ALTER TABLE public.manufacturer_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published manufacturer products"
  ON public.manufacturer_products FOR SELECT
  USING (is_published = true OR auth.uid() = manufacturer_user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Manufacturers manage own products"
  ON public.manufacturer_products FOR ALL
  USING (auth.uid() = manufacturer_user_id OR has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = manufacturer_user_id OR has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_manufacturer_products_updated
  BEFORE UPDATE ON public.manufacturer_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CATALOG: SUPPLIER PRODUCTS ============
CREATE TABLE public.supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_user_id uuid NOT NULL,
  manufacturer_product_id uuid REFERENCES public.manufacturer_products(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  image_url text,
  sale_price numeric NOT NULL,
  currency text DEFAULT 'USD',
  stock integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_supplier_products_supplier ON public.supplier_products(supplier_user_id);
CREATE INDEX idx_supplier_products_mfg ON public.supplier_products(manufacturer_product_id);
GRANT SELECT ON public.supplier_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_products TO authenticated;
GRANT ALL ON public.supplier_products TO service_role;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active supplier products"
  ON public.supplier_products FOR SELECT
  USING (is_active = true OR auth.uid() = supplier_user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Suppliers manage own products"
  ON public.supplier_products FOR ALL
  USING (auth.uid() = supplier_user_id OR has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = supplier_user_id OR has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_supplier_products_updated
  BEFORE UPDATE ON public.supplier_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SOCIAL: FRIENDSHIPS ============
CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  friend_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_user_id),
  CHECK (user_id <> friend_user_id),
  CHECK (status IN ('pending','accepted','blocked'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated;
GRANT ALL ON public.friendships TO service_role;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "Create friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own friendship rows"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "Delete own friendship rows"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);

-- ============ SOCIAL: FOLLOWS ============
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_user_id uuid NOT NULL,
  followee_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_user_id, followee_user_id),
  CHECK (follower_user_id <> followee_user_id)
);
GRANT SELECT ON public.follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view follows"
  ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users create own follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_user_id);
CREATE POLICY "Users delete own follows"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_user_id);

-- ============ SOCIAL: GROUPS ============
CREATE TABLE public.social_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_groups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_groups TO authenticated;
GRANT ALL ON public.social_groups TO service_role;
ALTER TABLE public.social_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View public or owned groups"
  ON public.social_groups FOR SELECT
  USING (is_public = true OR auth.uid() = owner_user_id);
CREATE POLICY "Create own groups"
  ON public.social_groups FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Owners update groups"
  ON public.social_groups FOR UPDATE
  USING (auth.uid() = owner_user_id);
CREATE POLICY "Owners delete groups"
  ON public.social_groups FOR DELETE
  USING (auth.uid() = owner_user_id);
CREATE TRIGGER trg_social_groups_updated
  BEFORE UPDATE ON public.social_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.social_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members TO authenticated;
GRANT ALL ON public.group_members TO service_role;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View group memberships"
  ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Join groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leave own memberships"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============ FORUM ============
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id uuid NOT NULL,
  group_id uuid REFERENCES public.social_groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_threads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_threads TO authenticated;
GRANT ALL ON public.forum_threads TO service_role;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View threads" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Create threads" ON public.forum_threads FOR INSERT
  WITH CHECK (auth.uid() = author_user_id);
CREATE POLICY "Author updates thread" ON public.forum_threads FOR UPDATE
  USING (auth.uid() = author_user_id);
CREATE POLICY "Author deletes thread" ON public.forum_threads FOR DELETE
  USING (auth.uid() = author_user_id);
CREATE TRIGGER trg_forum_threads_updated
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_user_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Create posts" ON public.forum_posts FOR INSERT
  WITH CHECK (auth.uid() = author_user_id);
CREATE POLICY "Author updates post" ON public.forum_posts FOR UPDATE
  USING (auth.uid() = author_user_id);
CREATE POLICY "Author deletes post" ON public.forum_posts FOR DELETE
  USING (auth.uid() = author_user_id);

-- ============ CHATS ============
CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  is_group boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chats TO authenticated;
GRANT ALL ON public.chats TO service_role;

CREATE TABLE public.chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.chat_participants TO authenticated;
GRANT ALL ON public.chat_participants TO service_role;

-- Security definer to avoid recursion in chat policies
CREATE OR REPLACE FUNCTION public.is_chat_participant(_chat_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = _chat_id AND user_id = _user_id)
$$;

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view chats" ON public.chats FOR SELECT
  USING (public.is_chat_participant(id, auth.uid()) OR auth.uid() = created_by);
CREATE POLICY "Create chats" ON public.chats FOR INSERT
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator updates chat" ON public.chats FOR UPDATE
  USING (auth.uid() = created_by);
CREATE POLICY "Creator deletes chat" ON public.chats FOR DELETE
  USING (auth.uid() = created_by);

ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view participants" ON public.chat_participants FOR SELECT
  USING (public.is_chat_participant(chat_id, auth.uid()));
CREATE POLICY "Add self or by chat creator" ON public.chat_participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.chats c WHERE c.id = chat_id AND c.created_by = auth.uid())
  );
CREATE POLICY "Remove self" ON public.chat_participants FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_user_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_messages_chat ON public.chat_messages(chat_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view messages" ON public.chat_messages FOR SELECT
  USING (public.is_chat_participant(chat_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_user_id AND public.is_chat_participant(chat_id, auth.uid()));
CREATE POLICY "Sender updates message" ON public.chat_messages FOR UPDATE
  USING (auth.uid() = sender_user_id);
CREATE POLICY "Sender deletes message" ON public.chat_messages FOR DELETE
  USING (auth.uid() = sender_user_id);
