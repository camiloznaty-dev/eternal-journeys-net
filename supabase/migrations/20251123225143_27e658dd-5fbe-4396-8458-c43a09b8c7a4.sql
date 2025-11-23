-- Rename existing columns to match new terminology
ALTER TABLE public.casos_servicios 
  RENAME COLUMN difunto_nombre TO fallecido_nombre;

ALTER TABLE public.casos_servicios 
  RENAME COLUMN difunto_apellido TO fallecido_apellido;

ALTER TABLE public.casos_servicios 
  RENAME COLUMN fecha_ceremonia TO fecha_funeral;

-- Drop the old ubicacion_velorio column and add new structured fields
ALTER TABLE public.casos_servicios 
  DROP COLUMN ubicacion_velorio;

ALTER TABLE public.casos_servicios
  ADD COLUMN tipo_lugar_velorio TEXT CHECK (tipo_lugar_velorio IN ('casa', 'iglesia', 'cementerio', 'otro')),
  ADD COLUMN direccion_velorio TEXT;

-- Add new contact and sales fields
ALTER TABLE public.casos_servicios
  ADD COLUMN contratante TEXT,
  ADD COLUMN contratante_telefono TEXT,
  ADD COLUMN contratante_email TEXT,
  ADD COLUMN familiar_a_cargo TEXT,
  ADD COLUMN familiar_telefono TEXT,
  ADD COLUMN vendedor_id UUID REFERENCES public.empleados(id);

-- Add funeral planning fields
ALTER TABLE public.casos_servicios
  ADD COLUMN carroza_tipo TEXT, -- presidencial, panoramica, estandar, etc
  ADD COLUMN carroza_patente TEXT,
  ADD COLUMN vehiculo_acompanamiento TEXT,
  ADD COLUMN vehiculo_acompanamiento_patente TEXT,
  ADD COLUMN cantidad_arreglos_florales INTEGER DEFAULT 0,
  ADD COLUMN usa_cuota_mortuoria BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN public.casos_servicios.fallecido_nombre IS 'Nombre del fallecido';
COMMENT ON COLUMN public.casos_servicios.fallecido_apellido IS 'Apellido del fallecido';
COMMENT ON COLUMN public.casos_servicios.fecha_funeral IS 'Fecha del funeral';
COMMENT ON COLUMN public.casos_servicios.tipo_lugar_velorio IS 'Tipo de lugar: casa, iglesia, cementerio, otro';
COMMENT ON COLUMN public.casos_servicios.direccion_velorio IS 'Dirección del lugar del velorio';
COMMENT ON COLUMN public.casos_servicios.contratante IS 'Nombre del contratante del servicio';
COMMENT ON COLUMN public.casos_servicios.familiar_a_cargo IS 'Nombre del familiar a cargo';
COMMENT ON COLUMN public.casos_servicios.vendedor_id IS 'Empleado que vendió el servicio';
COMMENT ON COLUMN public.casos_servicios.carroza_tipo IS 'Tipo de carroza: presidencial, panoramica, estandar, etc';
COMMENT ON COLUMN public.casos_servicios.usa_cuota_mortuoria IS 'Indica si se utilizó cuota mortuoria';