create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  room text not null check (room ~ '^(general|math|physics|(math|physics)-(2025|2026)-(a[1-5]|b[1-4]|c[1-4]|d[1-4]))$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists comments_room_created_at_idx on public.comments (room, created_at desc);
alter table public.comments enable row level security;
