-- ============================================================================
-- Hamro College — Supabase Migration
-- Run once in the Supabase SQL Editor (or via supabase db push).
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ── Colleges ────────────────────────────────────────────────────────────────
create table if not exists public.colleges (
  slug              text primary key,
  name              text not null,
  short_name        text,
  tier              text not null check (tier in ('internal', 'regional_hub', 'international')),
  country           text not null,
  city              text not null,
  affiliation       text,
  accreditation     text,
  established       integer,
  description       text,
  lat               numeric(10,6),
  lng               numeric(10,6),
  currency          text not null default 'NPR',
  tuition_annual    numeric(14,2) not null,
  one_time_fees     numeric(14,2) not null default 0,
  duration_years    numeric(4,1) not null default 4,
  avg_package       numeric(14,2),
  nepali_students   integer,
  nepali_alumni     integer,
  safety_index      numeric(4,1),
  hostel_capacity   integer,
  mandatory_pg      boolean not null default false,
  installments      boolean not null default true,
  distance_km       numeric(10,1),
  connectivity      text,
  work_hours_per_week numeric(5,1),
  post_study_visa_years numeric(4,1),
  min_gpa           numeric(3,2),
  english_test      text,
  courses           jsonb,
  highlights        jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_colleges_tier    on public.colleges (tier);
create index if not exists idx_colleges_country on public.colleges (country);
create index if not exists idx_colleges_city    on public.colleges (city);

-- ── Reviews ─────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id                text primary key,
  college_slug      text not null references public.colleges(slug) on delete cascade,
  author_name       text not null,
  author_email_hash text,
  verification_type text not null default 'none',
  verified          boolean not null default false,
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  academic_rating   smallint not null check (academic_rating between 1 and 5),
  housing_rating    smallint not null check (housing_rating between 1 and 5),
  placement_rating  smallint not null check (placement_rating between 1 and 5),
  review_text       text not null check (char_length(review_text) >= 20),
  created_at        timestamptz not null default now()
);

create index if not exists idx_reviews_college on public.reviews (college_slug);
create index if not exists idx_reviews_status  on public.reviews (status);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.colleges enable row level security;
alter table public.reviews  enable row level security;

-- Colleges: public read
create policy "colleges_public_read" on public.colleges
  for select using (true);

-- Reviews: only approved reviews are public; anyone can insert (pending)
create policy "reviews_public_read" on public.reviews
  for select using (status = 'approved');

create policy "reviews_insert_anyone" on public.reviews
  for insert with check (true);
