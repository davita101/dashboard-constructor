-- Phase 4: Supabase Storage buckets + RLS on storage.objects (custom migration, drizzle-kit only manages `public`).
-- The browser uploads with the Clerk session token (Clerk = third-party auth provider), so these policies are the
-- access control for objects; the server records each upload in `files` after checking the object exists.
--
-- project-files (private, 50 MB): <projectId>/<uuid>/<name>. Members of the project may read, upload, delete.
-- logos (public read, 2 MB, raster images): projects/<projectId>/<uuid>.<ext> and clients/<clientId>/<uuid>.<ext>.
-- Members may upload/delete their projects' logos and the logos of those projects' clients.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-files', 'project-files', false, 52428800, null),
  ('logos', 'logos', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
--> statement-breakpoint
create or replace function public.viewer_project_ids() returns setof text
  language sql stable
  set search_path = ''
as $$
  select project_id::text from public.project_members where user_id = (select auth.jwt() ->> 'sub')
$$;
--> statement-breakpoint
create or replace function public.viewer_client_ids() returns setof text
  language sql stable
  set search_path = ''
as $$
  select client_id::text from public.projects
  where client_id is not null and id::text in (select public.viewer_project_ids())
$$;
--> statement-breakpoint
drop policy if exists "project_files_select_member" on storage.objects;
--> statement-breakpoint
drop policy if exists "project_files_insert_member" on storage.objects;
--> statement-breakpoint
drop policy if exists "project_files_delete_member" on storage.objects;
--> statement-breakpoint
drop policy if exists "logos_select_member" on storage.objects;
--> statement-breakpoint
drop policy if exists "logos_insert_member" on storage.objects;
--> statement-breakpoint
drop policy if exists "logos_delete_member" on storage.objects;
--> statement-breakpoint
create policy "project_files_select_member" on storage.objects for select to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] in (select public.viewer_project_ids()));
--> statement-breakpoint
create policy "project_files_insert_member" on storage.objects for insert to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] in (select public.viewer_project_ids()));
--> statement-breakpoint
create policy "project_files_delete_member" on storage.objects for delete to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] in (select public.viewer_project_ids()));
--> statement-breakpoint
create policy "logos_select_member" on storage.objects for select to authenticated
  using (
    bucket_id = 'logos' and (
      ((storage.foldername(name))[1] = 'projects' and (storage.foldername(name))[2] in (select public.viewer_project_ids()))
      or ((storage.foldername(name))[1] = 'clients' and (storage.foldername(name))[2] in (select public.viewer_client_ids()))
    )
  );
--> statement-breakpoint
create policy "logos_insert_member" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'logos' and (
      ((storage.foldername(name))[1] = 'projects' and (storage.foldername(name))[2] in (select public.viewer_project_ids()))
      or ((storage.foldername(name))[1] = 'clients' and (storage.foldername(name))[2] in (select public.viewer_client_ids()))
    )
  );
--> statement-breakpoint
create policy "logos_delete_member" on storage.objects for delete to authenticated
  using (
    bucket_id = 'logos' and (
      ((storage.foldername(name))[1] = 'projects' and (storage.foldername(name))[2] in (select public.viewer_project_ids()))
      or ((storage.foldername(name))[1] = 'clients' and (storage.foldername(name))[2] in (select public.viewer_client_ids()))
    )
  );
