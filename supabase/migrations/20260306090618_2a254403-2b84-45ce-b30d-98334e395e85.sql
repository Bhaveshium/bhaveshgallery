
-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Public can view media files
CREATE POLICY "Media files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Authenticated users can upload media
CREATE POLICY "Auth users can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

-- Authenticated users can update their media
CREATE POLICY "Auth users can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');

-- Authenticated users can delete media
CREATE POLICY "Auth users can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');
