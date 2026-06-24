-- Run this in your Supabase SQL editor

create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- Index for fast date queries on the admin dashboard
create index if not exists waitlist_created_at_idx on waitlist (created_at desc);

-- Disable public reads — only the service role key (server-side) can read
alter table waitlist enable row level security;

create policy "No public access" on waitlist
  for all
  using (false);
