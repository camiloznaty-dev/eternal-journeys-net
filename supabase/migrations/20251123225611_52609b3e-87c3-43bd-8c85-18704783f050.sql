-- Add sepultacion/cremacion and time fields to casos_servicios
ALTER TABLE public.casos_servicios
  ADD COLUMN lugar_sepultacion_cremacion TEXT,
  ADD COLUMN hora_llegada TIME;

-- Create table for case documents
CREATE TABLE IF NOT EXISTS public.caso_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caso_id UUID NOT NULL REFERENCES public.casos_servicios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL, -- 'pase_sepultacion', 'certificado_defuncion', 'permiso', 'contrato', 'otro'
  archivo_url TEXT NOT NULL,
  archivo_size INTEGER,
  mime_type TEXT,
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subido_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on caso_documentos
ALTER TABLE public.caso_documentos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for caso_documentos
CREATE POLICY "Funerarias can manage their caso documentos"
  ON public.caso_documentos
  FOR ALL
  USING (
    caso_id IN (
      SELECT c.id FROM public.casos_servicios c
      WHERE c.funeraria_id IN (
        SELECT e.funeraria_id FROM public.empleados e
        WHERE e.user_id = auth.uid() AND e.activo = true
      )
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_caso_documentos_updated_at
  BEFORE UPDATE ON public.caso_documentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_caso_documentos_caso ON public.caso_documentos(caso_id);

-- Add comments for documentation
COMMENT ON COLUMN public.casos_servicios.lugar_sepultacion_cremacion IS 'Lugar donde se realizará la sepultación o cremación';
COMMENT ON COLUMN public.casos_servicios.hora_llegada IS 'Hora de llegada al lugar de sepultación o cremación';
COMMENT ON TABLE public.caso_documentos IS 'Documentos asociados a casos (pase de sepultación, certificados, etc)';

-- Create storage bucket for caso documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('caso-documentos', 'caso-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for caso documents
CREATE POLICY "Funerarias can upload caso documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'caso-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can view their caso documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'caso-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can update their caso documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'caso-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can delete their caso documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'caso-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );