-- Create a security definer function to get funeraria_id for a user
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_funeraria_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT funeraria_id
  FROM public.empleados
  WHERE user_id = _user_id
    AND activo = true
  LIMIT 1
$$;

-- Update empleados RLS policy to avoid recursion
DROP POLICY IF EXISTS "Funerarias can manage their empleados" ON public.empleados;
CREATE POLICY "Funerarias can manage their empleados"
ON public.empleados
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update proveedores RLS policy
DROP POLICY IF EXISTS "Funerarias can manage proveedores" ON public.proveedores;
CREATE POLICY "Funerarias can manage proveedores"
ON public.proveedores
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update casos_servicios RLS policy
DROP POLICY IF EXISTS "Funerarias can manage their casos" ON public.casos_servicios;
CREATE POLICY "Funerarias can manage their casos"
ON public.casos_servicios
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update cotizaciones RLS policy
DROP POLICY IF EXISTS "Funerarias can manage cotizaciones" ON public.cotizaciones;
CREATE POLICY "Funerarias can manage cotizaciones"
ON public.cotizaciones
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update facturas RLS policy
DROP POLICY IF EXISTS "Funerarias can manage facturas" ON public.facturas;
CREATE POLICY "Funerarias can manage facturas"
ON public.facturas
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update leads RLS policy
DROP POLICY IF EXISTS "Funerarias can manage their leads" ON public.leads;
CREATE POLICY "Funerarias can manage their leads"
ON public.leads
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update productos RLS policy
DROP POLICY IF EXISTS "Funerarias can manage their productos" ON public.productos;
CREATE POLICY "Funerarias can manage their productos"
ON public.productos
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update servicios RLS policies
DROP POLICY IF EXISTS "Funerarias can insert servicios" ON public.servicios;
DROP POLICY IF EXISTS "Funerarias can update their servicios" ON public.servicios;
DROP POLICY IF EXISTS "Funerarias can delete their servicios" ON public.servicios;

CREATE POLICY "Funerarias can manage their servicios"
ON public.servicios
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update obituarios RLS policies
DROP POLICY IF EXISTS "Funerarias can insert their obituarios" ON public.obituarios;
DROP POLICY IF EXISTS "Funerarias can update their obituarios" ON public.obituarios;
DROP POLICY IF EXISTS "Funerarias can delete their obituarios" ON public.obituarios;

CREATE POLICY "Funerarias can manage their obituarios"
ON public.obituarios
FOR ALL
TO authenticated
USING (funeraria_id = public.get_user_funeraria_id(auth.uid()));

-- Update funerarias RLS policy
DROP POLICY IF EXISTS "Funerarias can update their own data" ON public.funerarias;
CREATE POLICY "Funerarias can update their own data"
ON public.funerarias
FOR UPDATE
TO authenticated
USING (id = public.get_user_funeraria_id(auth.uid()));

-- Update nested policies for related tables
DROP POLICY IF EXISTS "Funerarias can manage their caso documentos" ON public.caso_documentos;
CREATE POLICY "Funerarias can manage their caso documentos"
ON public.caso_documentos
FOR ALL
TO authenticated
USING (caso_id IN (
  SELECT id FROM public.casos_servicios 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage interacciones" ON public.interacciones;
CREATE POLICY "Funerarias can manage interacciones"
ON public.interacciones
FOR ALL
TO authenticated
USING (lead_id IN (
  SELECT id FROM public.leads 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage tareas" ON public.tareas_caso;
CREATE POLICY "Funerarias can manage tareas"
ON public.tareas_caso
FOR ALL
TO authenticated
USING (caso_id IN (
  SELECT id FROM public.casos_servicios 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage turnos" ON public.turnos;
CREATE POLICY "Funerarias can manage turnos"
ON public.turnos
FOR ALL
TO authenticated
USING (empleado_id IN (
  SELECT id FROM public.empleados 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage their proveedor documentos" ON public.proveedor_documentos;
CREATE POLICY "Funerarias can manage their proveedor documentos"
ON public.proveedor_documentos
FOR ALL
TO authenticated
USING (proveedor_id IN (
  SELECT id FROM public.proveedores 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage their proveedor pagos" ON public.proveedor_pagos;
CREATE POLICY "Funerarias can manage their proveedor pagos"
ON public.proveedor_pagos
FOR ALL
TO authenticated
USING (proveedor_id IN (
  SELECT id FROM public.proveedores 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage their proveedor pedidos" ON public.proveedor_pedidos;
CREATE POLICY "Funerarias can manage their proveedor pedidos"
ON public.proveedor_pedidos
FOR ALL
TO authenticated
USING (proveedor_id IN (
  SELECT id FROM public.proveedores 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));

DROP POLICY IF EXISTS "Funerarias can manage their proveedor recordatorios" ON public.proveedor_recordatorios;
CREATE POLICY "Funerarias can manage their proveedor recordatorios"
ON public.proveedor_recordatorios
FOR ALL
TO authenticated
USING (proveedor_id IN (
  SELECT id FROM public.proveedores 
  WHERE funeraria_id = public.get_user_funeraria_id(auth.uid())
));