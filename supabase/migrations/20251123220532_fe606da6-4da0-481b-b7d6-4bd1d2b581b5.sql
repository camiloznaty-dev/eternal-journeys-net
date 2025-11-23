-- Add service categories enum
CREATE TYPE public.service_category AS ENUM (
  'plan_funerario',
  'traslado',
  'cremacion',
  'arreglo_floral',
  'velorio',
  'ceremonia',
  'lapida',
  'urna',
  'otro'
);

-- Update servicios table with new fields
ALTER TABLE public.servicios
ADD COLUMN category service_category NOT NULL DEFAULT 'otro',
ADD COLUMN features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN images text[] DEFAULT ARRAY[]::text[],
ADD COLUMN sku text,
ADD COLUMN is_featured boolean DEFAULT false,
ADD COLUMN stock_available boolean DEFAULT true;

-- Update RLS policies for servicios
DROP POLICY IF EXISTS "Anyone can view servicios" ON public.servicios;

-- Allow anyone to view servicios
CREATE POLICY "Anyone can view servicios"
ON public.servicios
FOR SELECT
USING (true);

-- Allow funerarias to insert their own servicios
CREATE POLICY "Funerarias can insert servicios"
ON public.servicios
FOR INSERT
WITH CHECK (
  funeraria_id IN (
    SELECT funeraria_id
    FROM empleados
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Allow funerarias to update their own servicios
CREATE POLICY "Funerarias can update their servicios"
ON public.servicios
FOR UPDATE
USING (
  funeraria_id IN (
    SELECT funeraria_id
    FROM empleados
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Allow funerarias to delete their own servicios
CREATE POLICY "Funerarias can delete their servicios"
ON public.servicios
FOR DELETE
USING (
  funeraria_id IN (
    SELECT funeraria_id
    FROM empleados
    WHERE user_id = auth.uid() AND activo = true
  )
);