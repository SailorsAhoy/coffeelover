# Foundation: Auth, Roles & Subscriptions

Build the central identity layer that every module (Shops, Roasters, Coffee, Equipment, Jobs, Academy, etc.) will plug into. Mobile-first, no changes to existing module screens beyond what's needed to wire them to the new auth/role system.

## 1. Role model (extend existing)

Current DB already has `app_role` enum (`admin`, `roaster`, `coffee_shop`, `producer`, `user`) and a `user_roles` table. Extend to cover all the personas you listed:

- `admin` — full control
- `company` — generic company owner account (umbrella for roaster / shop / producer / equipment seller / job poster / course provider). Companies are differentiated by which profile row they own (roaster_profiles, coffee_shop_profiles, etc.)
- `staff` — personnel attached to a company (linked via a new `company_members` table)
- `pro_user` — paid individual (job seekers, advanced journal, etc.)
- `teacher` — academy course author
- `user` — default viewer (can suggest shops/brands, comment, rate)

A user can hold multiple roles (already supported by `user_roles`).

## 2. Subscriptions

New `subscription_plans` table (seeded with: Free, Pro User, Company Basic, Company Plus, Academy Teacher) and `user_subscriptions` linking a user to one or more active plans with `status`, `started_at`, `expires_at`, and the `module` it unlocks (e.g. `jobs`, `journal_pro`, `shop_listing`, `course_publishing`). No real Stripe yet — a simulated "Activate" button in Settings will insert a row.

Helper SQL function `has_active_subscription(_user_id, _module)` mirroring the existing `has_role` pattern, so RLS and UI can gate features cleanly.

## 3. Permissions helper

A single `src/hooks/useCurrentUser.ts` returning `{ user, profile, roles, subscriptions, can(permission) }`. The `can()` function centralises rules like:

- `can('suggest_shop')` → any logged-in user
- `can('comment')` → any logged-in user
- `can('post_job')` → role `company` + active `jobs` subscription
- `can('publish_course')` → role `teacher` + active `course_publishing` subscription
- `can('manage_company', companyId)` → owner or staff of that company

Modules will import this hook instead of doing ad-hoc auth checks.

## 4. Auth UI overhaul (the only existing screen touched: `/auth`)

Rebuild `src/pages/Auth.tsx` mobile-first with tabs:

- Sign in (email/password)
- Sign up (email/password + name + role selector: "I'm a coffee lover / a professional / a company")
- Forgot password → sends reset email, redirects to new `/reset-password`
- Social login buttons: Google, Apple, Facebook — **simulated**. Clicking creates/uses a deterministic demo account (`demo-google@coffeelover.app`, etc.) via `signInWithPassword`, with a clear "Demo mode" toast. Wiring point left in place for real OAuth later.

New `/reset-password` page handles the recovery hash and calls `updateUser({ password })`.

Add `signOut()` action in the profile menu (Navigation already exists — only minimal hook-up, no layout change).

Enable Lovable Cloud **leaked password protection** (HIBP) via configure_auth.

## 5. Role-aware routing guard

`src/components/RequireAuth.tsx` and `RequireRole.tsx` wrappers. Apply only to routes that clearly need it now:

- `/settings/*` (admin only) — replaces the current unguarded admin pages
- `/journal/*` (already uses `useAuthGuard`, migrate to new hook)
- `/profile` (any logged-in user)

Module pages stay public-readable; write actions inside them will call `can()` and route to `/auth` if needed. No visual changes to those pages in this step.

## 6. Profile & account hub

Light extension of `/profile`:

- Show current roles and active subscriptions
- "Become a company / teacher / pro user" buttons → simulated subscription activation
- Manage staff (only visible to company owners) — list + invite-by-email stub

## Technical details

**Migration (single call):**

```sql
-- extend enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'company';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'pro_user';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'teacher';

-- subscription_plans, user_subscriptions, company_members tables
-- + GRANTs + RLS + has_active_subscription() SECURITY DEFINER fn
-- + seed plans
```

**New files**

- `src/hooks/useCurrentUser.ts`
- `src/lib/permissions.ts` (the `can()` rule table)
- `src/components/RequireAuth.tsx`, `RequireRole.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/components/auth/SocialLoginButtons.tsx` (simulated)
- `src/components/profile/SubscriptionsCard.tsx`
- `src/components/profile/RolesCard.tsx`

**Edited files (minimal)**

- `src/pages/Auth.tsx` — rebuild with tabs + social + role pick on signup
- `src/App.tsx` — add `/reset-password`, `/forgot-password`, wrap admin routes
- `src/pages/Profile.tsx` — mount roles/subscriptions cards
- `src/hooks/useAuthGuard.ts` — re-export from `useCurrentUser` for back-compat
- `supabase/functions` — none needed for this step

**Out of scope for this step** (next modules will consume the foundation): Shops, Roasters, Coffee, Equipment, Jobs, Academy UI changes; real OAuth providers; real Stripe billing; staff invitation emails.

After you approve, I'll run the migration first, then wire the code.