/**
 * Static registry of editable fields per category. Used by the admin
 * Field Permissions panel to know which checkboxes to render, and by
 * forms as the canonical list of field_keys.
 */
export type FieldCategory = "shop" | "roaster" | "beans" | "equipment";

export interface FieldDef {
  key: string;
  label: string;
  /** Logical group inside the form (purely for the admin UI). */
  group?: string;
}

export const FIELD_REGISTRY: Record<FieldCategory, FieldDef[]> = {
  shop: [
    { key: "name", label: "Name", group: "Basics" },
    { key: "type", label: "Type", group: "Basics" },
    { key: "priceLevel", label: "Price level", group: "Basics" },
    { key: "description", label: "Short description", group: "Basics" },
    { key: "bio", label: "Bio", group: "Basics" },
    { key: "address", label: "Address", group: "Basics" },
    { key: "amenities", label: "Amenities", group: "Basics" },
    { key: "opening_hours", label: "Opening hours", group: "Basics" },
    { key: "banner", label: "Banner image", group: "Media" },
    { key: "avatar", label: "Avatar image", group: "Media" },
    { key: "phone", label: "Phone", group: "Contact" },
    { key: "whatsapp", label: "WhatsApp", group: "Contact" },
    { key: "email", label: "Email", group: "Contact" },
    { key: "website", label: "Website", group: "Contact" },
    { key: "instagram", label: "Instagram", group: "Social" },
    { key: "facebook", label: "Facebook", group: "Social" },
    { key: "twitter", label: "Twitter/X", group: "Social" },
    { key: "affiliateLinks", label: "Affiliate links", group: "Commerce" },
  ],
  roaster: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "logo", label: "Logo" },
    { key: "website", label: "Website" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
    { key: "offers_free_shipping", label: "Free shipping" },
    { key: "has_discount_coupons", label: "Discount coupons" },
  ],
  beans: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "origin_country", label: "Origin" },
    { key: "roast_level", label: "Roast level" },
    { key: "price_per_kg", label: "Price / kg" },
    { key: "image", label: "Image" },
    { key: "affiliate_link", label: "Affiliate link" },
  ],
  equipment: [
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "image", label: "Image" },
    { key: "seller_url", label: "Seller URL" },
  ],
};

/** Roles surfaced in the admin permissions matrix. */
export const PERMISSION_ROLES = [
  "admin",
  "owner",
  "roaster",
  "coffee_shop",
  "producer",
  "user",
] as const;
export type PermissionRole = (typeof PERMISSION_ROLES)[number];
