
CREATE TABLE public.shop_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shop_photos_shop_id ON public.shop_photos(shop_id, created_at DESC);

GRANT SELECT ON public.shop_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_photos TO authenticated;
GRANT ALL ON public.shop_photos TO service_role;

ALTER TABLE public.shop_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop photos"
  ON public.shop_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can upload shop photos"
  ON public.shop_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Uploader can delete own shop photo"
  ON public.shop_photos FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Uploader can update own shop photo"
  ON public.shop_photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Storage policies for shop-photos bucket
CREATE POLICY "Shop photos publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-photos');

CREATE POLICY "Authenticated can upload shop photos to bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete their own shop photo files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'shop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update their own shop photo files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'shop-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
