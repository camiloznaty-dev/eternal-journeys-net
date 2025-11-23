-- Actualizar tabla funerarias para mini website
ALTER TABLE public.funerarias 
  ADD COLUMN slug text UNIQUE,
  ADD COLUMN primary_color text DEFAULT '#000000',
  ADD COLUMN secondary_color text DEFAULT '#666666',
  ADD COLUMN about_text text,
  ADD COLUMN hero_image_url text,
  ADD COLUMN gallery_images text[] DEFAULT '{}',
  ADD COLUMN facebook_url text,
  ADD COLUMN instagram_url text,
  ADD COLUMN website_active boolean DEFAULT true;

-- Crear índice para búsquedas por slug
CREATE INDEX idx_funerarias_slug ON public.funerarias(slug);

-- Tabla de leads/clientes potenciales
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  comuna text,
  source text, -- website, llamada, referencia, etc
  status text DEFAULT 'nuevo', -- nuevo, contactado, cotizado, negociacion, ganado, perdido
  priority text DEFAULT 'media', -- baja, media, alta
  notes text,
  assigned_to uuid REFERENCES auth.users(id),
  estimated_value numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de empleados
CREATE TABLE public.empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text,
  phone text,
  role text NOT NULL, -- director, asesor, conductor, etc
  fecha_ingreso date,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de servicios funerarios activos (casos)
CREATE TABLE public.casos_servicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id),
  difunto_nombre text NOT NULL,
  difunto_apellido text NOT NULL,
  fecha_fallecimiento date NOT NULL,
  tipo_servicio text NOT NULL, -- velorio, cremacion, inhumacion, etc
  ubicacion_velorio text,
  fecha_velorio timestamp with time zone,
  fecha_ceremonia timestamp with time zone,
  status text DEFAULT 'planificacion', -- planificacion, en_curso, completado
  monto_total numeric,
  notas text,
  responsable_id uuid REFERENCES public.empleados(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de tareas por caso
CREATE TABLE public.tareas_caso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caso_id uuid REFERENCES public.casos_servicios(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  asignado_a uuid REFERENCES public.empleados(id),
  fecha_limite timestamp with time zone,
  completada boolean DEFAULT false,
  prioridad text DEFAULT 'media',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de cotizaciones
CREATE TABLE public.cotizaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id),
  numero_cotizacion text UNIQUE NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL,
  impuestos numeric DEFAULT 0,
  total numeric NOT NULL,
  valida_hasta date,
  status text DEFAULT 'enviada', -- borrador, enviada, aceptada, rechazada
  notas text,
  creada_por uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de facturas
CREATE TABLE public.facturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  caso_id uuid REFERENCES public.casos_servicios(id),
  cotizacion_id uuid REFERENCES public.cotizaciones(id),
  numero_factura text UNIQUE NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL,
  impuestos numeric DEFAULT 0,
  total numeric NOT NULL,
  fecha_emision date NOT NULL,
  fecha_vencimiento date,
  status text DEFAULT 'pendiente', -- pendiente, pagada, vencida
  metodo_pago text,
  notas text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de proveedores
CREATE TABLE public.proveedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  rut text,
  contacto_nombre text,
  email text,
  phone text,
  direccion text,
  categoria text, -- flores, ataudes, transporte, etc
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Actualizar tabla productos para inventario
ALTER TABLE public.productos
  ADD COLUMN stock_minimo integer DEFAULT 0,
  ADD COLUMN proveedor_id uuid REFERENCES public.proveedores(id),
  ADD COLUMN costo numeric,
  ADD COLUMN sku text;

-- Tabla de movimientos de inventario
CREATE TABLE public.movimientos_inventario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES public.productos(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL, -- entrada, salida, ajuste
  cantidad integer NOT NULL,
  stock_anterior integer NOT NULL,
  stock_nuevo integer NOT NULL,
  motivo text,
  caso_id uuid REFERENCES public.casos_servicios(id),
  realizado_por uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de turnos
CREATE TABLE public.turnos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id uuid REFERENCES public.empleados(id) ON DELETE CASCADE NOT NULL,
  fecha date NOT NULL,
  hora_inicio time NOT NULL,
  hora_fin time NOT NULL,
  tipo text DEFAULT 'regular', -- regular, guardia, extraordinario
  notas text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabla de interacciones con leads (historial CRM)
CREATE TABLE public.interacciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL, -- llamada, email, reunion, whatsapp
  descripcion text NOT NULL,
  fecha timestamp with time zone DEFAULT now() NOT NULL,
  realizada_por uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Actualizar obituarios para vincular con casos
ALTER TABLE public.obituarios
  ADD COLUMN caso_id uuid REFERENCES public.casos_servicios(id);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casos_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas_caso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacciones ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Funerarias pueden ver y gestionar sus propios datos
CREATE POLICY "Funerarias can manage their leads"
  ON public.leads FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can manage their empleados"
  ON public.empleados FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can manage their casos"
  ON public.casos_servicios FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can manage tareas"
  ON public.tareas_caso FOR ALL
  USING (
    caso_id IN (
      SELECT id FROM public.casos_servicios 
      WHERE funeraria_id IN (
        SELECT funeraria_id FROM public.empleados 
        WHERE user_id = auth.uid() AND activo = true
      )
    )
  );

CREATE POLICY "Funerarias can manage cotizaciones"
  ON public.cotizaciones FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can manage facturas"
  ON public.facturas FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can manage proveedores"
  ON public.proveedores FOR ALL
  USING (
    funeraria_id IN (
      SELECT funeraria_id FROM public.empleados 
      WHERE user_id = auth.uid() AND activo = true
    )
  );

CREATE POLICY "Funerarias can view inventario movements"
  ON public.movimientos_inventario FOR SELECT
  USING (
    producto_id IN (
      SELECT id FROM public.productos 
      WHERE funeraria_id IN (
        SELECT funeraria_id FROM public.empleados 
        WHERE user_id = auth.uid() AND activo = true
      )
    )
  );

CREATE POLICY "Funerarias can manage turnos"
  ON public.turnos FOR ALL
  USING (
    empleado_id IN (
      SELECT id FROM public.empleados 
      WHERE funeraria_id IN (
        SELECT funeraria_id FROM public.empleados 
        WHERE user_id = auth.uid() AND activo = true
      )
    )
  );

CREATE POLICY "Funerarias can manage interacciones"
  ON public.interacciones FOR ALL
  USING (
    lead_id IN (
      SELECT id FROM public.leads 
      WHERE funeraria_id IN (
        SELECT funeraria_id FROM public.empleados 
        WHERE user_id = auth.uid() AND activo = true
      )
    )
  );

-- Triggers para updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_empleados_updated_at
  BEFORE UPDATE ON public.empleados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_casos_updated_at
  BEFORE UPDATE ON public.casos_servicios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tareas_updated_at
  BEFORE UPDATE ON public.tareas_caso
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at
  BEFORE UPDATE ON public.cotizaciones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at
  BEFORE UPDATE ON public.facturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at
  BEFORE UPDATE ON public.proveedores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_turnos_updated_at
  BEFORE UPDATE ON public.turnos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();