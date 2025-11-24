-- Create blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  slug TEXT NOT NULL UNIQUE,
  bajada TEXT,
  contenido TEXT NOT NULL,
  imagen_portada TEXT,
  autor_id UUID REFERENCES auth.users(id),
  autor_nombre TEXT,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado', 'archivado')),
  
  -- SEO Fields
  meta_titulo TEXT,
  meta_descripcion TEXT,
  meta_keywords TEXT[],
  og_image TEXT,
  
  -- Analytics
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (estado = 'publicado');

-- Superadmins can manage all blog posts
CREATE POLICY "Superadmins can manage all blog posts"
ON public.blog_posts
FOR ALL
USING (has_role(auth.uid(), 'superadmin'));

-- Create index for slug lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_estado ON public.blog_posts(estado);
CREATE INDEX idx_blog_posts_fecha_publicacion ON public.blog_posts(fecha_publicacion DESC);

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Superadmins can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Superadmins can update blog images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Superadmins can delete blog images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'superadmin')
);