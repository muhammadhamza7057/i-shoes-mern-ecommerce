create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  phone text not null default '',
  addresses jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  refresh_tokens jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  name text not null,
  slug text not null unique,
  description text not null default '',
  brand text not null default 'I.Shoes',
  images jsonb not null default '[]'::jsonb,
  thumbnail text not null default '',
  base_price numeric(12,2) not null check (base_price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  tags text[] not null default '{}',
  rating_avg numeric(3,2) not null default 0 check (rating_avg between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  sku text not null unique,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  reserved_stock integer not null default 0 check (reserved_stock >= 0 and reserved_stock <= stock),
  sold_stock integer not null default 0 check (sold_stock >= 0),
  unique (product_id, size, color)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  price_snapshot numeric(12,2) not null check (price_snapshot >= 0),
  unique (cart_id, variant_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  shipping_address jsonb not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null default 'COD' check (payment_method in ('COD', 'STRIPE', 'PAYPAL')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  cancel_reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(12,2) not null check (price_at_purchase >= 0),
  product_name text not null default '',
  image text not null default ''
);

create index if not exists products_status_featured_idx on public.products(status, featured);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_idx on public.orders(status);

create or replace function public.reserve_variant_stock(variant uuid, amount integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update product_variants
  set reserved_stock = reserved_stock + amount
  where id = variant and stock - reserved_stock >= amount;
  if not found then raise exception 'Insufficient stock'; end if;
end;
$$;

create or replace function public.release_variant_stock(variant uuid, amount integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update product_variants
  set reserved_stock = greatest(0, reserved_stock - amount)
  where id = variant;
  if not found then raise exception 'Variant not found'; end if;
end;
$$;

create or replace function public.finalize_variant_sale(variant uuid, amount integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update product_variants
  set stock = stock - amount,
      reserved_stock = reserved_stock - amount,
      sold_stock = sold_stock + amount
  where id = variant and stock >= amount and reserved_stock >= amount;
  if not found then raise exception 'Insufficient reserved stock'; end if;
end;
$$;

create or replace function public.finalize_variant_sale(variant uuid, amount integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update product_variants
  set stock = stock - amount,
      reserved_stock = reserved_stock - amount,
      sold_stock = sold_stock + amount
  where id = variant and reserved_stock >= amount and stock >= amount;
  if not found then raise exception 'Insufficient reserved stock'; end if;
end;
$$;