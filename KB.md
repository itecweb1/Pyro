# Pyro Wear — Knowledge Base

Working knowledge for anyone (human or AI) picking up this codebase. Conventions, gotchas, and where to find things. See [`README.md`](./README.md) for setup, [`PLAN.md`](./PLAN.md) for roadmap.

---

## TL;DR

Pyro Wear is a French-language streetwear e-commerce site for the Moroccan market (MAD, COD-first, optional Stripe). Built on Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Supabase + Stripe. Storefront and admin both live in the same Next.js app.

Two operating modes:
- **Fallback**: no Supabase env → site renders from hardcoded data in `lib/content.ts`. Useful for local design work.
- **Connected**: Supabase + Stripe envs set → real data, auth, cart, orders.

---

## Architecture map

| Concern | Where |
|---|---|
| Storefront pages | `app/` (everything outside `app/admin/`) |
| Admin pages | `app/admin/(dashboard)/` — auth-gated by `requireAdmin()` in the route group's `layout.tsx` |
| Server actions | `app/admin/actions.ts` (admin), `app/actions/cart.ts` and `app/actions/auth.ts` (storefront) |
| Data layer | `lib/queries.ts` (storefront, with fallback), `lib/admin.ts` (admin, no fallback) |
| Supabase clients | `lib/supabase/server.ts` (SSR), `lib/supabase/client.ts` (browser), `lib/supabase/admin.ts` (service-role) |
| Hardcoded fallbacks | `lib/content.ts` (brand settings, hero banners, FAQ, etc.) |
| Types | `lib/types.ts` |
| Format helpers | `lib/format.ts` (`formatPrice`, `formatDate` — locale `fr-MA`, currency MAD) |
| UI primitives | `components/ui/` (Radix-wrapped) |
| Domain components | `components/` (root level: site-header, product-card, etc.) |
| Database schema | `scripts/001_schema.sql` |
| RLS policies | `scripts/002_rls.sql` |
| Auto-create profile on signup | `scripts/003_profile_trigger.sql` |
| Seed data | `scripts/004_seed.sql` |
| Storage buckets | `scripts/005_storage.sql` (added April 2026 for image uploads) |

---

## Conventions

### Language
- All UI strings in **French**. Use proper accents in microcopy where natural; the existing code is mixed (some accents stripped, some not). Going forward, prefer **with accents**.
- Code, file names, identifiers, comments: English.
- Status enums in DB are English (`pending`, `paid`, etc.). UI must show French labels (target for Sprint E in PLAN.md).

### Money
- Stored in **cents** (`price_cents`, `total_cents`, etc.) as `int`. Convert via `formatPrice` for display.
- Currency code on every relevant table defaults to `MAD`.

### Server actions pattern
Every admin action follows:
```ts
"use server"
export async function someAction(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return  // fallback mode safety
  // …mutate…
  if (error) return
  revalidatePath("/admin/somewhere")
  // optionally redirect("/admin/somewhere")
}
```

Today actions return `void` and silently ignore errors. **Sprint A (UX) changes this** to return `{ ok: boolean, error?: string }` so toasts can surface failures.

### Auth gate
`app/admin/(dashboard)/layout.tsx` calls `requireAdmin()` from `lib/admin.ts`. That:
1. Returns no user if `hasSupabaseEnv()` is false → redirect `/admin/login`
2. Reads `auth.users` + `profiles.role`
3. Admin = `profile.role === 'admin'` **OR** email in `ADMIN_EMAILS` env
4. Non-admin → redirect `/account`

### Fallback architecture
`lib/queries.ts` checks `hasSupabaseEnv()` at the top of every query function. If false, it returns hardcoded data from `lib/content.ts` and `fallbackProducts`/`fallbackCategories` constants. The storefront never crashes on missing Supabase.

`lib/admin.ts` does **not** fall back — admin requires a real DB. Pages render an `AdminSetupNotice` when the service-role key is missing.

### Image storage
Three Supabase Storage buckets, all public-read:
- `product-images` — uploaded from product edit page
- `hero-banners` — uploaded from settings page
- `category-images` — uploaded from category create/edit pages

The `uploadToBucket` helper in `app/admin/actions.ts` handles multipart uploads. Every form keeps a fallback URL text input so external URLs still work.

---

## Common gotchas

### Local dev
1. **`pnpm dev` fails with "Invalid package.json in ../package.json"** — there's a stray non-npm `package.json` at `/Users/user/Downloads/`. Workaround: invoke Next directly: `./node_modules/.bin/next dev`.
2. **macOS Gatekeeper blocks SWC binary** on first run after extracting `node_modules` from a download. Fix:
   ```bash
   xattr -dr com.apple.quarantine node_modules
   ```
3. **`.next/` must stay gitignored.** It bloated the repo to 2.5 GB before the cleanup. The committed `.gitignore` covers it now — never `git add -A` from a polluted state.
4. **Cached `.next/` references stale paths** if the `node_modules` was created on a different machine. Symptom: `failed to create directory "/Users/<other-user>/Desktop/pyro/..."`. Fix: `rm -rf .next` and restart.

### Production
1. **Supabase email rate limit** on free tier (~3/hour). Repeated signup attempts get throttled.
2. **Magic-link redirects to localhost** if `Site URL` and `Redirect URLs` aren't set in Supabase Authentication → URL Configuration.
3. **`ADMIN_EMAILS` is comma-separated**, no spaces. Email comparison is lowercase-insensitive but exact-match otherwise — typos block admin access silently.
4. **Stripe payments don't currently persist orders.** No webhook is wired up (P0-1 in PLAN.md). Only COD orders end up in `orders`.

---

## Run / verify

```bash
# Dev (use the workaround if pnpm errors)
./node_modules/.bin/next dev
# OR through the Vercel/preview tooling: configured in .claude/launch.json
# OR pnpm dev   (only if /Users/user/Downloads/package.json is removed)

# Type check
./node_modules/.bin/tsc --noEmit

# Lint
./node_modules/.bin/eslint "app/**" "lib/**" "components/**"

# Production build
./node_modules/.bin/next build
```

The preview tooling (`preview_start`) reads `.claude/launch.json` and runs `npm run dev`. The launch.json copy in `/Users/user/Advising/.claude/launch.json` uses `--prefix` so `npm` doesn't trip on the parent `package.json` issue.

---

## Database tables (cheat sheet)

See `scripts/001_schema.sql` for canonical definitions.

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | Extends `auth.users` | `id`, `role` (`customer`/`admin`), `first_name`, `last_name`, `phone` |
| `categories` | Collections | `slug`, `name`, `image_url`, `sort_order` |
| `products` | Catalog items | `slug`, `name`, `price_cents`, `compare_at_cents`, `category_id`, `is_active`, `is_featured`, `materials`, `care` |
| `product_images` | Multiple per product | `product_id`, `url`, `alt`, `sort_order` |
| `product_variants` | Size/color/SKU/stock | `product_id`, `size`, `color`, `sku` (unique), `stock` |
| `cart_items` | Per user, one row per variant | `user_id`, `variant_id`, `quantity` |
| `wishlist_items` | Per user | `user_id`, `product_id` |
| `orders` | Placed orders | `user_id` (nullable), `status`, `payment_method`, `stripe_*_id`, `coupon_code`, `subtotal_cents` … `total_cents`, full shipping address |
| `order_items` | Snapshot at purchase time | `order_id`, `product_name`, `variant_label`, `unit_price_cents`, `quantity` |
| `coupons` | Discount codes | `code`, `type` (`percent`/`fixed`), `value`, `is_active`, `starts_at`, `ends_at`, `max_uses`, `used_count` |
| `addresses` | Saved shipping addresses | `user_id`, full address, `is_default` |
| `reviews` | Product reviews (not yet exposed) | `product_id`, `rating` 1-5, `is_approved` |
| `newsletter_subscribers` | Email captures | `email` (unique) |
| `site_settings` | CMS/brand JSON | key=`brand` (single row, big jsonb), see `BrandSettings` type |
| `hero_banners` | Homepage hero rotator | `title`, `subtitle`, `eyebrow`, `cta_*`, `image_url`, `is_active`, `sort_order` |

### Status enums

- `orders.status`: `pending` · `paid` · `shipped` · `delivered` · `cancelled` · `refunded`
- `orders.payment_method`: `cod` · `card`
- `profiles.role`: `customer` · `admin`
- `coupons.type`: `percent` · `fixed`

---

## Design system (current state)

### Tokens (in `globals.css`)
- `foreground` (black-ish), `background` (white-ish), `smoke` (gray for secondary text), `border` (hairline)
- No semantic colors yet (success/warning/danger/info) — UX Sprint B will add them

### Typography
- `font-serif` = **Instrument Serif** (page H1s on storefront and admin)
- `font-sans` (Archivo) = body
- `.label-eyebrow` = uppercase, tracking-wide, small font-medium — used for section labels

### Buttons (current pattern, pre-Sprint B)
- **Primary**: `bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background`
- **Secondary**: `border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary`
- **Tertiary / danger**: same as secondary but `text-smoke hover:text-foreground` — *not visually distinct enough; Sprint B will fix this with a `<Button variant="danger">` component*

### Tables
- Hairline borders, `p-4` cells, headers in `text-[11px] uppercase tracking-[0.18em] text-smoke`
- No hover state, no zebra striping, no sticky header — Sprint B adds polish

### Forms
- Inputs: `h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground` (focus is subtle — Sprint C adds proper focus rings)
- Labels styled with `.label-eyebrow`, wrapped around input
- Stacked layout, `gap-4` between fields, `gap-8` between major form sections

---

## Useful URLs

- **Production**: https://pyro-taupe.vercel.app
- **GitHub**: https://github.com/itecweb1/Pyro
- **Supabase project URL**: `https://rnopsucrorqfsqdjblja.supabase.co` (org: itecweb1's Org, free tier)

---

## When in doubt

- **Adding a new admin entity**: copy the pattern of `categories` end-to-end (list page + edit page + create/update/delete actions in `actions.ts` + queries in `lib/admin.ts`).
- **Touching server actions**: read existing ones — they all do `await requireAdmin()` first, then `createAdminClient()` with null-check, then mutate, then `revalidatePath()`.
- **Adding storefront UI**: most pages are server components fetching from `lib/queries.ts`. Don't reach for client components unless you need state/effects/interactivity.
- **Need to feature-flag while Supabase is down**: gate behind `hasSupabaseEnv()` and provide fallback content.
