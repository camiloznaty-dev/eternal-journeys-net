-- Crear tabla para anuncios de sepulturas
CREATE TABLE public.anuncios_sepulturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE SET NULL,
  
  -- Información del anuncio
  titulo text NOT NULL,
  descripcion text,
  cementerio text NOT NULL,
  comuna text NOT NULL,
  tipo_sepultura text NOT NULL, -- perpetua, temporal, nicho, etc
  precio numeric NOT NULL,
  fotos text[] DEFAULT '{}',
  
  -- Información del vendedor
  vendedor_nombre text NOT NULL,
  vendedor_telefono text NOT NULL,
  vendedor_email text,
  
  -- Estado y metadata
  status text DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservada', 'vendida')),
  destacado boolean DEFAULT false,
  views integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anuncios_sepulturas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Cualquiera puede ver anuncios disponibles
CREATE POLICY "Anyone can view available anuncios"
ON public.anuncios_sepulturas
FOR SELECT
USING (status = 'disponible' OR auth.uid() = user_id OR funeraria_id = get_user_funeraria_id(auth.uid()));

-- Usuarios autenticados pueden crear anuncios
CREATE POLICY "Authenticated users can create anuncios"
ON public.anuncios_sepulturas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus propios anuncios
CREATE POLICY "Users can update their own anuncios"
ON public.anuncios_sepulturas
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR funeraria_id = get_user_funeraria_id(auth.uid()));

-- Usuarios pueden eliminar sus propios anuncios
CREATE POLICY "Users can delete their own anuncios"
ON public.anuncios_sepulturas
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR funeraria_id = get_user_funeraria_id(auth.uid()));

-- Trigger para actualizar updated_at
CREATE TRIGGER update_anuncios_sepulturas_updated_at
BEFORE UPDATE ON public.anuncios_sepulturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabla para consultas/intereses en sepulturas
CREATE TABLE public.consultas_sepulturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_id uuid REFERENCES public.anuncios_sepulturas(id) ON DELETE CASCADE NOT NULL,
  
  nombre text NOT NULL,
  telefono text NOT NULL,
  email text,
  mensaje text,
  
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultas_sepulturas ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede crear consultas
CREATE POLICY "Anyone can create consultas"
ON public.consultas_sepulturas
FOR INSERT
WITH CHECK (true);

-- Solo el dueño del anuncio o la funeraria pueden ver consultas
CREATE POLICY "Anuncio owners and funerarias can view consultas"
ON public.consultas_sepulturas
FOR SELECT
USING (
  anuncio_id IN (
    SELECT id FROM public.anuncios_sepulturas 
    WHERE user_id = auth.uid() OR funeraria_id = get_user_funeraria_id(auth.uid())
  )
);