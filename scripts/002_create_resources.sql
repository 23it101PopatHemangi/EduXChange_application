-- Create resources table for academic materials
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('pdf', 'notes', 'video', 'image', 'link')),
  subject text,
  course_code text,
  file_url text,
  file_name text,
  file_size bigint,
  mime_type text,
  external_link text,
  download_count integer default 0,
  view_count integer default 0,
  is_public boolean default true,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resources enable row level security;

-- Policies for resources
create policy "resources_select_public" on public.resources 
  for select using (is_public = true or auth.uid() = user_id);

create policy "resources_insert_own" on public.resources 
  for insert with check (auth.uid() = user_id);

create policy "resources_update_own" on public.resources 
  for update using (auth.uid() = user_id);

create policy "resources_delete_own" on public.resources 
  for delete using (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists resources_user_id_idx on public.resources(user_id);
create index if not exists resources_resource_type_idx on public.resources(resource_type);
create index if not exists resources_created_at_idx on public.resources(created_at desc);
