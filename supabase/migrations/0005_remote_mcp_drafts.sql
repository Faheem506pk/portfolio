-- Remote MCP server for Medium drafts: daily quota, burst limit and an audit log.
-- Safe to re-run. Nothing here is readable by the browser: RLS is on with no policies, and the functions
-- are executable only by the service role (used by the server route).

create table if not exists public.mcp_daily_usage (
  day  date primary key,
  used integer not null default 0 check (used >= 0)
);

create table if not exists public.mcp_draft_log (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client_id  text        not null,           -- short fingerprint of the token, never the token
  post_id    bigint      references public.posts (id) on delete set null,
  title      text
);

create index if not exists mcp_draft_log_created_idx on public.mcp_draft_log (created_at desc);

alter table public.mcp_daily_usage enable row level security;
alter table public.mcp_draft_log enable row level security;

-- Atomically take one slot for today (UTC). Returns false when the burst limit or the daily limit is reached.
create or replace function public.mcp_take_slot(day_max integer, minute_max integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ok boolean;
  recent integer;
begin
  select count(*) into recent
    from public.mcp_draft_log
   where created_at > now() - interval '1 minute';
  if recent >= minute_max then
    return false;
  end if;

  insert into public.mcp_daily_usage as u (day, used)
  values ((now() at time zone 'utc')::date, 1)
  on conflict (day) do update set used = u.used + 1
    where u.used < day_max
  returning true into ok;

  return coalesce(ok, false);
end;
$$;

-- Give a slot back when the insert that followed it failed.
create or replace function public.mcp_release_slot()
returns void
language sql
security definer
set search_path = public
as $$
  update public.mcp_daily_usage
     set used = greatest(used - 1, 0)
   where day = (now() at time zone 'utc')::date;
$$;

create or replace function public.mcp_quota()
returns integer
language sql
security definer
set search_path = public
as $$
  select coalesce((select used from public.mcp_daily_usage where day = (now() at time zone 'utc')::date), 0);
$$;

revoke all on function public.mcp_take_slot(integer, integer) from public, anon, authenticated;
revoke all on function public.mcp_release_slot() from public, anon, authenticated;
revoke all on function public.mcp_quota() from public, anon, authenticated;
grant execute on function public.mcp_take_slot(integer, integer) to service_role;
grant execute on function public.mcp_release_slot() to service_role;
grant execute on function public.mcp_quota() to service_role;
