import { supabase } from "@/integrations/supabase/client";

interface AnyRow { [k: string]: any }

const COMMON_KEYS = [
  "name", "description", "bio", "lat", "lng", "address", "country",
  "phone", "whatsapp", "website", "email", "facebook", "instagram", "twitter",
  "opening_hours", "amenities", "affiliate_links", "avatar", "banner",
];

function pick(src: AnyRow, keys: string[]) {
  const out: AnyRow = {};
  for (const k of keys) if (src[k] !== undefined && src[k] !== null) out[k] = src[k];
  return out;
}

/** Clone a shop into a roaster (and link them). */
export async function cloneShopToRoaster(shopId: string) {
  const { data: shop, error } = await supabase.from("shops").select("*").eq("id", shopId).maybeSingle();
  if (error || !shop) throw error ?? new Error("Shop not found");

  const payload = pick(shop, COMMON_KEYS);
  payload.owner_user_id = (shop as AnyRow).owner_user_id ?? null;
  payload.linked_shop_id = shopId;
  // map shop banner field name parity
  if ((shop as AnyRow).banner) payload.banner_url = (shop as AnyRow).banner;
  if ((shop as AnyRow).avatar) payload.logo_url = (shop as AnyRow).avatar;

  const { data: roaster, error: insErr } = await (supabase as any)
    .from("roasters").insert(payload).select("id").single();
  if (insErr) throw insErr;

  await supabase.from("shops").update({ linked_roaster_id: roaster.id }).eq("id", shopId);
  return roaster.id as string;
}

/** Clone a roaster into a shop (classified as 'roaster' shop type) and link them. */
export async function cloneRoasterToShop(roasterId: string) {
  const { data: roaster, error } = await supabase.from("roasters").select("*").eq("id", roasterId).maybeSingle();
  if (error || !roaster) throw error ?? new Error("Roaster not found");

  const payload = pick(roaster, COMMON_KEYS);
  payload.owner_user_id = (roaster as AnyRow).owner_user_id ?? null;
  payload.linked_roaster_id = roasterId;
  payload.type = "roaster";
  if ((roaster as AnyRow).banner_url) payload.banner = (roaster as AnyRow).banner_url;
  if ((roaster as AnyRow).logo_url) payload.avatar = (roaster as AnyRow).logo_url;

  const { data: shop, error: insErr } = await (supabase as any)
    .from("shops").insert(payload).select("id").single();
  if (insErr) throw insErr;

  await supabase.from("roasters").update({ linked_shop_id: shop.id }).eq("id", roasterId);
  return shop.id as string;
}
