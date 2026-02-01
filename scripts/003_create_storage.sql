-- Create storage bucket for resource files
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

-- Create storage bucket for user avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies for resources bucket
-- Allow authenticated users to upload to their own folder
create policy "resources_upload_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own files
create policy "resources_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own files
create policy "resources_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access
create policy "resources_read_public" on storage.objects
  for select to public
  using (bucket_id = 'resources');

-- Storage policies for avatars bucket
-- Allow authenticated users to upload to their own folder
create policy "avatars_upload_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own files
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own files
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access
create policy "avatars_read_public" on storage.objects
  for select to public
  using (bucket_id = 'avatars');
