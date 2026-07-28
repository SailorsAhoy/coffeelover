## Goal

Add an admin-toggleable "Gated preview mode". When ON, unauthenticated visitors hitting any main menu page (Shops, Roasters, Coffee, Guides, Recipes, Equipment, Academy, Jobs, Wiki, Forum, Library, Journal) are redirected to a per-item **landing page** that explains what that section does and prompts them to sign in / sign up. When OFF (default), the app behaves exactly as today.

Impact on existing code is minimal: one new wrapper component, one new landing route with per-slug content, one admin toggle, and route wiring in `App.tsx`. No existing page logic changes.

## Feasibility

Yes — low effort, no touching of page internals. Everything hinges on a single `<GatedRoute>` wrapper that checks the flag + auth state and either renders the page or `<Navigate>`s to `/welcome/:slug`.

## Steps

1. **Storage for the toggle**
   - Add an `app_settings` table (`key text primary key, value jsonb, updated_at, updated_by`) with RLS: `SELECT` for `anon` + `authenticated` (public read of settings), `INSERT/UPDATE` for admins only via `has_role`.
   - Seed one row: `gated_preview_enabled = false`.
   - Grants: `SELECT` to anon+authenticated, `ALL` to service_role, `INSERT/UPDATE` to authenticated (RLS restricts to admin).

2. **Hook `useAppSetting(key)`**
   - Reads once, subscribes to realtime `UPDATE`s so toggling propagates instantly.

3. **`<GatedRoute slug="shops">` wrapper** (new, `src/components/GatedRoute.tsx`)
   - If loading → spinner.
   - If `gated_preview_enabled` AND not authenticated → `<Navigate to="/welcome/shops" replace />`.
   - Otherwise render `children`.

4. **Landing page `/welcome/:slug`** (new, `src/pages/Welcome.tsx`)
   - Content map keyed by slug: title, description, feature bullets, hero icon (reuse Lucide icons already used on `Index.tsx`), and two CTAs → `/auth` (Sign in) and `/auth?mode=signup`.
   - Uses existing design tokens; no new styling system.
   - Falls back to a generic message if slug unknown.

5. **Wire routes in `App.tsx`**
   - Wrap the 12 public menu routes with `<GatedRoute slug="...">`. Auth/reset/welcome/`/` stay open. `RequireAuth` routes remain unchanged (they already redirect to `/auth`, which is fine).
   - Add `<Route path="/welcome/:slug" element={<Welcome />} />`.

6. **Admin toggle UI**
   - Add a "Preview access" card in `src/pages/settings/SystemSettings.tsx` with a `<Switch>` bound to the setting. Writes go through the RLS-protected update.

7. **Menu behavior when signed out + gated**
   - Existing sidebar/bottom-nav links keep pointing to `/shops` etc.; the wrapper handles the redirect, so no nav changes needed.

## Technical notes

- Setting is public-readable so the redirect decision doesn't require an auth round-trip for anonymous visitors.
- Realtime channel uses a unique name per mount and unsubscribes on unmount (same pattern already established in `notifications.ts` / `messaging.ts`).
- Slugs are stable strings mapped in one file (`src/lib/welcomeContent.ts`) so adding a new gated section = one entry + one route wrap.
- No changes to any existing page component, DB table other than the new `app_settings`, or auth flow.

## Out of scope

- Per-role gating (only signed-in vs anonymous).
- Custom landing content per shop/roaster (only per menu category).
- SEO decisions about whether landing pages should be indexable instead of the real pages (can be added later via canonical tags).
