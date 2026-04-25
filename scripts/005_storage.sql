-- Pyro Wear — storage buckets for admin image uploads.
-- Run in Supabase SQL editor after the previous scripts.

-- Buckets are public-read so storefront <Image> can fetch directly.
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('hero-banners', 'hero-banners', true),
  ('category-images', 'category-images', true)
on conflict (id) do update set public = excluded.public;

-- Public can read, only authenticated admins (via service role) can write.
-- Service role bypasses RLS, so no insert/update/delete policies are needed
-- for the admin actions. Public select is required for the storefront.

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id in ('product-images','hero-banners','category-images'));
