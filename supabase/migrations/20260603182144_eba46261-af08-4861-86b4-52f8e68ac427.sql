
-- =========================
-- user_blocks
-- =========================
CREATE TABLE public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_user_id uuid NOT NULL,
  blocked_user_id uuid NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_user_id, blocked_user_id),
  CHECK (blocker_user_id <> blocked_user_id)
);

GRANT SELECT, INSERT, DELETE ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own blocks visible" ON public.user_blocks
  FOR SELECT TO authenticated USING (auth.uid() = blocker_user_id);
CREATE POLICY "Create own blocks" ON public.user_blocks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_user_id);
CREATE POLICY "Delete own blocks" ON public.user_blocks
  FOR DELETE TO authenticated USING (auth.uid() = blocker_user_id);

CREATE OR REPLACE FUNCTION public.prevent_block_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(NEW.blocked_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin users cannot be blocked';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_prevent_block_admin
  BEFORE INSERT ON public.user_blocks
  FOR EACH ROW EXECUTE FUNCTION public.prevent_block_admin();

-- helper
CREATE OR REPLACE FUNCTION public.is_blocked_between(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_user_id = _a AND blocked_user_id = _b)
       OR (blocker_user_id = _b AND blocked_user_id = _a)
  );
$$;

-- =========================
-- user_reports
-- =========================
CREATE TABLE public.user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid NOT NULL,
  reported_user_id uuid NOT NULL,
  context_type text,           -- 'chat' | 'profile' | 'other'
  context_id uuid,             -- e.g. chat_id
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','resolved','dismissed')),
  handled_by uuid,
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (reporter_user_id <> reported_user_id)
);

GRANT SELECT, INSERT ON public.user_reports TO authenticated;
GRANT UPDATE ON public.user_reports TO authenticated; -- gated by RLS to admins only
GRANT ALL ON public.user_reports TO service_role;

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reporter views own report" ON public.user_reports
  FOR SELECT TO authenticated
  USING (
    auth.uid() = reporter_user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR (context_type = 'chat' AND context_id IS NOT NULL AND public.is_chat_participant(context_id, auth.uid()))
  );
CREATE POLICY "Create own report" ON public.user_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_user_id);
CREATE POLICY "Admins update reports" ON public.user_reports
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- notifications
-- =========================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,           -- message | follow | friend_request | friend_accepted | claim_update | report_update | system
  title text NOT NULL,
  body text,
  link text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, read_at, created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own notifications update" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own notifications delete" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- inserts only via SECURITY DEFINER triggers (no INSERT policy needed for clients)

-- =========================
-- Triggers: notifications
-- =========================

-- message -> notify other participants (skip blocked pairs)
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sender_name text;
BEGIN
  SELECT COALESCE(p.name, 'Someone') INTO sender_name
  FROM public.profiles p WHERE p.id = NEW.sender_user_id;

  INSERT INTO public.notifications (user_id, type, title, body, link, data)
  SELECT
    cp.user_id,
    'message',
    sender_name || ' sent you a message',
    LEFT(NEW.body, 140),
    '/messages/' || NEW.chat_id::text,
    jsonb_build_object('chat_id', NEW.chat_id, 'message_id', NEW.id, 'sender_id', NEW.sender_user_id)
  FROM public.chat_participants cp
  WHERE cp.chat_id = NEW.chat_id
    AND cp.user_id <> NEW.sender_user_id
    AND NOT public.is_blocked_between(cp.user_id, NEW.sender_user_id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_notify_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();

-- prevent sending messages between blocked users in DMs
CREATE OR REPLACE FUNCTION public.prevent_messaging_blocked()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_group boolean;
  other uuid;
BEGIN
  SELECT c.is_group INTO is_group FROM public.chats c WHERE c.id = NEW.chat_id;
  IF NOT is_group THEN
    SELECT cp.user_id INTO other
      FROM public.chat_participants cp
      WHERE cp.chat_id = NEW.chat_id AND cp.user_id <> NEW.sender_user_id
      LIMIT 1;
    IF other IS NOT NULL AND public.is_blocked_between(NEW.sender_user_id, other) THEN
      RAISE EXCEPTION 'Messaging is blocked between these users';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_prevent_messaging_blocked
  BEFORE INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.prevent_messaging_blocked();

-- follow -> notify followee
CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE follower_name text;
BEGIN
  SELECT COALESCE(p.name, 'Someone') INTO follower_name
  FROM public.profiles p WHERE p.id = NEW.follower_user_id;

  INSERT INTO public.notifications (user_id, type, title, link, data)
  VALUES (
    NEW.followee_user_id,
    'follow',
    follower_name || ' followed you',
    '/profile',
    jsonb_build_object('follower_id', NEW.follower_user_id)
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_notify_on_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();

-- friendship -> notify on pending + accepted
CREATE OR REPLACE FUNCTION public.notify_on_friendship()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor_name text;
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    SELECT COALESCE(p.name,'Someone') INTO actor_name FROM public.profiles p WHERE p.id = NEW.user_id;
    INSERT INTO public.notifications (user_id, type, title, link, data)
    VALUES (NEW.friend_user_id, 'friend_request', actor_name || ' sent you a friend request', '/profile',
      jsonb_build_object('from_user_id', NEW.user_id, 'friendship_id', NEW.id));
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    SELECT COALESCE(p.name,'Someone') INTO actor_name FROM public.profiles p WHERE p.id = NEW.friend_user_id;
    INSERT INTO public.notifications (user_id, type, title, link, data)
    VALUES (NEW.user_id, 'friend_accepted', actor_name || ' accepted your friend request', '/profile',
      jsonb_build_object('with_user_id', NEW.friend_user_id, 'friendship_id', NEW.id));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_notify_on_friendship_ins
  AFTER INSERT ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_friendship();
CREATE TRIGGER trg_notify_on_friendship_upd
  AFTER UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_friendship();

-- =========================
-- RPC: get_or_create_dm
-- =========================
CREATE OR REPLACE FUNCTION public.get_or_create_dm(other_user uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  me uuid := auth.uid();
  existing uuid;
  new_chat uuid;
BEGIN
  IF me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF me = other_user THEN RAISE EXCEPTION 'Cannot DM yourself'; END IF;
  IF public.is_blocked_between(me, other_user) THEN
    RAISE EXCEPTION 'Messaging is blocked between these users';
  END IF;

  SELECT c.id INTO existing
    FROM public.chats c
    JOIN public.chat_participants p1 ON p1.chat_id = c.id AND p1.user_id = me
    JOIN public.chat_participants p2 ON p2.chat_id = c.id AND p2.user_id = other_user
    WHERE c.is_group = false
    LIMIT 1;
  IF existing IS NOT NULL THEN RETURN existing; END IF;

  INSERT INTO public.chats (is_group, created_by) VALUES (false, me) RETURNING id INTO new_chat;
  INSERT INTO public.chat_participants (chat_id, user_id) VALUES (new_chat, me), (new_chat, other_user);
  RETURN new_chat;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_or_create_dm(uuid) TO authenticated;

-- =========================
-- RPC: mark_chat_read
-- =========================
CREATE OR REPLACE FUNCTION public.mark_chat_read(_chat_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE me uuid := auth.uid();
BEGIN
  IF me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.is_chat_participant(_chat_id, me) THEN RAISE EXCEPTION 'Not a participant'; END IF;

  UPDATE public.chat_participants
    SET last_read_at = now()
    WHERE chat_id = _chat_id AND user_id = me;

  UPDATE public.notifications
    SET read_at = now()
    WHERE user_id = me AND type = 'message' AND read_at IS NULL
      AND (data->>'chat_id') = _chat_id::text;
END;
$$;
GRANT EXECUTE ON FUNCTION public.mark_chat_read(uuid) TO authenticated;

-- =========================
-- RPC: unread_notifications_count
-- =========================
CREATE OR REPLACE FUNCTION public.unread_notifications_count()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::int FROM public.notifications
  WHERE user_id = auth.uid() AND read_at IS NULL;
$$;
GRANT EXECUTE ON FUNCTION public.unread_notifications_count() TO authenticated;

-- =========================
-- Realtime
-- =========================
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;

DO $$ BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='notifications';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications'; END IF;

  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='chat_messages';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages'; END IF;

  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='chat_participants';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants'; END IF;
END $$;
