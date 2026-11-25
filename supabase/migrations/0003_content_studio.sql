-- Content studio: Medium tracking on posts + a writing pipeline (story ideas).
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- 1. Medium tracking columns on posts
-- ---------------------------------------------------------------------------
alter table public.posts
  add column if not exists medium_status text not null default 'not_on_medium',
  add column if not exists medium_url text,
  add column if not exists medium_published_at timestamptz,
  add column if not exists paywall boolean not null default false,
  add column if not exists ai_assisted boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'posts_medium_status_check'
  ) then
    alter table public.posts
      add constraint posts_medium_status_check
      check (medium_status in ('not_on_medium', 'draft_on_medium', 'published_on_medium'));
  end if;
end $$;

create index if not exists posts_medium_status_idx on public.posts (medium_status);

-- ---------------------------------------------------------------------------
-- 2. Story ideas (writing pipeline). Private: admin only, never public.
-- ---------------------------------------------------------------------------
create table if not exists public.story_ideas (
  id          bigint generated always as identity primary key,
  number      integer     not null unique,
  title       text        not null,
  pillar      text        not null default '',
  kind        text        not null default 'needs_details'
              check (kind in ('needs_details', 'from_sources')),
  score       integer     not null default 0 check (score between 0 and 20),
  status      text        not null default 'idea'
              check (status in ('idea', 'needs_details', 'drafting', 'review', 'ready', 'published')),
  brief_path  text,
  notes       text        not null default '',
  post_id     bigint      references public.posts (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists story_ideas_status_idx on public.story_ideas (status, score desc);

drop trigger if exists story_ideas_set_updated_at on public.story_ideas;
create trigger story_ideas_set_updated_at
  before update on public.story_ideas
  for each row execute function public.set_updated_at();

alter table public.story_ideas enable row level security;

drop policy if exists "authenticated users manage story ideas" on public.story_ideas;
create policy "authenticated users manage story ideas"
  on public.story_ideas
  for all
  to authenticated
  using (true)
  with check (true);
