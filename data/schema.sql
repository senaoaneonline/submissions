-- Supabase / Postgres schema for Senaoane
create table users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  area text,
  interest text,
  whatsapp text,
  created_at timestamp default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  user_name text,
  category text check (category in ('SPORTS','COMMUNITY','JOBS','EVENTS','NEWS','GENERAL')),
  title text not null,
  description text,
  youtube_url text,
  youtube_id text,
  image_data text, -- for GitHub Pages demo, use storage URL in production
  image_url text,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table users enable row level security;
alter table posts enable row level security;
create policy "public read" on posts for select using (true);
create policy "public insert" on posts for insert with check (true);
create policy "public read users" on users for select using (true);
create policy "public insert users" on users for insert with check (true);

-- Storage bucket for images (create in Supabase dashboard: senaoane-images, public)
