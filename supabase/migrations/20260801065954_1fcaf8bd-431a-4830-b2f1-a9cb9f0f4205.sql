DROP VIEW IF EXISTS public.shops_public;
CREATE VIEW public.shops_public AS
  SELECT id, name, slug, type, description, bio, lat, lng, address, country, price_level,
         base_rating, base_review_count, amenities, website, facebook, instagram, twitter,
         opening_hours, banner, avatar, status, created_by, created_by_role, created_at,
         updated_at, owner_user_id, linked_roaster_id
  FROM public.shops;
GRANT SELECT ON public.shops_public TO authenticated;

DROP VIEW IF EXISTS public.roasters_public;
CREATE VIEW public.roasters_public AS
  SELECT id, name, slug, description, lat, lng, address, country, logo_url, banner_url,
         website, facebook, instagram, twitter, offers_free_shipping, has_discount_coupons,
         status, created_by, created_at, updated_at, owner_user_id, linked_shop_id, bio,
         opening_hours, amenities, affiliate_links, base_rating, base_review_count, avatar, banner
  FROM public.roasters;
GRANT SELECT ON public.roasters_public TO authenticated;