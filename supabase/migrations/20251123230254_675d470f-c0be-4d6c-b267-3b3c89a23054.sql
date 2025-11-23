-- Add fields for professional quote presentation
ALTER TABLE public.cotizaciones
  ADD COLUMN solicitante_nombre TEXT,
  ADD COLUMN solicitante_empresa TEXT,
  ADD COLUMN solicitante_telefono TEXT,
  ADD COLUMN solicitante_email TEXT,
  ADD COLUMN vendedor_id UUID REFERENCES public.empleados(id),
  ADD COLUMN carta_presentacion TEXT;

-- Add comments
COMMENT ON COLUMN public.cotizaciones.solicitante_nombre IS 'Nombre del solicitante de la cotización';
COMMENT ON COLUMN public.cotizaciones.solicitante_empresa IS 'Empresa del solicitante';
COMMENT ON COLUMN public.cotizaciones.solicitante_telefono IS 'Teléfono del solicitante';
COMMENT ON COLUMN public.cotizaciones.solicitante_email IS 'Email del solicitante';
COMMENT ON COLUMN public.cotizaciones.vendedor_id IS 'Empleado que genera la cotización';
COMMENT ON COLUMN public.cotizaciones.carta_presentacion IS 'Texto de carta de presentación personalizado';