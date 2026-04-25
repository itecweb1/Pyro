-- Enable RLS everywhere, then define explicit policies.

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.hero_banners enable row level security;

-- PROFILES: users manage their own row only
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- CATALOG: public read, no public write. Admins write via service role.
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "product_images_public_read" on public.product_images;
drop policy if exists "product_variants_public_read" on public.product_variants;

create policy "categories_public_read" on public.categories for select using (true);
create policy "products_public_read" on public.products for select using (is_active = true);
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_variants_public_read" on public.product_variants for select using (true);

-- CART: users manage their own cart only
drop policy if exists "cart_select_own" on public.cart_items;
drop policy if exists "cart_insert_own" on public.cart_items;
drop policy if exists "cart_update_own" on public.cart_items;
drop policy if exists "cart_delete_own" on public.cart_items;

create policy "cart_select_own" on public.cart_items for select using (auth.uid() = user_id);
create policy "cart_insert_own" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "cart_update_own" on public.cart_items for update using (auth.uid() = user_id);
create policy "cart_delete_own" on public.cart_items for delete using (auth.uid() = user_id);

-- ORDERS: users can read/insert their own orders. No updates from client side.
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);

-- ORDER ITEMS: read only if parent order belongs to user
drop policy if exists "order_items_select_own" on public.order_items;
drop policy if exists "order_items_insert_own" on public.order_items;

create policy "order_items_select_own" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);
create policy "order_items_insert_own" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

-- NEWSLETTER: anyone can subscribe, no one can read from client
drop policy if exists "newsletter_insert_anyone" on public.newsletter_subscribers;

create policy "newsletter_insert_anyone" on public.newsletter_subscribers for insert with check (true);

-- ADDRESSES: users manage their own addresses
drop policy if exists "addresses_select_own" on public.addresses;
drop policy if exists "addresses_insert_own" on public.addresses;
drop policy if exists "addresses_update_own" on public.addresses;
drop policy if exists "addresses_delete_own" on public.addresses;

create policy "addresses_select_own" on public.addresses for select using (auth.uid() = user_id);
create policy "addresses_insert_own" on public.addresses for insert with check (auth.uid() = user_id);
create policy "addresses_update_own" on public.addresses for update using (auth.uid() = user_id);
create policy "addresses_delete_own" on public.addresses for delete using (auth.uid() = user_id);

-- WISHLIST: users manage their own saved products
drop policy if exists "wishlist_select_own" on public.wishlist_items;
drop policy if exists "wishlist_insert_own" on public.wishlist_items;
drop policy if exists "wishlist_delete_own" on public.wishlist_items;

create policy "wishlist_select_own" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist_items for delete using (auth.uid() = user_id);

-- PUBLIC MARKETING READS
drop policy if exists "coupons_no_public_read" on public.coupons;
drop policy if exists "reviews_public_approved" on public.reviews;
drop policy if exists "site_settings_public_read" on public.site_settings;
drop policy if exists "hero_banners_public_read" on public.hero_banners;

create policy "reviews_public_approved" on public.reviews for select using (is_approved = true);
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "hero_banners_public_read" on public.hero_banners for select using (is_active = true);
