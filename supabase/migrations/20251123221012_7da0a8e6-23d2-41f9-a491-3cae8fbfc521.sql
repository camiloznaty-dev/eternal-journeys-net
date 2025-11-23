-- Fix security definer view issue
DROP VIEW IF EXISTS public.dashboard_stats;

CREATE OR REPLACE VIEW public.dashboard_stats 
WITH (security_invoker=true)
AS
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