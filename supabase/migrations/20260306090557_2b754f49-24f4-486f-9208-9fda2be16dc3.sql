
-- Media table for portfolio items
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'SELECTED',
  type text NOT NULL DEFAULT 'image',
  file_url text NOT NULL,
  thumbnail_url text,
  width integer,
  height integer,
  photographer text DEFAULT '',
  client text DEFAULT '',
  location text DEFAULT '',
  details text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Public can view all media
CREATE POLICY "Anyone can view media" ON public.media FOR SELECT USING (true);

-- Only authenticated users can manage their media
CREATE POLICY "Auth users can insert media" ON public.media FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users can update media" ON public.media FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Auth users can delete media" ON public.media FOR DELETE TO authenticated USING (auth.uid() = user_id);
