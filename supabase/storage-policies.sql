-- Run after creating bucket "uploads" (public) in Supabase Dashboard → Storage.
-- If policies already exist, drop them first or adjust names.

create policy "uploads_public_read"
  on storage.objects for select to public
  using (bucket_id = 'uploads');

create policy "uploads_admin_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'uploads'
    and lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails)
  );

create policy "uploads_admin_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'uploads'
    and lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails)
  );

create policy "uploads_admin_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'uploads'
    and lower(auth.jwt()->>'email') in (select lower(email) from public.admin_emails)
  );
