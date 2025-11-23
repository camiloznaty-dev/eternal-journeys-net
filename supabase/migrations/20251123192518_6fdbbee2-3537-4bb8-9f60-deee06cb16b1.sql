-- Create enum for product categories
CREATE TYPE product_category AS ENUM (
  'ataud',
  'cremacion',
  'traslado',
  'flores',
  'servicio_completo',
  'urna',
  'lapida',
  'otro'
);

-- Create enum for order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
);

-- Table: funerarias (funeral homes)
CREATE TABLE public.funerarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  lat NUMERIC(10, 8),
  lng NUMERIC(11, 8),
  rating NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  logo_url TEXT,
  horarios TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: productos (products)
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID REFERENCES public.funerarias(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  images TEXT[] DEFAULT '{}',
  category product_category NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: servicios (services)
CREATE TABLE public.servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID REFERENCES public.funerarias(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: obituarios (obituaries)
CREATE TABLE public.obituarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID REFERENCES public.funerarias(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  biography TEXT,
  photo_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: condolencias (condolences)
CREATE TABLE public.condolencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obituario_id UUID REFERENCES public.obituarios(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: pedidos (orders)
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID REFERENCES public.funerarias(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.funerarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obituarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condolencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Public read access for funerarias, productos, servicios, obituarios
CREATE POLICY "Anyone can view funerarias" ON public.funerarias FOR SELECT USING (true);
CREATE POLICY "Anyone can view productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Anyone can view servicios" ON public.servicios FOR SELECT USING (true);
CREATE POLICY "Anyone can view obituarios" ON public.obituarios FOR SELECT USING (true);
CREATE POLICY "Anyone can view condolencias" ON public.condolencias FOR SELECT USING (true);

-- Public can insert condolencias
CREATE POLICY "Anyone can insert condolencias" ON public.condolencias FOR INSERT WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX idx_productos_funeraria ON public.productos(funeraria_id);
CREATE INDEX idx_servicios_funeraria ON public.servicios(funeraria_id);
CREATE INDEX idx_obituarios_funeraria ON public.obituarios(funeraria_id);
CREATE INDEX idx_condolencias_obituario ON public.condolencias(obituario_id);
CREATE INDEX idx_pedidos_funeraria ON public.pedidos(funeraria_id);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_funerarias_updated_at BEFORE UPDATE ON public.funerarias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON public.servicios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obituarios_updated_at BEFORE UPDATE ON public.obituarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();