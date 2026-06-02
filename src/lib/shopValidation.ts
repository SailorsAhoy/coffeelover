import { z } from "zod";
import type { Shop } from "@/lib/shopsData";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Client-side file validation used by every upload entry point. */
export const validateImageFile = (
  file: File,
  label = "Image",
): string | null => {
  if (!file.type.startsWith("image/")) return `${label}: must be an image file`;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return `${label}: only JPG, PNG, WEBP or GIF allowed`;
  if (file.size > MAX_IMAGE_BYTES) return `${label}: max file size is 5 MB`;
  return null;
};

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL too long (max 500)")
  .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/i.test(v), "Must be a valid http(s):// URL")
  .optional()
  .or(z.literal(""));

export const affiliateLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Affiliate link: label required").max(60, "Affiliate label too long"),
  url: z.string().trim().url("Affiliate link: must be a valid URL").max(500),
});

/** Used as the canonical persistence-side schema (mock backend). */
export const shopPayloadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(80),
  description: z.string().trim().min(10, "Description must be at least 10 chars").max(280),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address required").max(250),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  lat: z.number().refine((n) => n >= -90 && n <= 90, "Invalid latitude"),
  lng: z.number().refine((n) => n >= -180 && n <= 180, "Invalid longitude"),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  type: z.enum(["veggie", "bakery", "coffee_shop", "roaster_shop"]),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => !v || /^[+\d\s()-]{6,}$/.test(v), "Invalid phone")
    .optional()
    .or(z.literal("")),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email")
    .optional()
    .or(z.literal("")),
  website: optionalUrl,
  instagram: optionalUrl,
  facebook: optionalUrl,
  twitter: optionalUrl,
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

/** Throws a single, user-facing Error if the payload is invalid. */
export const assertValidShop = (input: Partial<Shop>) => {
  // Only validate keys we received (partials allowed for updates).
  const shape = shopPayloadSchema.partial();
  const parsed = shape.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }
};
