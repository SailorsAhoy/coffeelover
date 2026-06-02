ALTER TABLE public.shop_staff ADD COLUMN IF NOT EXISTS staff_user_id uuid;
CREATE INDEX IF NOT EXISTS idx_shop_staff_user ON public.shop_staff(staff_user_id);