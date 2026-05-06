alter table public.cards
add column if not exists sold_at timestamptz;

alter table public.cards
alter column sold_at type timestamptz
using (
  case
    when sold_at is null then null
    else sold_at::timestamptz
  end
);
