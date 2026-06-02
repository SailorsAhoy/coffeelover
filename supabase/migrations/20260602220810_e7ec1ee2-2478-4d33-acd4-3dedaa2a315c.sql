
-- Activity / audit log
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL,
  shop_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view activity log"
  ON public.activity_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own activity"
  ON public.activity_log FOR SELECT
  USING (auth.uid() = actor_user_id);

CREATE POLICY "Authenticated insert activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() = actor_user_id);

CREATE INDEX idx_activity_created_at ON public.activity_log (created_at DESC);
CREATE INDEX idx_activity_entity ON public.activity_log (entity_type, entity_id);
CREATE INDEX idx_activity_actor ON public.activity_log (actor_user_id);

-- Generic trigger fn that logs entity changes
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entity text := TG_ARGV[0];
  v_action text;
  v_id text;
  v_shop text;
BEGIN
  IF TG_OP = 'INSERT' THEN v_action := 'created';
  ELSIF TG_OP = 'UPDATE' THEN v_action := 'updated';
  ELSE v_action := 'deleted';
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_id := COALESCE((row_to_json(OLD)->>'id'), null);
    v_shop := COALESCE((row_to_json(OLD)->>'shop_id'), null);
  ELSE
    v_id := COALESCE((row_to_json(NEW)->>'id'), null);
    v_shop := COALESCE((row_to_json(NEW)->>'shop_id'), null);
  END IF;

  INSERT INTO public.activity_log (actor_user_id, entity_type, entity_id, action, shop_id, metadata)
  VALUES (
    auth.uid(),
    v_entity,
    v_id,
    v_action,
    v_shop,
    jsonb_build_object('table', TG_TABLE_NAME, 'op', TG_OP)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_shop_branding
AFTER INSERT OR UPDATE OR DELETE ON public.shop_branding
FOR EACH ROW EXECUTE FUNCTION public.log_activity('shop');

CREATE TRIGGER trg_log_shop_staff
AFTER INSERT OR UPDATE OR DELETE ON public.shop_staff
FOR EACH ROW EXECUTE FUNCTION public.log_activity('staff');

CREATE TRIGGER trg_log_manufacturer_products
AFTER INSERT OR UPDATE OR DELETE ON public.manufacturer_products
FOR EACH ROW EXECUTE FUNCTION public.log_activity('manufacturer_product');

CREATE TRIGGER trg_log_supplier_products
AFTER INSERT OR UPDATE OR DELETE ON public.supplier_products
FOR EACH ROW EXECUTE FUNCTION public.log_activity('supplier_product');

CREATE TRIGGER trg_log_coffee_brands
AFTER INSERT OR UPDATE OR DELETE ON public.coffee_brands
FOR EACH ROW EXECUTE FUNCTION public.log_activity('coffee_product');

-- Track shop manager linkage changes (managed_by changes on shop_branding)
-- handled by shop_branding trigger above; affiliate links are part of shop_branding/profiles

-- Read flags for chats: track last read time per participant
ALTER TABLE public.chat_participants
  ADD COLUMN IF NOT EXISTS last_read_at timestamptz NOT NULL DEFAULT now();
