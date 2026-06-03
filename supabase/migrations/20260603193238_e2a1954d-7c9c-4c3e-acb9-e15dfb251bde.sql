-- Wipe roaster + product seed data so we can rebuild from scratch via the UI.
DELETE FROM public.coffee_brands;
DELETE FROM public.roasters;

-- Enable realtime so the Roasters list updates live (matches shops behaviour).
ALTER TABLE public.roasters REPLICA IDENTITY FULL;
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'roasters';
  IF NOT FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.roasters';
  END IF;
END $$;