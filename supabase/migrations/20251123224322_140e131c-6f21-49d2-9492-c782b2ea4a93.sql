-- Create proveedor_documentos table for contracts, invoices, certificates
CREATE TABLE IF NOT EXISTS public.proveedor_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL, -- 'contrato', 'factura', 'certificado', 'otro'
  archivo_url TEXT NOT NULL,
  archivo_size INTEGER,
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_vencimiento DATE,
  subido_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create proveedor_pedidos table for purchase orders
CREATE TABLE IF NOT EXISTS public.proveedor_pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
  numero_pedido TEXT NOT NULL UNIQUE,
  fecha_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_entrega_estimada DATE,
  fecha_entrega_real DATE,
  status TEXT DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'recibido', 'cancelado'
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  impuestos NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  notas TEXT,
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create proveedor_pagos table for payment tracking
CREATE TABLE IF NOT EXISTS public.proveedor_pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES public.proveedor_pedidos(id) ON DELETE SET NULL,
  monto NUMERIC(10,2) NOT NULL,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  metodo_pago TEXT, -- 'transferencia', 'cheque', 'efectivo', 'tarjeta'
  numero_referencia TEXT,
  status TEXT DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'vencido', 'parcial'
  notas TEXT,
  comprobante_url TEXT,
  registrado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create proveedor_recordatorios table for alerts and follow-ups
CREATE TABLE IF NOT EXISTS public.proveedor_recordatorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_recordatorio TIMESTAMP WITH TIME ZONE NOT NULL,
  completado BOOLEAN DEFAULT false,
  prioridad TEXT DEFAULT 'media', -- 'baja', 'media', 'alta'
  tipo TEXT, -- 'pago', 'seguimiento', 'renovacion', 'otro'
  asignado_a UUID REFERENCES auth.users(id),
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.proveedor_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedor_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedor_pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedor_recordatorios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proveedor_documentos
CREATE POLICY "Funerarias can manage their proveedor documentos"
  ON public.proveedor_documentos
  FOR ALL
  USING (
    proveedor_id IN (
      SELECT p.id FROM public.proveedores p
      WHERE p.funeraria_id IN (
        SELECT e.funeraria_id FROM public.empleados e
        WHERE e.user_id = auth.uid() AND e.activo = true
      )
    )
  );

-- RLS Policies for proveedor_pedidos
CREATE POLICY "Funerarias can manage their proveedor pedidos"
  ON public.proveedor_pedidos
  FOR ALL
  USING (
    proveedor_id IN (
      SELECT p.id FROM public.proveedores p
      WHERE p.funeraria_id IN (
        SELECT e.funeraria_id FROM public.empleados e
        WHERE e.user_id = auth.uid() AND e.activo = true
      )
    )
  );

-- RLS Policies for proveedor_pagos
CREATE POLICY "Funerarias can manage their proveedor pagos"
  ON public.proveedor_pagos
  FOR ALL
  USING (
    proveedor_id IN (
      SELECT p.id FROM public.proveedores p
      WHERE p.funeraria_id IN (
        SELECT e.funeraria_id FROM public.empleados e
        WHERE e.user_id = auth.uid() AND e.activo = true
      )
    )
  );

-- RLS Policies for proveedor_recordatorios
CREATE POLICY "Funerarias can manage their proveedor recordatorios"
  ON public.proveedor_recordatorios
  FOR ALL
  USING (
    proveedor_id IN (
      SELECT p.id FROM public.proveedores p
      WHERE p.funeraria_id IN (
        SELECT e.funeraria_id FROM public.empleados e
        WHERE e.user_id = auth.uid() AND e.activo = true
      )
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_proveedor_documentos_updated_at
  BEFORE UPDATE ON public.proveedor_documentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proveedor_pedidos_updated_at
  BEFORE UPDATE ON public.proveedor_pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proveedor_pagos_updated_at
  BEFORE UPDATE ON public.proveedor_pagos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proveedor_recordatorios_updated_at
  BEFORE UPDATE ON public.proveedor_recordatorios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_proveedor_documentos_proveedor ON public.proveedor_documentos(proveedor_id);
CREATE INDEX idx_proveedor_pedidos_proveedor ON public.proveedor_pedidos(proveedor_id);
CREATE INDEX idx_proveedor_pagos_proveedor ON public.proveedor_pagos(proveedor_id);
CREATE INDEX idx_proveedor_recordatorios_proveedor ON public.proveedor_recordatorios(proveedor_id);
CREATE INDEX idx_proveedor_recordatorios_fecha ON public.proveedor_recordatorios(fecha_recordatorio);

-- Create storage bucket for proveedor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('proveedor-documentos', 'proveedor-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for proveedor documents
CREATE POLICY "Funerarias can upload proveedor documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'proveedor-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can view their proveedor documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'proveedor-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can update their proveedor documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'proveedor-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Funerarias can delete their proveedor documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'proveedor-documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );