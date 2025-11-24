-- Create plans table for funeraria subscription plans
CREATE TABLE IF NOT EXISTS public.planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_mensual NUMERIC NOT NULL,
  precio_anual NUMERIC,
  caracteristicas JSONB DEFAULT '[]'::jsonb,
  limite_empleados INTEGER,
  limite_casos INTEGER,
  limite_obituarios INTEGER,
  limite_leads INTEGER,
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create funeraria_planes table to track which plan each funeraria has
CREATE TABLE IF NOT EXISTS public.funeraria_planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID NOT NULL REFERENCES public.funerarias(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.planes(id) ON DELETE RESTRICT,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'cancelado', 'suspendido', 'expirado')),
  tipo_pago TEXT DEFAULT 'mensual' CHECK (tipo_pago IN ('mensual', 'anual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_funeraria_planes_funeraria_id ON public.funeraria_planes(funeraria_id);
CREATE INDEX idx_funeraria_planes_plan_id ON public.funeraria_planes(plan_id);
CREATE INDEX idx_funeraria_planes_estado ON public.funeraria_planes(estado);

-- Enable RLS
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funeraria_planes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for planes
CREATE POLICY "Anyone can view active planes"
ON public.planes
FOR SELECT
TO authenticated
USING (activo = true);

CREATE POLICY "Superadmins can manage all planes"
ON public.planes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for funeraria_planes
CREATE POLICY "Funerarias can view their own plan"
ON public.funeraria_planes
FOR SELECT
TO authenticated
USING (
  funeraria_id = get_user_funeraria_id(auth.uid()) OR
  public.has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Superadmins can manage all funeraria plans"
ON public.funeraria_planes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Create trigger for updated_at
CREATE TRIGGER update_planes_updated_at
BEFORE UPDATE ON public.planes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_funeraria_planes_updated_at
BEFORE UPDATE ON public.funeraria_planes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.planes (nombre, descripcion, precio_mensual, precio_anual, caracteristicas, limite_empleados, limite_casos, limite_obituarios, limite_leads, destacado, orden) VALUES
('Básico', 'Plan ideal para funerarias pequeñas', 29990, 299990, '["Hasta 5 empleados", "Hasta 20 casos/mes", "Obituarios ilimitados", "50 leads/mes", "Soporte por email"]'::jsonb, 5, 20, -1, 50, false, 1),
('Profesional', 'Para funerarias en crecimiento', 59990, 599990, '["Hasta 15 empleados", "Casos ilimitados", "Obituarios premium", "200 leads/mes", "Gestión de proveedores", "Soporte prioritario"]'::jsonb, 15, -1, -1, 200, true, 2),
('Empresarial', 'Solución completa para grandes funerarias', 99990, 999990, '["Empleados ilimitados", "Casos ilimitados", "Obituarios premium", "Leads ilimitados", "API personalizada", "Soporte 24/7", "Capacitación incluida"]'::jsonb, -1, -1, -1, -1, false, 3);

-- Log the migration
SELECT public.log_activity(
  'create_plans_system',
  'system',
  NULL,
  '{"description": "Sistema de planes de suscripción creado"}'::jsonb,
  'info'
);