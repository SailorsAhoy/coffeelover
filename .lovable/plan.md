## Goal

Three deliverables:

1. **Extend the "New Shop" form so all fields render, gated by a DB-backed permission matrix.**
2. **Admin dashboard panel to toggle each field (per category × per role) on/off.**
3. **Fix bugs**: admin Shop Management shows 4 hardcoded shops (should show all 8 + any added); Edit buttons in admin list and on ShopProfile don't open the edit form.

---

## 1. Field Permission Matrix (DB)

New table `field_permissions`:

- `category` text — one of `shop`, `roaster`, `beans`, `equipment`
- `role` text — `admin`, `owner`, `roaster`, `coffee_shop`, `producer`, `user`
- `field_key` text — e.g. `phone`, `banner`, `affiliateLinks`
- `can_edit` boolean
- unique (category, role, field_key)

Seed rows for the **shop** category covering every shop form field, with sensible defaults (admin/owner = all, user = `name/type/description/bio/address/priceLevel/amenities/hours` only). Other categories seeded as empty for now (admin panel can populate later).

RLS:
- `SELECT` for everyone (cheap, drives form rendering).
- `INSERT/UPDATE/DELETE` admin-only via `has_role('admin')`.
- GRANTs: `anon`, `authenticated` SELECT; `service_role` ALL; `authenticated` INSERT/UPDATE/DELETE (gated by RLS).

Client helper `useFieldPermissions(category)` returns `{ can(field): boolean }` for the current user's highest applicable role.

## 2. ShopCreateSheet — render all fields, gate by matrix

- Render every field (banner, avatar, contact block, socials, hours, affiliate links) for all authenticated users.
- Wrap each gated section in `{canField('banner') && …}` driven by the matrix.
- Same treatment for `ShopEditSheet`.
- If a user lacks permission for a field, it is simply not rendered (not just disabled).

## 3. Admin permissions panel

New page `src/pages/settings/FieldPermissions.tsx`:

- Category tabs: Shop / Roaster / Beans / Equipment.
- Inside each, a table of `field × role` with checkboxes.
- Edits write straight to `field_permissions` via Supabase.
- Linked from `AdminDashboard` and Settings nav.

For non-shop categories we register field lists in code (`src/lib/fieldRegistry.ts`) — easy to extend later.

## 4. Bug fixes

**Shop Management list (`src/pages/settings/ShopManagement.tsx`)** — currently hardcoded:
- Replace static array with `SHOPS.map(getShopWithOverrides)` so all 8 (+ user-added) appear.
- Wire the Edit button to open `ShopEditSheet` for that shop.
- Wire Delete (admin-only) via a new `deleteShop(id)` in `shopsData.ts`.
- Add search + type-filter behavior to actually filter the live list.

**ShopProfile edit button**: confirm `ShopEditSheet` is mounted and visible to owners/admins; if `can("list_shop")` gating blocks admins, switch to `isOwner || hasRole("admin")`.

**8 vs 4 reconciliation**: The "DB" for shops is the in-memory `SHOPS` array (8 entries). The admin page just hardcoded 4 names. After fix #1 above, the admin list will reflect the same 8 the public page shows. No DB seeding needed — there is no shops table.

---

## Files

- **new**: `supabase/migrations/<ts>_field_permissions.sql`
- **new**: `src/hooks/useFieldPermissions.ts`
- **new**: `src/lib/fieldRegistry.ts`
- **new**: `src/pages/settings/FieldPermissions.tsx`
- **edit**: `src/components/shops/ShopCreateSheet.tsx` — remove `isOwner ?` gating, use matrix
- **edit**: `src/components/shops/ShopEditSheet.tsx` — same
- **edit**: `src/pages/settings/ShopManagement.tsx` — live data + working Edit/Delete
- **edit**: `src/lib/shopsData.ts` — add `deleteShop(id)`
- **edit**: `src/pages/dashboard/AdminDashboard.tsx` + sidebar — link to new panel
- **edit**: `src/App.tsx` — route for `/settings/field-permissions`

## Out of scope

- Migrating mock shops into a real Supabase `shops` table (the project is still mock-shop-based; only `coffee_shop_profiles` exists and isn't wired to the directory).
- Building full Roaster/Beans/Equipment create forms — the matrix table is ready, only Shop forms consume it now.

Confirm and I'll build, or tell me what to adjust.