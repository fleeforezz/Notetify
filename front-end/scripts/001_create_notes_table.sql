-- Create notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  color text default 'yellow',
  is_archived boolean default false,
  is_pinned boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.notes enable row level security;

-- RLS Policies - users can only access their own notes
create policy "notes_select_own" on public.notes 
  for select using (auth.uid() = user_id);

create policy "notes_insert_own" on public.notes 
  for insert with check (auth.uid() = user_id);

create policy "notes_update_own" on public.notes 
  for update using (auth.uid() = user_id);

create policy "notes_delete_own" on public.notes 
  for delete using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_created_at_idx on public.notes(created_at desc);
