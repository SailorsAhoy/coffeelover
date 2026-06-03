## Why the current page breaks

`src/pages/Roasters.tsx` renders a hardcoded mock array with numeric IDs (1–12). `RoasterCard` links to `/roaster/<numId>`, but `RoasterProfile` queries the Supabase `roasters` table by UUID — which currently has 0 rows. Result: every "View Products" click hits "Roaster not found". The Roasters area was never wired to the same data/overrides architecture used by Shops.

## Goal

Mirror Shops' UI + functionality for Roasters end-to-end, sharing as much code as possible. The only structural difference between the two profile pages: Shops has a **Staff** tab; Roasters has a **Products** tab (existing `coffee_brands` assignments stay untouched).

## Scope of work

### 1. Database cleanup (one migration)
- Delete all rows from `roasters` and `coffee_brands` (seed wipe — user asked for this).
- No schema changes needed: `roasters` already mirrors the `shops` field set (banner, avatar, bio, opening_hours, amenities, affiliate_links, status, pending_review, owner_user_id, linked_shop_id, base_rating, base_review_count, lat/lng, contact + social fields).

### 2. Shared data layer
- New `src/lib/roastersData.ts` mirroring `shopsData.ts`: `ROASTERS` in-memory cache, `loadRoastersFromDb`, `getRoasterWithOverrides`, `subscribeRoasterOverrides`, `setRoasterStatus`, `addRoaster`, `updateRoasterOverride`, `deleteRoaster`, type `Roaster`. Same override + realtime patterns.
- New `src/lib/roasterAmenities.ts` (or reuse `shopAmenities` if amenity set is identical — likely reuse and rename keys only if needed).

### 3. Roasters list page (rewrite `src/pages/Roasters.tsx`)
Mirror `Shops.tsx` 1:1:
- Sticky header, search, `ShopFilters`-equivalent (reuse `ShopFilters` or fork into `RoasterFilters` if type taxonomy differs — likely fork to use roaster specialties instead of shop types).
- Status tabs (Approved / Under review / All-for-admins).
- List + Map views (`RoastersMapView` mirroring `ShopsMapView`).
- Sort: distance, newest, rating, reviews, name. (Drop price_asc — roasters don't have priceLevel.)
- Reuse `useReviewAggregates` with `reviewable_type="roaster"`.
- Admin Approve/Reject inline buttons.
- "Create roaster" sheet mirroring `ShopCreateSheet` (new `RoasterCreateSheet`).

### 4. Roaster card
Replace `RoasterCard.tsx`. Mirror the inline list-card layout used inside `Shops.tsx` (compact card with status badge, distance, rating, amenities, directions). Drop the standalone "View Products" button — the whole card is the link to `/roaster/:id`, same as Shops.

### 5. Roaster profile page (rewrite `src/pages/RoasterProfile.tsx`)
Mirror `ShopProfile.tsx`:
- Uses `getRoasterWithOverrides` + `subscribeRoasterOverrides`.
- Banner (`RoasterBanner` mirroring `ShopBanner`), claim badge, pending/rejected admin actions, address card, gallery, affiliate links card.
- Tabs: **Bio · Products · Hours · Reviews** (Products replaces Staff). Products tab lists `coffee_brands` for that roaster (already implemented logic — preserve).
- Reviews uses `reviewable_type="roaster"`.

### 6. Edit sheet
New `RoasterEditSheet` mirroring `ShopEditSheet` so claimed owners / admins can edit the same field set.

### 7. Field permissions
Already present in `fieldRegistry.ts` for `"roaster"`. No change.

### 8. Cleanup
- Remove the mock `mockRoasters` array.
- Update any imports that referenced the old `RoasterCard` numeric-id props.
- Keep `RoasterMapModal` or replace with `RoastersMapView` to match Shops.

## Files touched

```text
NEW:    supabase/migrations/<ts>_wipe_roasters_seed.sql
NEW:    src/lib/roastersData.ts
NEW:    src/components/shops/RoasterCreateSheet.tsx
NEW:    src/components/shops/RoasterEditSheet.tsx
NEW:    src/components/shops/RoasterBanner.tsx
NEW:    src/components/shops/RoastersMapView.tsx
NEW:    src/components/RoasterFilters.tsx (or reuse ShopFilters)
REWRITE: src/pages/Roasters.tsx
REWRITE: src/pages/RoasterProfile.tsx
REWRITE: src/components/RoasterCard.tsx (or delete + inline like Shops)
KEEP:    coffee_brands assignments, ClaimButton, LinkedListingButton, CloneAcrossTypeButton, ShopReviews (already accepts roaster type)
```

## Confirmations needed before I start

1. **Wipe scope**: OK to `DELETE FROM coffee_brands` and `DELETE FROM roasters` (no roasters exist anyway; coffee_brands rows that reference them will go too). Or do you want to keep `coffee_brands` rows that have no `roaster_id`?
2. **Roaster taxonomy**: Shops have a `type` (cafe, roastery, etc.). For roasters, do you want a `specialty` filter (Single Origin, Blends, Direct Trade, Espresso, Micro-lots, Dark Roasts) similar to today's mock, or no taxonomy filter at all (search + rating only)?
3. **Map**: keep the current `RoasterMapModal` (popup) or switch to inline `RoastersMapView` like Shops (recommended — matches the mirror requirement)?

Reply with answers (or "use Shops defaults for everything"), and I'll execute the rebuild in one pass.