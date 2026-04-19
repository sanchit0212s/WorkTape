-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type public.genre as enum (
  'photographer',
  'graphic-designer',
  'ui-ux-designer',
  'writer',
  '3d-artist',
  'developer'
);

create type public.portfolio_status as enum ('draft', 'published');

create type public.subscription_status as enum (
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete'
);

-- Users table (extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Portfolios
create table public.portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  genre public.genre not null,
  slug text unique,
  status public.portfolio_status not null default 'draft',
  display_name text not null default '',
  tagline text not null default '',
  bio_bullets text[] not null default '{}',
  ai_bio text,
  profile_photo_url text,
  social_links jsonb not null default '{}',
  custom_headline text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_portfolio_per_user unique (user_id)
);

create index idx_portfolios_slug on public.portfolios(slug);
create index idx_portfolios_user_id on public.portfolios(user_id);

-- Projects
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  title text not null,
  description text,
  ai_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_portfolio_id on public.projects(portfolio_id);

-- Project images
create table public.project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index idx_project_images_project_id on public.project_images(project_id);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  razorpay_customer_id text not null default '',
  razorpay_subscription_id text unique,
  status public.subscription_status not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_subscription_per_user unique (user_id)
);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.portfolios
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.users enable row level security;
alter table public.portfolios enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.subscriptions enable row level security;

-- Users: read/update own row
create policy "Users can read own data"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own data"
  on public.users for update using (auth.uid() = id);

-- Portfolios: owner full access, public read for published
create policy "Owners have full access to own portfolio"
  on public.portfolios for all using (auth.uid() = user_id);
create policy "Published portfolios are publicly readable"
  on public.portfolios for select using (status = 'published');

-- Projects: owner via portfolio, public for published
create policy "Owners manage own projects"
  on public.projects for all using (
    portfolio_id in (select id from public.portfolios where user_id = auth.uid())
  );
create policy "Published portfolio projects are publicly readable"
  on public.projects for select using (
    portfolio_id in (select id from public.portfolios where status = 'published')
  );

-- Project images: owner via project->portfolio, public for published
create policy "Owners manage own project images"
  on public.project_images for all using (
    project_id in (
      select p.id from public.projects p
      join public.portfolios pf on pf.id = p.portfolio_id
      where pf.user_id = auth.uid()
    )
  );
create policy "Published portfolio images are publicly readable"
  on public.project_images for select using (
    project_id in (
      select p.id from public.projects p
      join public.portfolios pf on pf.id = p.portfolio_id
      where pf.status = 'published'
    )
  );

-- Subscriptions: users read own, writes via service role only
create policy "Users can read own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- Storage buckets
-- ============================================================

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);

-- Storage policies: users upload to their own folder
create policy "Users can upload avatars"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Users can update own avatars"
  on storage.objects for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Users can delete own avatars"
  on storage.objects for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Avatars are publicly readable"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload project images"
  on storage.objects for insert with check (
    bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Users can update own project images"
  on storage.objects for update using (
    bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Users can delete own project images"
  on storage.objects for delete using (
    bucket_id = 'project-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Project images are publicly readable"
  on storage.objects for select using (bucket_id = 'project-images');
