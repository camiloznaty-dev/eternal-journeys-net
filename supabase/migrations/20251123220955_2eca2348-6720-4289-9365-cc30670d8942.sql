-- Enable RLS on productos table
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Policies for productos
CREATE POLICY "Funerarias can manage their productos"
ON public.productos
FOR ALL
USING (
  funeraria_id IN (
    SELECT funeraria_id
    FROM empleados
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Enable RLS on funerarias table for updates
CREATE POLICY "Funerarias can update their own data"
ON public.funerarias
FOR UPDATE
USING (
  id IN (
    SELECT funeraria_id
    FROM empleados
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Update leads table to add more fields
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS last_contact_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS next_followup_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS converted_to_caso_id uuid REFERENCES public.casos_servicios(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_funeraria_id ON public.leads(funeraria_id);
CREATE INDEX IF NOT EXISTS idx_casos_status ON public.casos_servicios(status);
CREATE INDEX IF NOT EXISTS idx_casos_funeraria_id ON public.casos_servicios(funeraria_id);
CREATE INDEX IF NOT EXISTS idx_productos_funeraria_id ON public.productos(funeraria_id);
CREATE INDEX IF NOT EXISTS idx_servicios_funeraria_id ON public.servicios(funeraria_id);

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  f.id as funeraria_id,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'nuevo') as leads_nuevos,
  COUNT(DISTINCT l.id) FILTER (WHERE l.created_at > NOW() - INTERVAL '30 days') as leads_mes,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status IN ('planificacion', 'en_proceso')) as casos_activos,
  COUNT(DISTINCT e.id) FILTER (WHERE e.activo = true) as empleados_activos,
  COALESCE(SUM(c.monto_total) FILTER (WHERE c.created_at > NOW() - INTERVAL '30 days'), 0) as ingresos_mes
FROM public.funerarias f
LEFT JOIN public.leads l ON l.funeraria_id = f.id
LEFT JOIN public.casos_servicios c ON c.funeraria_id = f.id
LEFT JOIN public.empleados e ON e.funeraria_id = f.id
GROUP BY f.id;

-- Grant access to the view
GRANT SELECT ON public.dashboard_stats TO authenticated;