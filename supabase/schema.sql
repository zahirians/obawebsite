-- OBA Zahira Mawanella — run in Supabase SQL Editor (new project)
-- After: Auth → Providers → enable Google; add Site URL / Redirect URLs
-- Storage: create bucket named "uploads" (public)

-- Extensions
create extension if not exists "pgcrypto";

-- ============ Admin allowlist (only these emails can write) ============
create table public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;

-- No public access to list all admins; admins may verify their own row
create policy "admin_self_read"
  on public.admin_emails for select
  to authenticated
  using (lower(email) = lower(auth.jwt()->>'email'));

-- ============ Home highlight (single row id = 1) ============
create table public.home_highlight (
  id smallint primary key default 1 check (id = 1),
  image_url text,
  title text default 'Alumni Membership',
  description text,
  button_label text default 'Become a Member',
  button_href text default '/alumni/membership',
  updated_at timestamptz default now()
);

alter table public.home_highlight enable row level security;

insert into public.home_highlight (id) values (1) on conflict do nothing;

create policy "home_highlight_select_public"
  on public.home_highlight for select to anon, authenticated using (true);

create policy "home_highlight_write_admins"
  on public.home_highlight for all to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails))
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Membership page content ============
create table public.membership_content (
  id smallint primary key default 1 check (id = 1),
  summary text,
  benefits_md text,
  updated_at timestamptz default now()
);

alter table public.membership_content enable row level security;

insert into public.membership_content (id) values (1) on conflict do nothing;

create policy "membership_select_public"
  on public.membership_content for select to anon, authenticated using (true);

create policy "membership_write_admins"
  on public.membership_content for all to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails))
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ News ============
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  image_url text,
  published_at timestamptz default now()
);

create index news_published_at_idx on public.news (published_at desc);

alter table public.news enable row level security;

create policy "news_select_public"
  on public.news for select to anon, authenticated using (true);

create policy "news_insert_admins"
  on public.news for insert to authenticated
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "news_update_admins"
  on public.news for update to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "news_delete_admins"
  on public.news for delete to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Branches ============
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  since_year int,
  description text,
  members_photo_url text,
  created_at timestamptz default now()
);

alter table public.branches enable row level security;

create policy "branches_select_public"
  on public.branches for select to anon, authenticated using (true);

create policy "branches_insert_admins"
  on public.branches for insert to authenticated
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "branches_update_admins"
  on public.branches for update to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "branches_delete_admins"
  on public.branches for delete to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Batches ============
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  logo_url text,
  official_title text,
  custom_title text,
  ol_year int,
  al_year int,
  description text,
  exco_photo_url text,
  created_at timestamptz default now()
);

alter table public.batches enable row level security;

create policy "batches_select_public"
  on public.batches for select to anon, authenticated using (true);

create policy "batches_insert_admins"
  on public.batches for insert to authenticated
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "batches_update_admins"
  on public.batches for update to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "batches_delete_admins"
  on public.batches for delete to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Associations ============
create table public.associations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  exco_photo_url text,
  created_at timestamptz default now()
);

alter table public.associations enable row level security;

create policy "associations_select_public"
  on public.associations for select to anon, authenticated using (true);

create policy "associations_insert_admins"
  on public.associations for insert to authenticated
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "associations_update_admins"
  on public.associations for update to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "associations_delete_admins"
  on public.associations for delete to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Projects (exactly one parent FK set) ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  link_url text,
  sort_order int default 0,
  branch_id uuid references public.branches(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete cascade,
  association_id uuid references public.associations(id) on delete cascade,
  constraint projects_one_parent check (
    (branch_id is not null)::int + (batch_id is not null)::int + (association_id is not null)::int = 1
  )
);

create index projects_branch_idx on public.projects (branch_id);
create index projects_batch_idx on public.projects (batch_id);
create index projects_association_idx on public.projects (association_id);

alter table public.projects enable row level security;

create policy "projects_select_public"
  on public.projects for select to anon, authenticated using (true);

create policy "projects_insert_admins"
  on public.projects for insert to authenticated
  with check (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "projects_update_admins"
  on public.projects for update to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

create policy "projects_delete_admins"
  on public.projects for delete to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- ============ Contact form (optional; anon can submit) ============
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.contact_submissions enable row level security;

create policy "contact_insert_anon"
  on public.contact_submissions for insert to anon, authenticated
  with check (true);

create policy "contact_select_admins"
  on public.contact_submissions for select to authenticated
  using (lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails));

-- Storage: create a public bucket named "uploads" in Dashboard, then run supabase/storage-policies.sql

-- ============ Seed branch placeholders (edit in admin) ============
insert into public.branches (slug, name, since_year, description)
values
  ('uae', 'UAE Branch', null, 'Dedicated page for our UAE old boys.'),
  ('qatar', 'Qatar Branch', null, 'Dedicated page for our Qatar old boys.'),
  ('kuwait', 'Kuwait Branch', null, 'Dedicated page for our Kuwait old boys.'),
  ('riyadh', 'Riyadh Branch', null, 'Dedicated page for our Riyadh old boys.'),
  ('colombo', 'Colombo Branch', null, 'Dedicated page for our Colombo old boys.')
on conflict (slug) do nothing;

-- IMPORTANT: Add admin email(s) in lowercase:
-- insert into public.admin_emails (email) values (lower('You@Example.com'));

</think>
Fixing a typo in the SQL file: remove the erroneous policy and correct `associations_insert_admins`.

<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Read