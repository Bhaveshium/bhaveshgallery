DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete media" ON storage.objects;

CREATE POLICY "Owners can list their media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth users can upload own media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);