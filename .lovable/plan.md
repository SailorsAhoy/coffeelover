## Goal

Admin dashboard gets a full CSV import system covering every directory category, plus the missing tables required to make it coherent (manufacturers, service companies, academies, instructors, courses).

Flow: download template → fill CSV → upload → preview → lenient insert (valid rows committed, invalid rows returned as downloadable error CSV).

---

## 1. New / migrated DB tables

All tables: `id uuid pk`, `created_at`, `updated_at`, RLS = public SELECT, admin ALL, owner manage own (where applicable). All get GRANTs to `anon` (SELECT) + `authenticated` (CRUD) + `service_role` (ALL).

**Migrated from mock data:**
- `public.shops` — full Shop shape (name, slug, type, lat/lng, address, country, price_level, base_rating, base_review_count, amenities jsonb, contacts, socials, opening_hours jsonb, banner, avatar, status, created_by, created_by_role). One-shot data migration inserts the 8 current mock shops.
- `public.roasters` — same treatment for current mock roasters.

**New parent tables:**
- `public.manufacturers` — business_name, slug, description, logo_url, website_url, contacts, country.
- `public.service_companies` — same shape as manufacturers + `category text check in ('equipment_sales','services','academy')`.
- `public.academies` — name, slug, description, logo_url, website_url, country.
- `public.instructors` — name, slug, bio, photo_url, academy_id fk (nullable).
- `public.courses` — title, slug, description, level, duration_min, instructor_id fk (nullable), academy_id fk (nullable). Check: instructor_id OR academy_id NOT NULL.

**Existing tables reused:**
- Coffees → existing `coffee_brands` (extend with `shop_id` nullable fk so a coffee can belong to a shop or a roaster).
- Equipment → existing `machines` + `accessories`; importer routes by `equipment_kind` column. Add `service_company_id` nullable fk to both.
- Staff → existing `shop_staff` (also accept `roaster_id` — add nullable column).

## 2. Generic CSV import engine

`src/lib/imports/` :
- `papaparse` for parsing.
- `schema.ts` — per-category descriptor: `{ table, columns: [{key, required, type, parentRef?}], slugFrom, sampleRow }`. `parentRef` = `{ table, column, label }` so the resolver looks up by uuid OR slug OR name.
- `resolver.ts` — for each `parentRef` value, try uuid match, then slug, then case-insensitive name. Ambiguous → row error.
- `validate.ts` — type coercion (numbers, booleans, json, csv arrays), required check, parent resolution.
- `runImport.ts` — chunked inserts (100 rows) via Supabase; per-row try/catch; returns `{ inserted, skipped, errors: [{row, reason, original}] }`.
- `template.ts` — generates a CSV template (header row + one example row + a `# instructions` comment row) using the schema.

## 3. Admin UI

New route `/settings/imports` with category cards. Each card opens `/settings/imports/:category`:

- Title + short blurb (e.g. "Staff require an existing shop_id or roaster_id").
- Buttons: **Download template**, **Download parents CSV** (where applicable — exports id+slug+name of valid parents), **Upload CSV**.
- Drop zone → parse → preview table (first 20 rows + counts).
- "Import" button → runs lenient insert → toast with `X inserted, Y skipped` + auto-download of `errors.csv` if any failed.

Sidebar in `Settings.tsx` gets new "Bulk Imports" entry. `AdminDashboard.tsx` gets a shortcut KPI card linking there.

## 4. Categories shipped (10)

| Category | Table | Required parents |
|---|---|---|
| Shops | `shops` | — |
| Roasters | `roasters` | — |
| Manufacturers | `manufacturers` | — |
| Service Companies | `service_companies` | — (has own `category` field) |
| Academies | `academies` | — |
| Instructors | `instructors` | `academy_id` (optional) |
| Coffees | `coffee_brands` | `roaster_id` OR `shop_id` (at least one) |
| Equipment | `machines` / `accessories` | `manufacturer_id` OR `service_company_id` (at least one) |
| Staff | `shop_staff` | `shop_id` OR `roaster_id` |
| Courses | `courses` | `instructor_id` OR `academy_id` |

Parent-required rules enforced in `validate.ts`; row rejected if both refs missing or unresolvable.

## 5. Files

**Migrations** (one file): create new tables + GRANTs + RLS + seed `shops`/`roasters` from current `SHOPS`/`ROASTERS` arrays + add columns (`coffee_brands.shop_id`, `machines.service_company_id`, `accessories.service_company_id`, `shop_staff.roaster_id`).

**New code**
- `src/lib/imports/{schema,resolver,validate,template,runImport}.ts`
- `src/pages/settings/Imports.tsx` (category grid)
- `src/pages/settings/ImportCategory.tsx` (one page handles all categories via schema)
- Add route in `src/App.tsx`; add nav entry in `src/pages/Settings.tsx`; add card on `AdminDashboard.tsx`.

**Dependencies:** `papaparse` (+ types).

## 6. Out of scope (for this pass)

- Rewriting Shops/Roasters pages to read from the new `shops`/`roasters` tables — that's a separate cutover; for now both the mock arrays and new tables coexist, so imports populate the DB while the live UI keeps using mocks until the read-side migration is done. (I'll call this out in code with a `// TODO: migrate readers` so it's not forgotten.)
- Bulk update / upsert by id (this iteration is insert-only).
- Image uploads inside CSV (URLs only).
- Per-row admin "fix and retry" UI — errors come back as CSV the admin re-uploads after fixing.

Confirm and I'll build, or tell me what to adjust (e.g. trim categories, switch reader cutover into scope, etc.).
