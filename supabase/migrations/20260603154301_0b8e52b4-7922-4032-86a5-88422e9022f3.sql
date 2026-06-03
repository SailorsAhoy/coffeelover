
CREATE TABLE public.import_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_user_id uuid NOT NULL,
  actor_email text,
  category text NOT NULL,
  table_name text NOT NULL,
  file_name text,
  total_rows integer NOT NULL DEFAULT 0,
  inserted_count integer NOT NULL DEFAULT 0,
  skipped_count integer NOT NULL DEFAULT 0,
  error_preview jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.import_audit_log TO authenticated;
GRANT ALL ON public.import_audit_log TO service_role;

ALTER TABLE public.import_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view import audit"
  ON public.import_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Actor inserts own import audit"
  ON public.import_audit_log FOR INSERT
  WITH CHECK (auth.uid() = actor_user_id AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX import_audit_log_created_at_idx ON public.import_audit_log (created_at DESC);
CREATE INDEX import_audit_log_actor_idx ON public.import_audit_log (actor_user_id);
