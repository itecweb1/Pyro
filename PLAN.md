# Pyro Wear — Plan & Roadmap

Living document. Tracks current state of the storefront + admin and the prioritized work to make Pyro production-ready for the Moroccan market (COD-first, Stripe online payments, French UI, MAD).

---

## 0. Recently shipped (April 2026)

### Phase 1 — Feature CRUD
- **Sprint 1** — Category & Coupon edit/delete (edit pages + delete actions).
- **Sprint 2** — Product edit page incl. image add/delete and variant stock add/update/delete; product list now has Editer + Supprimer.
- **Sprint 3** — Order detail page with line items, totals, customer block, full shipping address, payment block (Stripe IDs + coupon), status update.
- **Sprint 4** — Supabase Storage uploads. New SQL `scripts/005_storage.sql` creates `product-images`, `hero-banners`, `category-images` buckets. File picker added to product image add, hero banner create, category create + edit. URL fallback kept on every form.
- **Sprint 5** — Hero banner edit page (replaces delete-only flow) and customer detail page with order history + role/profile edit (promote-to-admin via dropdown).

### Phase 2 — Admin UX
- **UX Sprint A — Safety & feedback.** `<ConfirmDeleteForm>` (Radix dialog) on every delete; `<SubmitButton>` with `useFormStatus` loading state on every form; `<FormToast>` (`useActionState`) wrapping inline updates; Sonner toaster in admin shell; all destructive + inline-update server actions return `ActionResult` (`{ ok, error }`).
- **UX Sprint B — Visual design system.** Semantic color tokens (success/warning/danger/info × 5 stops) in `globals.css`; `<StatusBadge>` mapping DB values to French labels with tinted bg + dot; `<Button>` with variants/sizes; `<Card>` with tones; `<EmptyState>`; `<KpiCard>`; dashboard refactored; status badges and lucide icons applied across every list/detail.
- **UX Sprint C — Wayfinding & polish.** Active sidebar nav state via `usePathname()`; `<Breadcrumbs>` on every detail page (replaces "Retour" pattern); custom admin `not-found.tsx`; focus rings on all inputs; consistent danger styling everywhere.
- **UX Sprint D — List ergonomics.** URL-based search/sort/pagination (`?q`, `?sort`, `?dir`, `?page`, `?status`). New components: `<SearchInput>` (debounced), `<Pagination>`, `<SortableHeader>`, `<StatusFilterChips>`. New `lib/list-params.ts` parses + validates URL params. Admin queries (`getAdminProducts`, `getAdminOrders`, `getAdminCustomers`, `getAdminCoupons`) refactored to accept `{page, limit, q, sort, dir, status}` and return `{rows, total}` with Supabase `count: "exact"`. `getOrderStatusCounts()` for the orders chips. Server-side `ilike` with input escaping.

The admin is feature-complete and ship-quality on UX through Sprint D. Remaining: forms & microcopy (E), mobile responsive (F), density refinements (G), then Stripe webhook (P0-1).

---

## 1.5. Admin UX phase (April 2026 audit)

A full design / usability / ergonomics audit found the admin is **visually consistent** and **feature-complete**, but has **5 blocking UX gaps** that prevent professional use:

### Blocking issues
1. **Destructive actions have no confirmation** — every delete is a one-click form submission. Accidentally clicking "Supprimer" permanently removes a product with no undo.
2. **Silent form submissions** — actions revalidate without any toast, inline message, or success indicator. On slow networks, users click Submit twice.
3. **No pagination** — orders cap at 50 (older orders invisible); products and customers are unbounded and would slow down the page at any real scale.
4. **No search/filter** on any list — finding a specific product/order/customer means scrolling.
5. **Tables overflow horizontally on mobile** — `min-w-[820px]` on tables means phone users scroll sideways to see actions.

### Major issues (next tier)
- No active state on sidebar nav — operators get lost
- Delete buttons styled like normal secondary buttons (no red, no danger affordance)
- Inconsistent button verbs (`Creer` / `Enregistrer` / `Ajouter`, plus risk of `Modifier` / `Sauvegarder` creeping in)
- No image preview before upload — users submit blind
- Date inputs mixed: create-coupon form uses text+placeholder, edit-coupon uses native `type="date"`
- Number inputs lack `min`/`step` validation
- No loading states or `useTransition` on buttons (no spinner, no disabled-while-submitting)
- Focus rings invisible (only a 1px border change on `:focus`) — keyboard nav fails accessibility
- Order/coupon status values shown as English keys (`pending`, `paid`) instead of French labels
- Variant management cramped (6 columns on a row)

### Minor / polish
- Custom 404 missing for deleted entities (Next.js generic 404 breaks admin look)
- Eyebrow text contrast may fail WCAG AA
- Empty states say "Aucun produit." without a CTA to create one
- No breadcrumbs on detail pages
- Order timestamps show date only, not time
- `AdminSetupNotice` is generic when several specific failure modes could be detected

---

## 2. UX Sprints (proposed)

Seven focused sprints. Each is small and shippable. Recommended order is **A → B → C → D → E → F → G**. Sprint A unlocks reusable patterns (toast, confirm dialog, loading state). Sprint B builds the visual primitives (badges, buttons, cards, icons) that C–G all reuse.

### ~~UX Sprint A — Safety & feedback~~ ✅ shipped
Delivered: `<ConfirmDeleteForm>` Radix dialog, `<SubmitButton>` with `useFormStatus`, `<FormToast>` wrapping inline updates, Sonner toaster in shell, all destructive + inline-update actions return `ActionResult`.

### ~~UX Sprint B — Visual design system~~ ✅ shipped
Delivered: semantic color tokens (success/warning/danger/info × 5 stops, OKLCH), `<StatusBadge>` (mapped to French labels), `<Button>`, `<Card>`, `<EmptyState>`, `<KpiCard>`. Dashboard rebuilt with KPI cards. Status badges + lucide icons applied across products / coupons / orders / customers / hero banners. Order detail status select uses French labels.

### ~~UX Sprint C — Wayfinding & polish~~ ✅ shipped
Delivered: active sidebar nav via `usePathname()`, `<Breadcrumbs>` on 6 detail pages, custom admin `not-found.tsx`, focus rings on every Input/Textarea, consistent danger styling.

### ~~UX Sprint D — List ergonomics~~ ✅ shipped
Delivered: URL-based search/sort/pagination on products, orders, customers, coupons. New components `<SearchInput>` (debounced), `<Pagination>`, `<SortableHeader>`, `<StatusFilterChips>`. Helper `lib/list-params.ts`. Admin queries refactored to `{rows, total}` shape. Order status filter chips with counts. Search-aware empty states.

### UX Sprint E — Forms & microcopy
- Standardize button verbs project-wide: `Créer …` (insert), `Enregistrer` (update), `Ajouter` (append to list), `Supprimer` (destroy). Forbid `Sauvegarder` / `Modifier`.
- Image preview before upload (FileReader thumbnail next to file input)
- Date inputs everywhere become `type="date"` (fix `coupons/page.tsx` create form)
- Number inputs get `min` / `step` (`min="0" step="0.01"` on prices, `min="0" step="1"` on stock and sort_order)
- Localize order/coupon status to French in UI (keep DB values English): `{ pending: "En attente", paid: "Payé", … }`
- Improve placeholders and labels for clarity (e.g. `Slug (URL)` → `Slug URL — laisser vide pour générer depuis le nom`)
- Customer role select gets a warning helper text under it

### UX Sprint F — Mobile responsive
- Sidebar becomes a slide-in drawer on `< lg` (hamburger trigger in header)
- Convert wide tables (products, orders) to stacked cards under `md` breakpoint
- Touch-friendly sizing — bump button padding on mobile, ensure 48px min touch targets

### UX Sprint G — Density refinements
- Variant management: switch from 6-column row to expandable card per variant
- Time included in order timestamps (`25 avril 14:32`)
- Smarter `AdminSetupNotice` that detects and shows only the specific missing piece
- Fix any remaining contrast misses found by a contrast pass

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

## 3. Recommended order of work (revised April 2026)

UX phase comes first — feature work doesn't matter if the panel feels unsafe or unprofessional.

1. ~~UX Sprint A — Safety & feedback~~ ✅ shipped
2. ~~UX Sprint B — Visual design system~~ ✅ shipped
3. ~~UX Sprint C — Wayfinding & polish~~ ✅ shipped
4. ~~UX Sprint D — List ergonomics~~ ✅ shipped
5. **UX Sprint E — Forms & microcopy** *(next up)* — verb consistency (Sprint B already localized statuses), image preview before upload, `type="date"` everywhere, number `min`/`step`.
6. **UX Sprint F — Mobile responsive** — sidebar drawer, tables → cards under `md`.
7. **UX Sprint G — Density refinements** — variant cards, time on order timestamps, smarter setup notice.
8. **P0-1: Stripe webhook + order persistence** — only remaining correctness bug on the feature side.
9. **P1-1: COD fulfillment workflow** — `confirmed` status step, internal notes, timestamps.
10. **P1-2: Reviews moderation**.
11. **P1-3: Real dashboard analytics**.
12. P2 items as time allows.

The Sprints 1–5 (Phase 1 feature CRUD) and UX Sprints A–C in §0 are records of what shipped.

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
