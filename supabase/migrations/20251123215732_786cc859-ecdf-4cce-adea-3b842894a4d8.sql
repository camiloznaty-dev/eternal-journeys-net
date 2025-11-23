-- Create storage bucket for funeraria images
INSERT INTO storage.buckets (id, name, public)
VALUES ('funeraria-images', 'funeraria-images', true);

-- Create policies for funeraria images bucket
CREATE POLICY "Anyone can view funeraria images"
ON storage.objects FOR SELECT
USING (bucket_id = 'funeraria-images');

CREATE POLICY "Authenticated users can upload funeraria images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'funeraria-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their funeraria images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'funeraria-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their funeraria images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'funeraria-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);