ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS photo_type text DEFAULT '',
  ADD COLUMN IF NOT EXISTS date_taken date,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];