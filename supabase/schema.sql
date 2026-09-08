-- =============================================================
-- GenZpt AI production schema
-- =============================================================

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  event_name text not null,
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);
create index if not exists idx_user_memories_user_id on public.user_memories(user_id);
create index if not exists idx_uploaded_files_user_id on public.uploaded_files(user_id);

-- Enable Row Level Security.
alter table public.profiles enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.user_memories enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.analytics_events enable row level security;

-- Simple authenticated-user policies.
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can view own chats"
on public.chat_sessions for select
using (auth.uid() = user_id);

create policy "Users can insert own chats"
on public.chat_sessions for insert
with check (auth.uid() = user_id);

create policy "Users can update own chats"
on public.chat_sessions for update
using (auth.uid() = user_id);

create policy "Users can delete own chats"
on public.chat_sessions for delete
using (auth.uid() = user_id);

create policy "Users can view own messages"
on public.chat_messages for select
using (exists (
  select 1 from public.chat_sessions cs
  where cs.id = chat_messages.session_id and cs.user_id = auth.uid()
));

create policy "Users can insert own messages"
on public.chat_messages for insert
with check (exists (
  select 1 from public.chat_sessions cs
  where cs.id = chat_messages.session_id and cs.user_id = auth.uid()
));

create policy "Users can view own memories"
on public.user_memories for select
using (auth.uid() = user_id);

create policy "Users can insert own memories"
on public.user_memories for insert
with check (auth.uid() = user_id);

create policy "Users can update own memories"
on public.user_memories for update
using (auth.uid() = user_id);

create policy "Users can view own files"
on public.uploaded_files for select
using (auth.uid() = user_id);

create policy "Users can insert own files"
on public.uploaded_files for insert
with check (auth.uid() = user_id);

create policy "Users can view own analytics"
on public.analytics_events for select
using (auth.uid() = user_id);

create policy "Users can insert own analytics"
on public.analytics_events for insert
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
