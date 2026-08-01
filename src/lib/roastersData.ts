import type { OpeningHours } from "@/lib/shopUtils";
import type { AmenityKey } from "@/lib/shopAmenities";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateLink {
  id: string;
  label: string;
  url: string;
}

export type Amenities = Partial<Record<AmenityKey, boolean>>;

/**
 * Roaster shape, DB-first. `id` is the canonical UUID from the `roasters`
 * table and is also the reviewable_id used in the reviews table.
 */
export interface Roaster {
  id: string;
  name: string;
  description: string;
  bio?: string;
  lat: number;
  lng: number;
  address: string;
  country?: string;
  baseRating: number;
  baseReviewCount: number;
  amenities: Amenities;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  opening_hours: OpeningHours;
  affiliateLinks?: AffiliateLink[];
  banner?: string;
  avatar?: string;
  offersFreeShipping?: boolean;
  hasDiscountCoupons?: boolean;
  status?: "pending" | "approved" | "rejected";
  pendingReview?: boolean;
  createdBy?: string;
  createdByName?: string;
  createdByRole?: string;
  ownerUserId?: string;
  linkedShopId?: string;
}

const stdHours: OpeningHours = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "10:00", close: "16:00" },
  sunday: { open: "00:00", close: "00:00", closed: true },
};

const cache = new Map<string, Roaster>();
const listeners = new Set<() => void>();
let realtimeBound = false;

const notify = () => listeners.forEach((l) => l());

const fromRow = (r: any): Roaster => ({
  id: r.id,
  name: r.name,
  description: r.description ?? "",
  bio: r.bio ?? undefined,
  lat: Number(r.lat) || 0,
  lng: Number(r.lng) || 0,
  address: r.address ?? "",
  country: r.country ?? undefined,
  baseRating: Number(r.base_rating) || 0,
  baseReviewCount: Number(r.base_review_count) || 0,
  amenities: (r.amenities ?? {}) as Amenities,
  phone: r.phone ?? undefined,
  whatsapp: r.whatsapp ?? undefined,
  website: r.website ?? undefined,
  email: r.email ?? undefined,
  facebook: r.facebook ?? undefined,
  instagram: r.instagram ?? undefined,
  twitter: r.twitter ?? undefined,
  opening_hours: (r.opening_hours ?? stdHours) as OpeningHours,
  affiliateLinks: (r.affiliate_links ?? []) as AffiliateLink[],
  banner: r.banner ?? r.banner_url ?? undefined,
  avatar: r.avatar ?? r.logo_url ?? undefined,
  offersFreeShipping: !!r.offers_free_shipping,
  hasDiscountCoupons: !!r.has_discount_coupons,
  status: (r.status ?? "approved") as Roaster["status"],
  pendingReview: r.status === "pending",
  createdBy: r.created_by ?? undefined,
  ownerUserId: r.owner_user_id ?? undefined,
  linkedShopId: r.linked_shop_id ?? undefined,
});

const toPayload = (r: Partial<Roaster>) => {
  const p: Record<string, unknown> = {};
  if (r.name !== undefined) p.name = r.name;
  if (r.description !== undefined) p.description = r.description;
  if (r.bio !== undefined) p.bio = r.bio ?? null;
  if (r.lat !== undefined) p.lat = r.lat;
  if (r.lng !== undefined) p.lng = r.lng;
  if (r.address !== undefined) p.address = r.address ?? null;
  if (r.country !== undefined) p.country = r.country ?? null;
  if (r.amenities !== undefined) p.amenities = r.amenities ?? {};
  if (r.phone !== undefined) p.phone = r.phone ?? null;
  if (r.whatsapp !== undefined) p.whatsapp = r.whatsapp ?? null;
  if (r.website !== undefined) p.website = r.website ?? null;
  if (r.email !== undefined) p.email = r.email ?? null;
  if (r.facebook !== undefined) p.facebook = r.facebook ?? null;
  if (r.instagram !== undefined) p.instagram = r.instagram ?? null;
  if (r.twitter !== undefined) p.twitter = r.twitter ?? null;
  if (r.opening_hours !== undefined) p.opening_hours = r.opening_hours ?? null;
  if (r.affiliateLinks !== undefined) p.affiliate_links = r.affiliateLinks ?? [];
  if (r.banner !== undefined) p.banner = r.banner ?? null;
  if (r.avatar !== undefined) p.avatar = r.avatar ?? null;
  if (r.offersFreeShipping !== undefined) p.offers_free_shipping = !!r.offersFreeShipping;
  if (r.hasDiscountCoupons !== undefined) p.has_discount_coupons = !!r.hasDiscountCoupons;
  if (r.status !== undefined) p.status = r.status;
  if (r.createdBy !== undefined) p.created_by = r.createdBy ?? null;
  if (r.ownerUserId !== undefined) p.owner_user_id = r.ownerUserId ?? null;
  return p;
};

export const ROASTERS = (): Roaster[] =>
  Array.from(cache.values()).sort((a, b) => a.name.localeCompare(b.name));

export const getRoasterById = (id: string | undefined): Roaster | undefined =>
  id ? cache.get(id) : undefined;

export const getRoasterWithOverrides = getRoasterById;

export const subscribeRoasters = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const loadRoastersFromDb = async () => {
  try {
    const { data, error } = await supabase
      .from("roasters_public" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error || !data) return;
    cache.clear();
    for (const r of data as any[]) cache.set(r.id, fromRow(r));
    notify();
    bindRealtime();
  } catch (e) {
    console.error("[loadRoastersFromDb] failed:", e);
  }
};

const bindRealtime = () => {
  if (realtimeBound) return;
  realtimeBound = true;
  const ch = supabase
    .channel(`roasters:realtime:${Math.random().toString(36).slice(2)}`)
    .on(
      "postgres_changes" as any,
      { event: "*", schema: "public", table: "roasters" },
      (payload: any) => {
        const row = payload.new ?? payload.old;
        if (!row?.id) return;
        if (payload.eventType === "DELETE") cache.delete(row.id);
        else cache.set(row.id, fromRow(payload.new));
        notify();
      },
    )
    .subscribe();
  // best-effort cleanup on page unload
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      supabase.removeChannel(ch);
    });
  }
};

export const addRoaster = async (
  input: Omit<Roaster, "id" | "baseRating" | "baseReviewCount" | "pendingReview">,
): Promise<Roaster | null> => {
  const payload = {
    ...toPayload(input),
    base_rating: 0,
    base_review_count: 0,
    status: input.status ?? "pending",
  };
  const { data, error } = await supabase
    .from("roasters")
    .insert(payload as any)
    .select("*")
    .single();
  if (error || !data) {
    console.error("[addRoaster] insert failed:", error?.message);
    throw new Error(error?.message ?? "Could not create roaster");
  }
  const r = fromRow(data);
  cache.set(r.id, r);
  notify();
  return r;
};

export const updateRoaster = async (id: string, patch: Partial<Roaster>) => {
  const { data, error } = await supabase
    .from("roasters")
    .update(toPayload(patch) as any)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Update failed");
  cache.set(id, fromRow(data));
  notify();
};

export const setRoasterStatus = async (
  id: string,
  status: "approved" | "rejected" | "pending",
) => {
  await updateRoaster(id, { status });
};

export const deleteRoaster = async (id: string) => {
  const { error } = await supabase.from("roasters").delete().eq("id", id);
  if (error) throw new Error(error.message);
  cache.delete(id);
  notify();
};
