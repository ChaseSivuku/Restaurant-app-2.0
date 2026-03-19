-- Supabase SQL Editor: fix signup "profiles" RLS inserts
--
-- Run this in your Supabase Dashboard → SQL Editor.
-- Assumes `public.profiles.id` is a UUID that matches `auth.users.id`.

-- 1) Ensure RLS is enabled (recommended)
alter table if exists public.profiles enable row level security;

-- 2) Basic owner policies (mobile app users)
-- Non-destructive: only creates policies if they don't already exist.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_select_own'
  ) then
    execute $pol$
      create policy "profiles_select_own"
      on public.profiles
      for select
      to authenticated
      using (auth.uid() = id);
    $pol$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_insert_own'
  ) then
    execute $pol$
      create policy "profiles_insert_own"
      on public.profiles
      for insert
      to authenticated
      with check (auth.uid() = id);
    $pol$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_own'
  ) then
    execute $pol$
      create policy "profiles_update_own"
      on public.profiles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
    $pol$;
  end if;
end
$$;

-- Optional (recommended): automatically create profile rows on auth signup.
-- This avoids client-side inserts entirely and works even if email confirmations are enabled.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    name,
    surname,
    contact_number,
    address,
    card_last4,
    card_type
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'surname', ''),
    new.raw_user_meta_data->>'contact_number',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'card_last4',
    new.raw_user_meta_data->>'card_type'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Non-destructive: only creates the trigger if it doesn't exist.
do $$
begin
  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'on_auth_user_created'
      and n.nspname = 'auth'
      and c.relname = 'users'
  ) then
    execute $trg$
      create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
    $trg$;
  end if;
end
$$;

