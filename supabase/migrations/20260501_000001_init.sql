create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.oripa_apps (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spend_logs (
  id uuid primary key default gen_random_uuid(),
  oripa_app_id uuid not null references public.oripa_apps(id) on delete cascade,
  amount integer not null check (amount >= 0),
  spend_date date not null,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rarity text,
  model_number text,
  quantity integer not null default 1 check (quantity >= 0),
  condition text,
  oripa_app_id uuid references public.oripa_apps(id) on delete set null,
  current_market_price integer not null default 0 check (current_market_price >= 0),
  image_url text,
  memo text,
  status text not null default 'holding' check (status in ('holding', 'sold')),
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  sold_price integer not null check (sold_price >= 0),
  sold_date date not null,
  sold_to text,
  fee integer not null default 0 check (fee >= 0),
  shipping integer not null default 0 check (shipping >= 0),
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.shop_prices (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  shop_name text not null,
  buy_price integer check (buy_price >= 0),
  sell_price integer check (sell_price >= 0),
  price_date date not null,
  memo text,
  created_at timestamptz not null default now()
);

create index if not exists idx_spend_logs_oripa_app_id on public.spend_logs(oripa_app_id);
create index if not exists idx_spend_logs_spend_date on public.spend_logs(spend_date desc);
create index if not exists idx_cards_oripa_app_id on public.cards(oripa_app_id);
create index if not exists idx_cards_status on public.cards(status);
create index if not exists idx_cards_name on public.cards(name);
create index if not exists idx_sales_card_id on public.sales(card_id);
create index if not exists idx_sales_sold_date on public.sales(sold_date desc);
create index if not exists idx_shop_prices_card_id on public.shop_prices(card_id);
create index if not exists idx_shop_prices_price_date on public.shop_prices(price_date desc);

drop trigger if exists set_oripa_apps_updated_at on public.oripa_apps;
create trigger set_oripa_apps_updated_at
before update on public.oripa_apps
for each row
execute function public.set_updated_at();

drop trigger if exists set_spend_logs_updated_at on public.spend_logs;
create trigger set_spend_logs_updated_at
before update on public.spend_logs
for each row
execute function public.set_updated_at();

drop trigger if exists set_cards_updated_at on public.cards;
create trigger set_cards_updated_at
before update on public.cards
for each row
execute function public.set_updated_at();
