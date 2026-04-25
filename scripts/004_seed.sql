-- Pyro Wear seed data
-- Run after 001_schema.sql, 002_rls.sql and 003_profile_trigger.sql.

insert into public.categories (slug, name, description, image_url, sort_order)
values
  ('outerwear', 'Outerwear', 'Vestes, shells et surcouches sombres pour une presence immediate.', '/products/carbon-shell.jpg', 1),
  ('tops', 'Tops', 'Hoodies lourds, tees boxy et crewnecks graphite.', '/products/graphite-hoodie.jpg', 2),
  ('bottoms', 'Bas', 'Cargos, denims et shorts techniques a la coupe affirmee.', '/products/obsidian-cargo.jpg', 3),
  ('accessories', 'Accessoires', 'Sacs, caps et details chrome fume pour finir la silhouette.', '/products/onyx-bag.jpg', 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

with cats as (
  select id, slug from public.categories
),
seed_products as (
  select *
  from (values
    ('graphite-heavy-hoodie', 'Graphite Heavy Hoodie', 'Hoodie 500gsm coupe boxy', 'Molleton lourd, capuche structuree, toucher sec, signature ton sur ton.', 89000, null, 'tops', '/products/graphite-hoodie.jpg', true),
    ('obsidian-cargo-pant', 'Obsidian Cargo Pant', 'Cargo noir coupe droite', 'Ripstop mat, poches plaquees, taille ajustable, presence utilitaire.', 99000, null, 'bottoms', '/products/obsidian-cargo.jpg', true),
    ('carbon-shell-jacket', 'Carbon Shell Jacket', 'Veste technique chrome fume', 'Shell de mi-saison, volume net, zip metal, finition deperlante.', 129000, 149000, 'outerwear', '/products/carbon-shell.jpg', true),
    ('ash-oversized-tee', 'Ash Oversized Tee', 'T-shirt lourd blanc casse', 'Jersey dense, col epais, coupe carree, logo discret poitrine.', 39000, null, 'tops', '/products/ash-tee.jpg', false),
    ('smoke-crewneck', 'Smoke Crewneck', 'Crewneck gris fumee', 'Molleton compact, bord-cotes serres, coupe courte et large.', 69000, null, 'tops', '/products/smoke-crewneck.jpg', true),
    ('onyx-crossbody-bag', 'Onyx Crossbody Bag', 'Sac compact nylon noir', 'Nylon balistique, boucles metal, format daily carry.', 39000, null, 'accessories', '/products/onyx-bag.jpg', false),
    ('chrome-panel-cap', 'Chrome Panel Cap', 'Casquette six panels graphite', 'Twill dense, boucle metal, broderie ton sur ton.', 29000, null, 'accessories', '/products/chrome-cap.jpg', false),
    ('titanium-utility-vest', 'Titanium Utility Vest', 'Gilet utilitaire sans manches', 'Poches multiples, volume boxy, layer piece de mi-saison.', 109000, null, 'outerwear', '/products/titanium-vest.jpg', true)
  ) as p(slug, name, subtitle, description, price_cents, compare_at_cents, category_slug, image_url, is_featured)
),
inserted as (
  insert into public.products (
    slug, name, subtitle, description, price_cents, compare_at_cents,
    currency, category_id, materials, care, is_active, is_featured
  )
  select
    p.slug,
    p.name,
    p.subtitle,
    p.description,
    p.price_cents,
    p.compare_at_cents,
    'MAD',
    cats.id,
    'Coton lourd, nylon technique ou twill premium selon la piece.',
    'Lavage froid, sechage a plat, ne pas blanchir.',
    true,
    p.is_featured
  from seed_products p
  join cats on cats.slug = p.category_slug
  on conflict (slug) do update set
    name = excluded.name,
    subtitle = excluded.subtitle,
    description = excluded.description,
    price_cents = excluded.price_cents,
    compare_at_cents = excluded.compare_at_cents,
    currency = excluded.currency,
    category_id = excluded.category_id,
    is_featured = excluded.is_featured
  returning id, slug
)
insert into public.product_images (product_id, url, alt, sort_order)
select inserted.id, seed_products.image_url, seed_products.name, 0
from inserted
join seed_products on seed_products.slug = inserted.slug
on conflict do nothing;

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, size.size, 'Noir graphite', 'PW-' || upper(left(p.slug, 18)) || '-' || size.size, 18
from public.products p
cross join (values ('S'), ('M'), ('L'), ('XL')) as size(size)
where p.slug in (
  'graphite-heavy-hoodie',
  'obsidian-cargo-pant',
  'carbon-shell-jacket',
  'ash-oversized-tee',
  'smoke-crewneck',
  'titanium-utility-vest'
)
on conflict (sku) do update set stock = excluded.stock;

insert into public.product_variants (product_id, size, color, sku, stock)
select p.id, 'One Size', 'Noir', 'PW-' || upper(left(p.slug, 18)) || '-OS', 24
from public.products p
where p.slug in ('onyx-crossbody-bag', 'chrome-panel-cap')
on conflict (sku) do update set stock = excluded.stock;

insert into public.coupons (code, type, value, is_active)
values ('PYRO10', 'percent', 10, true)
on conflict (code) do nothing;

insert into public.site_settings (key, value)
values (
  'brand',
  '{"name":"Pyro Wear","slogan":"La coupe froide. Casablanca en mouvement.","description":"Streetwear homme premium pense pour le marche marocain, avec paiement comptant a la livraison.","shipping_threshold_cents":100000,"shipping_fee_cents":3500,"announcement_items":["PAIEMENT A LA LIVRAISON PARTOUT AU MAROC","LIVRAISON 24H CASA / 24-48H AUTRES VILLES","CONFIRMATION PAR TELEPHONE AVANT EXPEDITION","ECHANGE TAILLE SOUS 7 JOURS"],"hero_stats":[{"label":"Paiement","value":"A la livraison"},{"label":"Livraison","value":"24-48h"},{"label":"Marche","value":"Maroc"}]}'::jsonb
)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.hero_banners (title, subtitle, eyebrow, cta_label, cta_href, image_url, sort_order)
values (
  'Silhouette noire. Paiement a la livraison.',
  'Capsules streetwear premium pour le Maroc, confirmees par telephone et livrees rapidement.',
  'Capsule Casablanca - Paiement COD',
  'Commander maintenant',
  '/shop',
  '/products/hero-main.jpg',
  1
)
on conflict do nothing;
