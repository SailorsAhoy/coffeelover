## Goal

On each signed-out landing page (`/welcome/:slug`), the example listing should look like a real listing from the app: a banner image, an avatar/product image, and the example title starting 6px below the image. Nothing else on the page changes.

## What changes

### 1. Example content becomes a real-listing snapshot
`src/lib/welcomeContent.ts`

- Extend `WelcomeExample` with two optional fields: `banner` (wide image URL) and `avatar` (square logo/product image URL).
- Replace the invented example names with real records currently in the database, keeping the existing rich structure (about, details, section, review):
  - shops → the real coffee shop record ("Eira's Coffee")
  - roasters → a real roaster (e.g. "Blue Bottle Roasters", "Square Mile Coffee", "La Cabra")
  - coffee → a real coffee product from that roaster, with its real price/currency
  - recipes → a real recipe, including its stored image
  - remaining slugs (guides, equipment, journal, academy, jobs, wiki, forum, library, messages) keep their curated copy and get banner/avatar images
- Where the database row has no stored image (shops/roasters have none), use the same Unsplash fallback style already used in `ShopBanner.tsx`, so the preview matches the real profile page.

### 2. Example card gains banner + avatar and the 6px title offset
`src/pages/Welcome.tsx`

- Replace the flat gradient strip with a real banner image (`ex.banner`), keeping the existing overlay/fade treatment used on shop profiles, with the category icon gradient as fallback if no banner.
- Show the avatar as a rounded image (`ex.avatar`) with the existing card-border ring; fall back to the current icon tile when absent.
- Change the title block so it is no longer pulled up over the banner: the name/meta start exactly `6px` below the banner image, matching the requested spacing.

## Technical notes

- No database or backend changes; the example data is a static snapshot in `welcomeContent.ts`, so signed-out visitors still read zero data from the database.
- Images use `loading="lazy"` and fixed aspect ratios to avoid layout shift.
- CTA, sticky footer, bullets, and every other section of the landing page stay exactly as they are.
