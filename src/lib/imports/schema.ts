// Schema definitions driving the generic CSV importer.
export type FieldType = "string" | "number" | "boolean" | "json" | "csv-array";

export interface ParentRef {
  /** Supabase table to look the parent up in. */
  table: string;
  /** Columns to try in order (e.g. ["id","slug","name"]). */
  matchColumns: string[];
  /** Human label used in error messages. */
  label: string;
}

export interface FieldDef {
  key: string;
  type?: FieldType; // default string
  required?: boolean;
  example?: string;
  /** If set, value is resolved against this parent table and stored in `key`. */
  parent?: ParentRef;
  description?: string;
}

export interface CategorySchema {
  key: string; // url slug
  label: string;
  table: string; // target Supabase table
  description: string;
  fields: FieldDef[];
  /** At least one of these field-keys must resolve. */
  oneOfParents?: string[];
  /** Auto-slug from this field if `slug` empty. */
  slugFrom?: string;
  /** Parent categories whose existing rows can be exported as a reference CSV. */
  parentExports?: { label: string; table: string; columns: string[] }[];
}

const C = (k: string, opts: Partial<FieldDef> = {}): FieldDef => ({ key: k, ...opts });

export const CATEGORIES: CategorySchema[] = [
  {
    key: "shops",
    label: "Shops",
    table: "shops",
    description: "Coffee shops, bakeries, vegan cafés and roaster-shops. No parent required.",
    slugFrom: "name",
    fields: [
      C("name", { required: true, example: "Artisan Coffee House" }),
      C("slug", { example: "artisan-coffee-house" }),
      C("type", { example: "coffee_shop", description: "coffee_shop | bakery | veggie | roaster_shop" }),
      C("description", { example: "Single-origin pour-overs" }),
      C("bio"),
      C("lat", { type: "number", example: "40.7589" }),
      C("lng", { type: "number", example: "-73.9851" }),
      C("address", { example: "123 Main St, New York, NY" }),
      C("country", { example: "USA" }),
      C("price_level", { type: "number", example: "3" }),
      C("base_rating", { type: "number", example: "4.8" }),
      C("base_review_count", { type: "number", example: "142" }),
      C("amenities", { type: "json", example: '{"wifi":true,"bakery":true}' }),
      C("phone"), C("whatsapp"), C("website"), C("email"),
      C("facebook"), C("instagram"), C("twitter"),
      C("opening_hours", { type: "json" }),
      C("banner"), C("avatar"),
      C("status", { example: "approved" }),
    ],
  },
  {
    key: "roasters",
    label: "Roasters",
    table: "roasters",
    description: "Independent roasteries. No parent required.",
    slugFrom: "name",
    fields: [
      C("name", { required: true, example: "Brooklyn Roast Co" }),
      C("slug"),
      C("description"),
      C("lat", { type: "number" }), C("lng", { type: "number" }),
      C("address"), C("country"),
      C("logo_url"), C("banner_url"), C("website"),
      C("phone"), C("whatsapp"), C("email"),
      C("facebook"), C("instagram"), C("twitter"),
      C("offers_free_shipping", { type: "boolean" }),
      C("has_discount_coupons", { type: "boolean" }),
      C("status", { example: "approved" }),
    ],
  },
  {
    key: "manufacturers",
    label: "Manufacturers",
    table: "manufacturers",
    description: "Equipment manufacturers. No parent required.",
    slugFrom: "business_name",
    fields: [
      C("business_name", { required: true, example: "La Marzocco" }),
      C("slug"),
      C("description"), C("logo_url"), C("website_url"),
      C("email"), C("phone"), C("country"),
    ],
  },
  {
    key: "service-companies",
    label: "Service Companies",
    table: "service_companies",
    description: "Equipment sales, services, or academy providers. No parent required.",
    slugFrom: "business_name",
    fields: [
      C("business_name", { required: true, example: "BaristaPro Services" }),
      C("slug"),
      C("category", { required: true, example: "services", description: "equipment_sales | services | academy" }),
      C("description"), C("logo_url"), C("website_url"),
      C("email"), C("phone"), C("country"),
    ],
  },
  {
    key: "academies",
    label: "Academies",
    table: "academies",
    description: "Barista academies. No parent required.",
    slugFrom: "name",
    fields: [
      C("name", { required: true, example: "SCA Lab" }),
      C("slug"),
      C("description"), C("logo_url"), C("website_url"), C("country"),
    ],
  },
  {
    key: "instructors",
    label: "Instructors",
    table: "instructors",
    description: "Course instructors. Optionally linked to an academy.",
    slugFrom: "name",
    parentExports: [{ label: "Academies", table: "academies", columns: ["id", "slug", "name"] }],
    fields: [
      C("name", { required: true, example: "Jane Doe" }),
      C("slug"),
      C("bio"), C("photo_url"), C("email"),
      C("academy_id", {
        example: "sca-lab OR uuid",
        parent: { table: "academies", matchColumns: ["id", "slug", "name"], label: "Academy" },
      }),
    ],
  },
  {
    key: "coffees",
    label: "Coffees",
    table: "coffee_brands",
    description: "Coffee products. Must reference a roaster OR a shop (at least one).",
    slugFrom: "name",
    oneOfParents: ["roaster_id", "shop_id"],
    parentExports: [
      { label: "Roasters", table: "roasters", columns: ["id", "slug", "name"] },
      { label: "Shops", table: "shops", columns: ["id", "slug", "name"] },
    ],
    fields: [
      C("name", { required: true, example: "Ethiopia Yirgacheffe" }),
      C("description"),
      C("roaster_id", {
        example: "brooklyn-roast-co OR uuid",
        parent: { table: "roasters", matchColumns: ["id", "slug", "name"], label: "Roaster" },
      }),
      C("shop_id", {
        example: "artisan-coffee-house OR uuid",
        parent: { table: "shops", matchColumns: ["id", "slug", "name"], label: "Shop" },
      }),
      C("origin_country", { example: "Ethiopia" }),
      C("roast_level", { example: "light" }),
      C("coffee_type", { example: "arabica" }),
      C("price_per_kg", { type: "number" }),
      C("image_url"), C("affiliate_link"),
      C("is_available", { type: "boolean" }),
    ],
  },
  {
    key: "equipment",
    label: "Equipment",
    table: "machines",
    description: "Espresso machines and accessories. Must reference a manufacturer OR a service company.",
    oneOfParents: ["manufacturer_id", "service_company_id"],
    parentExports: [
      { label: "Manufacturers", table: "manufacturers", columns: ["id", "slug", "business_name"] },
      { label: "Service Companies", table: "service_companies", columns: ["id", "slug", "business_name"] },
    ],
    fields: [
      C("name", { required: true, example: "Linea Mini" }),
      C("machine_type", { required: true, example: "espresso_machine", description: "espresso_machine | grinder | brewer | accessory" }),
      C("description"),
      C("price", { type: "number" }),
      C("image_url"), C("seller_url"),
      C("manufacturer_id", {
        example: "la-marzocco OR uuid",
        parent: { table: "manufacturers", matchColumns: ["id", "slug", "business_name"], label: "Manufacturer" },
      }),
      C("service_company_id", {
        example: "baristapro-services OR uuid",
        parent: { table: "service_companies", matchColumns: ["id", "slug", "business_name"], label: "Service Company" },
      }),
    ],
  },
  {
    key: "staff",
    label: "Staff",
    table: "shop_staff",
    description: "Baristas and roastery staff. Must reference a shop OR a roaster.",
    oneOfParents: ["shop_id", "roaster_id"],
    parentExports: [
      { label: "Shops", table: "shops", columns: ["id", "slug", "name"] },
      { label: "Roasters", table: "roasters", columns: ["id", "slug", "name"] },
    ],
    fields: [
      C("name", { required: true, example: "Maya Chen" }),
      C("role", { required: true, example: "Head Barista" }),
      C("bio"),
      C("photo_path"),
      C("shop_id", {
        example: "artisan-coffee-house OR uuid",
        parent: { table: "shops", matchColumns: ["id", "slug", "name"], label: "Shop" },
      }),
      C("roaster_id", {
        example: "brooklyn-roast-co OR uuid",
        parent: { table: "roasters", matchColumns: ["id", "slug", "name"], label: "Roaster" },
      }),
    ],
  },
  {
    key: "courses",
    label: "Courses",
    table: "courses",
    description: "Academy courses. Must reference an instructor OR an academy.",
    slugFrom: "title",
    oneOfParents: ["instructor_id", "academy_id"],
    parentExports: [
      { label: "Instructors", table: "instructors", columns: ["id", "slug", "name"] },
      { label: "Academies", table: "academies", columns: ["id", "slug", "name"] },
    ],
    fields: [
      C("title", { required: true, example: "Espresso Fundamentals" }),
      C("slug"),
      C("description"),
      C("level", { example: "beginner" }),
      C("duration_min", { type: "number", example: "120" }),
      C("image_url"),
      C("instructor_id", {
        example: "jane-doe OR uuid",
        parent: { table: "instructors", matchColumns: ["id", "slug", "name"], label: "Instructor" },
      }),
      C("academy_id", {
        example: "sca-lab OR uuid",
        parent: { table: "academies", matchColumns: ["id", "slug", "name"], label: "Academy" },
      }),
    ],
  },
];

export const getCategory = (key: string) => CATEGORIES.find((c) => c.key === key);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
