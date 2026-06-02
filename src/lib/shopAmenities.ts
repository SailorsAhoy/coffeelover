import {
  Wifi,
  Croissant,
  TreePine,
  Bike,
  Dog,
  Accessibility,
  ShoppingBag,
  Utensils,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export type AmenityKey =
  | "wifi"
  | "bakery"
  | "outdoor"
  | "bikeParking"
  | "petFriendly"
  | "wheelchairAccessible"
  | "takeaway"
  | "dineIn"
  | "veganOptions";

export interface AmenityDef {
  key: AmenityKey;
  label: string;
  short: string;
  icon: LucideIcon;
}

export const AMENITIES: AmenityDef[] = [
  { key: "wifi", label: "Free Wi-Fi", short: "Wi-Fi", icon: Wifi },
  { key: "bakery", label: "Bakery on-site", short: "Bakery", icon: Croissant },
  { key: "outdoor", label: "Outdoor seating", short: "Outdoor", icon: TreePine },
  { key: "bikeParking", label: "Bike parking", short: "Bike", icon: Bike },
  { key: "petFriendly", label: "Pet friendly", short: "Pets", icon: Dog },
  {
    key: "wheelchairAccessible",
    label: "Wheelchair accessible",
    short: "Accessible",
    icon: Accessibility,
  },
  { key: "takeaway", label: "Takeaway", short: "Takeaway", icon: ShoppingBag },
  { key: "dineIn", label: "Dine-in", short: "Dine-in", icon: Utensils },
  { key: "veganOptions", label: "Vegan options", short: "Vegan", icon: Leaf },
];

export const AMENITY_MAP: Record<AmenityKey, AmenityDef> = Object.fromEntries(
  AMENITIES.map((a) => [a.key, a]),
) as Record<AmenityKey, AmenityDef>;
