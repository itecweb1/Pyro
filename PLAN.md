# Pyro Wear — Plan & Roadmap

Living document. Tracks current state of the storefront + admin and the prioritized work to make Pyro production-ready for the Moroccan market (COD-first, Stripe online payments, French UI, MAD).

---

## 0. Recently shipped (admin sprint, April 2026)

- **Sprint 1** — Category & Coupon edit/delete (edit pages + delete actions).
- **Sprint 2** — Product edit page incl. image add/delete and variant stock add/update/delete; product list now has Editer + Supprimer.
- **Sprint 3** — Order detail page with line items, totals, customer block, full shipping address, payment block (Stripe IDs + coupon), status update.
- **Sprint 4** — Supabase Storage uploads. New SQL `scripts/005_storage.sql` creates `product-images`, `hero-banners`, `category-images` buckets. File picker added to product image add, hero banner create, category create + edit. URL fallback kept on every form.
- **Sprint 5** — Hero banner edit page (replaces delete-only flow) and customer detail page with order history + role/profile edit (promote-to-admin via dropdown).

The admin still needs the items in §2 below; the biggest remaining correctness item is the Stripe webhook (P0 #1).

---

## 1. Current state

### Storefront (public) — mostly done
- Homepage, shop, collections, product detail, cart, wishlist, checkout, auth, legal pages — all implemented.
- Reads from Supabase when env is configured, falls back to hardcoded data in `lib/content.ts` otherwise.
- Stripe Checkout Session is created from `app/actions/cart.ts` for card payments. COD is the default payment method.

### Admin — scaffolded, gaps in operations
Auth gate is real: `app/admin/(dashboard)/layout.tsx` calls `requireAdmin()` (`lib/admin.ts`) which checks `profiles.role === 'admin'` OR `ADMIN_EMAILS`.

| Section | List | Create | Edit | Delete |
|---|:-:|:-:|:-:|:-:|
| Products | ✅ | ✅ | ❌ | ❌ |
| Categories | ✅ | ✅ | ❌ | ❌ |
| Coupons | ✅ | ✅ | ❌ | ❌ |
| Orders | ✅ | — | status only | ❌ |
| Customers | ✅ (read-only) | — | ❌ | ❌ |
| Hero banners | ✅ | ✅ | ❌ | ✅ |
| Site settings | merged form | ✅ | ✅ | — |
| Reviews | — | — | — | — |
| Media / assets | stub | — | — | — |

### Known correctness bug
**Stripe payments don't persist orders.** `app/actions/cart.ts` opens a Checkout Session but there is no `/api/webhooks/stripe` route. When a customer pays by card, the success redirect lands them back on the site, but no `orders` row is created. Today only COD orders end up in the DB.

---

## 2. Priorities

### P0 — blocks running the store
Must land before any real launch.

1. **Stripe webhook → order creation/update**
   - New route: `app/api/webhooks/stripe/route.ts`
   - Verify signature with `STRIPE_WEBHOOK_SECRET`
   - On `checkout.session.completed`: create `orders` + `order_items` rows from session metadata; mark `payment_method = 'card'`, `status = 'paid'`
   - On `charge.refunded`: flip status to `refunded`
   - Pass `cart_id` / `user_id` / line items via Stripe session `metadata` so the webhook has enough to build the order
   - Update success page to show order confirmation from DB (not from Stripe alone)

2. **Order detail page** — `app/admin/(dashboard)/orders/[id]/page.tsx`
   - Show line items (`order_items` join `products` join `product_variants`)
   - Customer: name, email, phone, shipping address (`addresses` table)
   - Payment: method, Stripe session id (link out to Stripe dashboard), totals
   - Action buttons: confirm dispatch, mark delivered, cancel, refund (if Stripe)
   - Free-text internal notes field

3. **Product edit page** — `app/admin/(dashboard)/products/[id]/page.tsx`
   - Edit name, slug, description, price (`price_cents` + `compare_at_cents`), category, `is_active`, `is_featured`, materials, care
   - Manage images: add / remove / reorder rows in `product_images`
   - Manage variants: add / remove / update stock on `product_variants`
   - Reuse the validation logic from `createProduct` in `lib/admin.ts`

4. **Variant / stock management**
   - Per-product variant table with inline stock edit
   - Eventually a global low-stock view (P1)

5. **Category & coupon edit + delete actions**
   - Cannot fix typos or revoke coupons today. Quick CRUD additions.

6. **Image upload (Supabase Storage)**
   - Bucket: `product-images` (public read), `hero-banners` (public read)
   - Replace every `image_url` text input with a file picker that uploads then writes the public URL to the DB
   - Unblocks #2, #3, hero banners, and the `/admin/media` stub

### P1 — major workflows still missing

7. **COD fulfillment workflow**
   - Phone-confirmation step (status: `pending` → `confirmed` → `shipped` → `delivered`)
   - Internal note + timestamp on each transition
   - Optional SMS integration later

8. **Customer detail page** — `/admin/customers/[id]`
   - Order history, change role, edit phone
   - Promote to admin (set `profiles.role = 'admin'`)

9. **Reviews moderation** — `/admin/reviews`
   - Schema already has `reviews.is_approved`. Need approve/reject UI and storefront filter.

10. **Hero banner edit** (delete already exists, edit doesn't)

11. **Real dashboard analytics**
    - Revenue per day / month
    - Top products
    - COD vs card split, conversion rate

### P2 — polish

12. Bulk product import (CSV)
13. Email notification templates (order confirmation, shipped, COD reminder)
14. Newsletter subscriber export
15. Low-stock alerts
16. Audit log (who changed what)
17. `.gitignore` + remove `.next/` and any other build cache from the repo (currently 2.5 GB on disk, ~2.2k tracked `.next/` files)

---

## 3. Recommended order of work

Each step unblocks the next, so do them in order rather than in parallel:

1. **Stripe webhook + persistence** (P0 #1) — fixes the correctness bug. Smallest scope, biggest impact. Without this, you cannot accept real online payments.
2. **Order detail page** (P0 #2) — first thing you need once orders exist.
3. **Image upload to Supabase Storage** (P0 #6) — pulled forward because it's a dependency for the next step.
4. **Product edit + variant/stock management** (P0 #3, #4) — day-2 store ops.
5. **Category & coupon edit/delete** (P0 #5) — quick wins.
6. **COD fulfillment workflow + customer detail** (P1 #7, #8).
7. **Reviews + hero banner edit + analytics** (P1 #9, #10, #11).
8. P2 items as time allows.

---

## 4. Open questions / decisions needed

- **Storage provider for images.** Supabase Storage is the natural choice (already a dependency), but Cloudinary gives free responsive transforms. Default to Supabase unless we need on-the-fly transforms.
- **Order numbering.** Today `orders.id` is a UUID. Customers expect a short human-readable number on COD calls (e.g. `PYR-2026-00041`). Add a `display_id` column?
- **Stripe Connect / multi-currency.** Out of scope for v1 (MAD only).
- **SMS / phone confirmation provider** for COD workflow. Twilio? A Moroccan SMS gateway? Decide before starting P1 #7.
- **Repo hygiene.** The pushed repo includes `.next/` build cache. Worth cleaning up with a `.gitignore` + history rewrite before the team grows.

---

## 5. Definition of done for v1 launch

- [ ] Stripe payments create and finalize orders end-to-end
- [ ] Admin can view, edit, and fulfill any order (COD + card)
- [ ] Admin can edit existing products, manage stock, upload images
- [ ] Admin can edit/revoke coupons
- [ ] Reviews moderation working
- [ ] `pnpm build` clean, `tsc --noEmit` clean
- [ ] Repo has a real `.gitignore` and no committed build artifacts
