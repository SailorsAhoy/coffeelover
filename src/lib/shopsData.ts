import type { OpeningHours } from "@/lib/shopUtils";

export type ShopType = "veggie" | "bakery" | "coffee_shop" | "roaster_shop";

export interface Shop {
  id: number;
  /** Deterministic UUID used as reviewable_id in the reviews table. */
  reviewableId: string;
  name: string;
  description: string;
  type: ShopType;
  lat: number;
  lng: number;
  address: string;
  /** 1-4, mirrors $ – $$$$ */
  priceLevel: 1 | 2 | 3 | 4;
  baseRating: number;
  baseReviewCount: number;
  hasWifi?: boolean;
  hasBakery?: boolean;
  hasOutdoor?: boolean;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  opening_hours: OpeningHours;
  image?: string;
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
    type: "coffee_shop",
    lat: 40.7589,
    lng: -73.9851,
    address: "123 Main Street, Midtown",
    priceLevel: 3,
    baseRating: 4.8,
    baseReviewCount: 142,
    hasWifi: true,
    hasBakery: true,
    phone: "+12125550101",
    whatsapp: "+12125550101",
    website: "https://example.com",
    email: "hello@artisan.coffee",
    opening_hours: stdHours,
  },
  {
    id: 2,
    reviewableId: uuid(2),
    name: "The Bean Scene",
    description: "Modern café with a sunny outdoor patio.",
    type: "coffee_shop",
    lat: 40.7614,
    lng: -73.9776,
    address: "55 Park Ave, Midtown East",
    priceLevel: 2,
    baseRating: 4.6,
    baseReviewCount: 88,
    hasWifi: true,
    hasOutdoor: true,
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
    address: "210 Roebling St, Williamsburg",
    priceLevel: 3,
    baseRating: 4.9,
    baseReviewCount: 203,
    hasWifi: true,
    phone: "+12125550103",
    website: "https://example.com",
    opening_hours: stdHours,
  },
  {
    id: 4,
    reviewableId: uuid(4),
    name: "Manhattan Roastery",
    description: "Premium small-batch roastery and bakery.",
    type: "roaster_shop",
    lat: 40.74,
    lng: -73.99,
    address: "8 W 18th St, Flatiron",
    priceLevel: 4,
    baseRating: 4.9,
    baseReviewCount: 311,
    hasBakery: true,
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
    address: "402 8th Ave, Chelsea",
    priceLevel: 2,
    baseRating: 4.5,
    baseReviewCount: 64,
    hasWifi: true,
    hasOutdoor: true,
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
    address: "77 E 42nd St, Midtown",
    priceLevel: 2,
    baseRating: 4.6,
    baseReviewCount: 51,
    hasWifi: true,
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
    address: "1 Central Park S, Midtown",
    priceLevel: 3,
    baseRating: 4.7,
    baseReviewCount: 119,
    hasBakery: true,
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
    address: "350 5th Ave, Midtown",
    priceLevel: 1,
    baseRating: 4.8,
    baseReviewCount: 96,
    hasBakery: true,
    hasOutdoor: true,
    opening_hours: stdHours,
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
