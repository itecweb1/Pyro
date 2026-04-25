# Pyro Wear

Base e-commerce premium pour `Pyro Wear`, construite avec `Next.js App Router`, `TypeScript`, `Tailwind CSS`, `Supabase` et `Stripe`.

Le projet peut tourner de deux manieres :

1. `Fallback local`
Le catalogue et les pages publiques utilisent des donnees locales pour permettre un rendu immediat sans backend configure.

2. `Mode connecte`
Supabase alimente le catalogue, les comptes, la wishlist, le panier, l'admin et les reglages de contenu. Stripe prend le relais au checkout.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Supabase` pour auth, data et back office
- `Stripe` pour le paiement
- `Framer Motion` pour les reveals et transitions editoriales

## Demarrage local

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Application locale : `http://localhost:3000`

## Variables d'environnement

Variables minimales pour le mode fallback :

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Variables pour activer Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
ADMIN_EMAILS=admin@pyrowear.fr
```

Variables pour activer Stripe :

```bash
STRIPE_SECRET_KEY=
```

Variables marketing optionnelles :

```bash
NEXT_PUBLIC_GA_ID=
```

## Initialiser Supabase

Executer les scripts SQL dans cet ordre dans l'editeur SQL Supabase :

1. `scripts/001_schema.sql`
2. `scripts/002_rls.sql`
3. `scripts/003_profile_trigger.sql`
4. `scripts/004_seed.sql`
5. `scripts/005_storage.sql` (buckets `product-images`, `hero-banners`, `category-images` pour les uploads admin)

Le seed ajoute :

- les categories Pyro Wear
- plusieurs produits streetwear fictifs
- les variantes taille/couleur
- un coupon `PYRO10`
- un jeu initial de `site_settings`
- une `hero_banners` active

## Admin

Le back office est disponible sous `/admin/login`.

Pour qu'un compte ait acces a l'admin :

- ajouter son email dans `ADMIN_EMAILS`
- ou renseigner `role = 'admin'` dans `public.profiles`

Le back office permet deja :

- la creation de produits
- la creation de categories
- la creation de coupons
- la mise a jour du statut des commandes
- l'edition des reglages de marque
- la gestion des hero banners de homepage

## Mode fallback

Sans variables Supabase, le site reste navigable :

- homepage
- shop
- collections
- fiches produit
- pages de marque et legales
- vues admin non destructives

Les actions qui dependent du backend affichent alors un comportement degrade propre plutot qu'une erreur runtime.

## Verification

Checks utilises sur ce projet :

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Statut & feuille de route

Le storefront public et le back office sont fonctionnels. La phase admin UX est en cours :

- ✅ Phase 1 (CRUD complet) — produits, catégories, coupons, commandes, clients, hero banners, upload Supabase Storage.
- ✅ UX Sprint A (sécurité & feedback) — confirmations, toasts, états de chargement.
- ✅ UX Sprint B (système visuel) — tokens sémantiques, badges statut, composants Button/Card/EmptyState/KpiCard.
- ✅ UX Sprint C (orientation) — nav active, fil d'Ariane, 404 personnalisé, focus rings.
- ⏳ Sprints D–G à venir (pagination/recherche, formulaires, mobile, densité).
- ❌ Webhook Stripe (P0) — les paiements carte n'enregistrent pas encore d'ordres en base.

Voir [`PLAN.md`](./PLAN.md) pour la liste priorisée et [`KB.md`](./KB.md) pour le système de design + conventions.
