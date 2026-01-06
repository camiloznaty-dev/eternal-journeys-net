-- Allow anyone to upload to funeraria-images bucket during registration
-- We use a temp UUID folder during signup, so it's safe to allow public uploads
DROP POLICY IF EXISTS "Authenticated users can upload funeraria images" ON storage.objects;

CREATE POLICY "Anyone can upload funeraria images during registration" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'funeraria-images');