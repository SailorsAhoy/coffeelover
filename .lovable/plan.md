# Plan: Ownership claims, Roaster parity, and Shop↔Roaster linking

This plan covers three related pieces: a generic listing-claim workflow, bringing Roaster UX up to parity with Shops, and a bidirectional link/clone between Shops and Roasters.

## 1. Generic listing-claim workflow

Add a single table that handles claims across all listing types (shops, roasters, manufacturers, academies, service_companies).

**Table `listing_claims`**
- `listing_type` (text): one of `shop | roaster | manufacturer | academy | service_company`
- `listing_id` (uuid)
- `claimant_user_id` (uuid, references auth users)
- `status` (text): `pending | approved | rejected`
- `requested_role` (text): `admin | user` — the author classification the claimant wants assigned
- `reviewed_by`, `reviewed_at`, `note`
- Unique partial index: only one `pending` or `approved` claim per (listing_type, listing_id)

**Rules**
- Any authed user with the matching subscription module (`shop_listing`, `roaster_listing`, etc.) or `admin` role can submit a claim.
- Admin gets a notification (row in `activity_log` with `entity_type='listing_claim'`) and a new "Claims" section in `AdminDashboard`.
- On approve: set the listing's `owner_user_id` (new column on `shops`, `roasters`, `manufacturers`, `academies`, `service_companies`) to the claimant; close any other pending claims; refuse new claims while owner is set.
- On reject: free the listing for future claims.

**UI**
- Profile dashboard ("My listings" card): user picks listing type + searches by name → submits claim with desired author role.
- Admin dashboard: pending claims list with Approve / Reject buttons.

## 2. Roaster parity with Shops

Mirror the Shop UI/data model for Roasters.

- **Page `/roasters/:id`** (RoasterProfile): two tabs
  1. **Overview** — banner, address, hours, amenities, gallery, reviews, affiliate links (same components as `ShopProfile`)
  2. **Coffees (beans)** — replaces the Shop "Staff" tab; lists `coffee_brands` for that roaster
- Reuse `AddressAutocomplete`, `OpeningHoursEditor`, `AffiliateLinksEditor`, `ShopGallery`, `ShopReviews`, `ShopBanner`, `MapPreview` — extracted to be entity-agnostic where they aren't already.
- Add a `RoasterCreateSheet` / `RoasterEditSheet` mirroring the Shop versions, minus staff.
- `roasters` table already has 23 columns; add any missing parity columns (`opening_hours jsonb`, `amenities text[]`, `affiliate_links jsonb`) via migration.

## 3. Shop ↔ Roaster linking + cloning

- Add `linked_roaster_id uuid` to `shops` and `linked_shop_id uuid` to `roasters` (each references the other; nullable; unique).
- "Visit roaster"/"Visit shop" button shown on the profile page when a link exists.
- Admin or verified owner can "Clone as roaster" (from a Shop) / "Clone as shop" (from a Roaster):
  - Copies common fields (name, address, lat/lng, hours, amenities, gallery refs, banner) into a new row in the opposite table.
  - When cloning Roaster → Shop, sets `shops.shop_type = 'roaster'`.
  - Sets the `linked_*` columns on both sides.
  - The new entry inherits ownership (`owner_user_id`) from the source.

## Technical notes

- One migration for: `listing_claims` table + grants + RLS, `owner_user_id` on the five listing tables, `linked_roaster_id` / `linked_shop_id`, plus the missing roaster parity columns.
- RLS: claim INSERT requires `auth.uid() = claimant_user_id` and no existing pending/approved claim; UPDATE restricted to `has_role(auth.uid(),'admin')`.
- New `useListingClaim(listingType, listingId)` hook returns `{ status, claim, submitClaim, isOwner }` and powers the Claim button on each profile page.
- Frontend file additions:
  - `src/lib/claims.ts` — claim helpers
  - `src/components/listings/ClaimButton.tsx`
  - `src/components/listings/CloneAcrossTypeButton.tsx`
  - `src/pages/RoasterProfile.tsx` — extend with tabs + edit/create
  - `src/components/roasters/RoasterCreateSheet.tsx`, `RoasterEditSheet.tsx`
  - Admin claims panel: extend `AdminDashboard.tsx`
  - Profile claims panel: extend `Profile.tsx` (or `UserDashboard.tsx`)

## Out of scope

- Email notifications for claim status (in-app `activity_log` only).
- Manufacturer / Academy / Service-company UI parity — claims data model supports them, but only Shop + Roaster get full UI in this pass.
