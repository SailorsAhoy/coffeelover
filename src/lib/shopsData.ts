import type { OpeningHours } from "@/lib/shopUtils";
import type { AmenityKey } from "@/lib/shopAmenities";

export type ShopType = "veggie" | "bakery" | "coffee_shop" | "roaster_shop";

export interface AffiliateLink {
  id: string;
  label: string;
  url: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

export type Amenities = Partial<Record<AmenityKey, boolean>>;

export interface Shop {
  id: number;
  /** Deterministic UUID used as reviewable_id in the reviews table. */
  reviewableId: string;
  name: string;
  description: string;
  /** Longer-form story shown in the Bio tab. */
  bio?: string;
  type: ShopType;
  lat: number;
  lng: number;
  address: string;
  /** 1-4, mirrors $ – $$$$ */
  priceLevel: 1 | 2 | 3 | 4;
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
  image?: string;
  banner?: string;
  avatar?: string;
  staff?: StaffMember[];
  /** legacy alias for status === 'pending' */
  pendingReview?: boolean;
  status?: "pending" | "approved" | "rejected";
  createdBy?: string;
  createdByName?: string;
}

const uuid = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

const stdHours: OpeningHours = {
  monday: { open: "07:00", close: "20:00" },
  tuesday: { open: "07:00", close: "20:00" },
  wednesday: { open: "07:00", close: "20:00" },
  thursday: { open: "07:00", close: "20:00" },
  friday: { open: "07:00", close: "22:00" },
  saturday: { open: "08:00", close: "22:00" },
  sunday: { open: "08:00", close: "18:00" },
};

export const SHOPS: Shop[] = [
  {
    id: 1,
    reviewableId: uuid(1),
    name: "Artisan Coffee House",
    description: "Single-origin pour-overs and artisanal espresso.",
    bio: "Founded in 2014, Artisan Coffee House sources beans directly from small farms across Ethiopia, Colombia and Guatemala. Our baristas brew everything by hand, from V60 to espresso, and we host monthly cuppings open to the public.",
    type: "coffee_shop",
    lat: 40.7589,
    lng: -73.9851,
    address: "123 Main Street, Midtown, New York, NY",
    priceLevel: 3,
    baseRating: 4.8,
    baseReviewCount: 142,
    amenities: { wifi: true, bakery: true, takeaway: true, dineIn: true, bikeParking: true },
    phone: "+12125550101",
    whatsapp: "+12125550101",
    website: "https://example.com",
    email: "hello@artisan.coffee",
    instagram: "https://instagram.com/artisan",
    opening_hours: stdHours,
    banner:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=70&auto=format",
    staff: [
      { id: "s1", name: "Maya Chen", role: "Head Barista", email: "maya@artisan.coffee" },
      { id: "s2", name: "Diego Romero", role: "Roaster" },
      { id: "s3", name: "Lila Park", role: "Shift Lead" },
    ],
    affiliateLinks: [
      { id: "a1", label: "Order on Uber Eats", url: "https://ubereats.com" },
      { id: "a2", label: "Buy beans online", url: "https://example.com/shop" },
    ],
  },
  {
    id: 2,
    reviewableId: uuid(2),
    name: "The Bean Scene",
    description: "Modern café with a sunny outdoor patio.",
    type: "coffee_shop",
    lat: 40.7614,
    lng: -73.9776,
    address: "55 Park Ave, Midtown East, New York, NY",
    priceLevel: 2,
    baseRating: 4.6,
    baseReviewCount: 88,
    amenities: { wifi: true, outdoor: true, petFriendly: true, dineIn: true, takeaway: true },
    phone: "+12125550102",
    instagram: "https://instagram.com",
    opening_hours: { ...stdHours, sunday: { open: "00:00", close: "00:00", closed: true } },
  },
  {
    id: 3,
    reviewableId: uuid(3),
    name: "Brooklyn Roast & Shop",
    description: "In-house roastery with rotating guest beans.",
    type: "roaster_shop",
    lat: 40.7489,
    lng: -73.968,
    address: "210 Roebling St, Williamsburg, Brooklyn, NY",
    priceLevel: 3,
    baseRating: 4.9,
    baseReviewCount: 203,
    amenities: { wifi: true, bikeParking: true, takeaway: true, dineIn: true },
    phone: "+12125550103",
    website: "https://example.com",
    opening_hours: stdHours,
    affiliateLinks: [
      { id: "a1", label: "Subscribe to monthly beans", url: "https://example.com/sub" },
    ],
  },
  {
    id: 4,
    reviewableId: uuid(4),
    name: "Manhattan Roastery",
    description: "Premium small-batch roastery and bakery.",
    type: "roaster_shop",
    lat: 40.74,
    lng: -73.99,
    address: "8 W 18th St, Flatiron, New York, NY",
    priceLevel: 4,
    baseRating: 4.9,
    baseReviewCount: 311,
    amenities: { bakery: true, wheelchairAccessible: true, dineIn: true, takeaway: true },
    phone: "+12125550104",
    opening_hours: stdHours,
  },
  {
    id: 5,
    reviewableId: uuid(5),
    name: "Green Leaf Café",
    description: "Plant-based menu and specialty coffee.",
    type: "veggie",
    lat: 40.7505,
    lng: -73.9934,
    address: "402 8th Ave, Chelsea, New York, NY",
    priceLevel: 2,
    baseRating: 4.5,
    baseReviewCount: 64,
    amenities: {
      wifi: true,
      outdoor: true,
      veganOptions: true,
      petFriendly: true,
      bikeParking: true,
      dineIn: true,
    },
    opening_hours: stdHours,
  },
  {
    id: 6,
    reviewableId: uuid(6),
    name: "Vegan Vibes Coffee",
    description: "Cozy vegan-friendly spot for remote work.",
    type: "veggie",
    lat: 40.752,
    lng: -73.975,
    address: "77 E 42nd St, Midtown, New York, NY",
    priceLevel: 2,
    baseRating: 4.6,
    baseReviewCount: 51,
    amenities: { wifi: true, veganOptions: true, takeaway: true, dineIn: true },
    opening_hours: stdHours,
  },
  {
    id: 7,
    reviewableId: uuid(7),
    name: "Pastry & Pour",
    description: "Bakery-first with serious espresso programme.",
    type: "bakery",
    lat: 40.765,
    lng: -73.97,
    address: "1 Central Park S, Midtown, New York, NY",
    priceLevel: 3,
    baseRating: 4.7,
    baseReviewCount: 119,
    amenities: { bakery: true, takeaway: true, dineIn: true, wheelchairAccessible: true },
    opening_hours: stdHours,
  },
  {
    id: 8,
    reviewableId: uuid(8),
    name: "Sweet Bean Bakery",
    description: "Croissants, sourdough and slow-bar coffee.",
    type: "bakery",
    lat: 40.7549,
    lng: -73.984,
    address: "350 5th Ave, Midtown, New York, NY",
    priceLevel: 1,
    baseRating: 4.8,
    baseReviewCount: 96,
    amenities: { bakery: true, outdoor: true, bikeParking: true, takeaway: true },
    opening_hours: stdHours,
    affiliateLinks: [
      { id: "a1", label: "Order on DoorDash", url: "https://doordash.com" },
    ],
  },
];

export const SHOP_TYPE_LABEL: Record<ShopType, string> = {
  veggie: "Vegan Café",
  bakery: "Bakery",
  coffee_shop: "Coffee Shop",
  roaster_shop: "Roastery",
};

export const SHOP_TYPE_COLOR: Record<ShopType, string> = {
  veggie: "#10b981",
  bakery: "#f59e0b",
  coffee_shop: "#8B4513",
  roaster_shop: "#ef4444",
};

export const getShopById = (id: number | string) =>
  SHOPS.find((s) => String(s.id) === String(id));

/**
 * In-memory overrides for shop edits made through the UI.
 * Persists for the lifetime of the page since mock shops have no backend yet.
 */
const overrides = new Map<number, Partial<Shop>>();
const listeners = new Set<() => void>();

export const getShopWithOverrides = (id: number | string): Shop | undefined => {
  const base = getShopById(id);
  if (!base) return undefined;
  const o = overrides.get(base.id);
  return o ? { ...base, ...o } : base;
};

export const updateShopOverride = (id: number, patch: Partial<Shop>) => {
  const current = overrides.get(id) ?? {};
  overrides.set(id, { ...current, ...patch });
  listeners.forEach((l) => l());
};

export const subscribeShopOverrides = (cb: () => void): (() => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const addShop = (shop: Omit<Shop, "id" | "reviewableId">): Shop => {
  const nextId = SHOPS.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  const created: Shop = {
    ...shop,
    id: nextId,
    reviewableId: uuid(nextId),
    status: shop.status ?? "pending",
    pendingReview: shop.pendingReview ?? true,
  };
  SHOPS.unshift(created);
  listeners.forEach((l) => l());
  return created;
};

export const setShopStatus = (
  id: number,
  status: "approved" | "rejected" | "pending",
) => {
  updateShopOverride(id, {
    status,
    pendingReview: status === "pending",
  });
};

