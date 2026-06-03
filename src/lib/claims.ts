import { supabase } from "@/integrations/supabase/client";

export type ListingType = "shop" | "roaster" | "manufacturer" | "academy" | "service_company";
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface ListingClaim {
  id: string;
  listing_type: ListingType;
  listing_id: string;
  claimant_user_id: string;
  requested_role: "admin" | "user";
  status: ClaimStatus;
  note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const TABLE_BY_TYPE: Record<ListingType, string> = {
  shop: "shops",
  roaster: "roasters",
  manufacturer: "manufacturers",
  academy: "academies",
  service_company: "service_companies",
};

export async function getActiveClaim(type: ListingType, listingId: string) {
  const { data } = await supabase
    .from("listing_claims" as any)
    .select("*")
    .eq("listing_type", type)
    .eq("listing_id", listingId)
    .in("status", ["pending", "approved"])
    .maybeSingle();
  return ((data as unknown) as ListingClaim | null) ?? null;
}

export async function getOwner(type: ListingType, listingId: string): Promise<string | null> {
  const { data } = await (supabase as any)
    .from(TABLE_BY_TYPE[type])
    .select("owner_user_id")
    .eq("id", listingId)
    .maybeSingle();
  return data?.owner_user_id ?? null;
}

export async function submitClaim(opts: {
  type: ListingType;
  listingId: string;
  requestedRole?: "admin" | "user";
  note?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const existing = await getActiveClaim(opts.type, opts.listingId);
  if (existing) throw new Error("A claim already exists for this listing");

  const owner = await getOwner(opts.type, opts.listingId);
  if (owner) throw new Error("This listing is already owned");

  const { error } = await supabase.from("listing_claims" as any).insert({
    listing_type: opts.type,
    listing_id: opts.listingId,
    claimant_user_id: user.id,
    requested_role: opts.requestedRole ?? "user",
    note: opts.note ?? null,
  });
  if (error) throw error;
}

export async function listClaims(opts: { status?: ClaimStatus; mine?: boolean } = {}) {
  let q = supabase.from("listing_claims" as any).select("*").order("created_at", { ascending: false });
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.mine) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [] as ListingClaim[];
    q = q.eq("claimant_user_id", user.id);
  }
  const { data } = await q;
  return ((data ?? []) as unknown) as ListingClaim[];
}

export async function approveClaim(claim: ListingClaim) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error: ownerErr } = await (supabase as any)
    .from(TABLE_BY_TYPE[claim.listing_type])
    .update({ owner_user_id: claim.claimant_user_id })
    .eq("id", claim.listing_id);
  if (ownerErr) throw ownerErr;

  const { error } = await supabase
    .from("listing_claims" as any)
    .update({ status: "approved", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", claim.id);
  if (error) throw error;
}

export async function rejectClaim(claim: ListingClaim, note?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { error } = await supabase
    .from("listing_claims" as any)
    .update({
      status: "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      note: note ?? null,
    })
    .eq("id", claim.id);
  if (error) throw error;
}

export async function fetchListingName(type: ListingType, listingId: string): Promise<string> {
  const { data } = await (supabase as any)
    .from(TABLE_BY_TYPE[type])
    .select("name")
    .eq("id", listingId)
    .maybeSingle();
  return data?.name ?? listingId;
}

export async function searchListings(type: ListingType, q: string) {
  const term = q.trim();
  if (!term) return [] as { id: string; name: string; owner_user_id: string | null }[];
  const { data } = await (supabase as any)
    .from(TABLE_BY_TYPE[type])
    .select("id, name, owner_user_id")
    .ilike("name", `%${term}%`)
    .order("name")
    .limit(20);
  return ((data ?? []) as { id: string; name: string; owner_user_id: string | null }[]);
}

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "shop", label: "Shop" },
  { value: "roaster", label: "Roaster" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "academy", label: "Academy" },
  { value: "service_company", label: "Service company" },
];
