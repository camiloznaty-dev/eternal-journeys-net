-- Tabla para memoriales digitales
CREATE TABLE public.memoriales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_ser_querido TEXT NOT NULL,
  fecha_nacimiento DATE,
  fecha_fallecimiento DATE,
  foto_principal TEXT,
  relacion TEXT, -- madre, padre, hermano, amigo, etc
  descripcion TEXT,
  privado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para entradas del memorial (cartas, recuerdos, fotos)
CREATE TABLE public.entradas_memorial (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memoriales(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autor_nombre TEXT NOT NULL, -- Para cuando no es el dueño
  tipo TEXT NOT NULL, -- carta, recuerdo, foto, audio
  contenido TEXT,
  archivo_url TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para el diario de duelo
CREATE TABLE public.diario_duelo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memorial_id UUID REFERENCES public.memoriales(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  prompt_id UUID, -- referencia al prompt usado, si aplica
  titulo TEXT,
  contenido TEXT NOT NULL,
  estado_emocional TEXT, -- triste, enojado, nostálgico, en paz, etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para prompts guiados del diario
CREATE TABLE public.prompts_duelo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semana INTEGER NOT NULL, -- semana desde el fallecimiento
  etapa TEXT NOT NULL, -- negacion, ira, negociacion, depresion, aceptacion
  pregunta TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memoriales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas_memorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diario_duelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts_duelo ENABLE ROW LEVEL SECURITY;

-- Policies para memoriales
CREATE POLICY "Users can view their own memoriales"
  ON public.memoriales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memoriales"
  ON public.memoriales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memoriales"
  ON public.memoriales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memoriales"
  ON public.memoriales FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para entradas memorial
CREATE POLICY "Users can view entries of their memoriales"
  ON public.entradas_memorial FOR SELECT
  USING (memorial_id IN (
    SELECT id FROM public.memoriales WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create entries in their memoriales"
  ON public.entradas_memorial FOR INSERT
  WITH CHECK (memorial_id IN (
    SELECT id FROM public.memoriales WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update entries in their memoriales"
  ON public.entradas_memorial FOR UPDATE
  USING (memorial_id IN (
    SELECT id FROM public.memoriales WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete entries in their memoriales"
  ON public.entradas_memorial FOR DELETE
  USING (memorial_id IN (
    SELECT id FROM public.memoriales WHERE user_id = auth.uid()
  ));

-- Policies para diario de duelo
CREATE POLICY "Users can view their own diario entries"
  ON public.diario_duelo FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diario entries"
  ON public.diario_duelo FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diario entries"
  ON public.diario_duelo FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diario entries"
  ON public.diario_duelo FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para prompts (todos pueden leer)
CREATE POLICY "Anyone can view prompts"
  ON public.prompts_duelo FOR SELECT
  USING (activo = true);

-- Triggers para updated_at
CREATE TRIGGER update_memoriales_updated_at
  BEFORE UPDATE ON public.memoriales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diario_duelo_updated_at
  BEFORE UPDATE ON public.diario_duelo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar algunos prompts iniciales
INSERT INTO public.prompts_duelo (semana, etapa, pregunta, descripcion, orden) VALUES
-- Primeras semanas - Negación/Shock
(1, 'negacion', '¿Qué recuerdos vienen a tu mente cuando piensas en [nombre]?', 'Comienza recordando momentos significativos', 1),
(1, 'negacion', '¿Cómo era un día normal con [nombre]?', 'Reconecta con la rutina compartida', 2),
(2, 'negacion', '¿Qué cosas te recuerdan a [nombre]?', 'Objetos, lugares, canciones...', 3),
(2, 'negacion', '¿Qué hubieras querido decirle?', 'Palabras no dichas', 4),

-- Semanas 3-4 - Ira/Frustración
(3, 'ira', '¿Qué emociones difíciles estás experimentando?', 'Es válido sentir enojo, confusión o frustración', 5),
(3, 'ira', '¿Hay algo que te haya sorprendido del proceso de duelo?', 'Las emociones pueden ser impredecibles', 6),
(4, 'ira', '¿Qué te ha ayudado en los momentos más difíciles?', 'Identifica tus recursos de apoyo', 7),
(4, 'ira', '¿Cómo ha cambiado tu día a día?', 'Reconoce los cambios y adaptaciones', 8),

-- Semanas 5-8 - Negociación
(5, 'negociacion', '¿Qué lecciones aprendiste de [nombre]?', 'El legado que permanece', 9),
(6, 'negociacion', '¿Cómo te gustaría honrar su memoria?', 'Formas de mantener vivo el recuerdo', 10),
(7, 'negociacion', '¿Qué aspectos de [nombre] quieres mantener vivos en ti?', 'Su influencia en tu vida', 11),
(8, 'negociacion', '¿Qué tradiciones o rituales te conectan con [nombre]?', 'Crear nuevas formas de recordar', 12),

-- Semanas 9-12 - Depresión/Tristeza profunda
(9, 'depresion', '¿Cómo te sientes hoy? Sin filtros', 'Validar tus emociones', 13),
(10, 'depresion', '¿Qué necesitas en este momento?', 'Identifica tus necesidades', 14),
(11, 'depresion', '¿Hay algún momento del día que sea especialmente difícil?', 'Reconoce patrones emocionales', 15),
(12, 'depresion', '¿Qué pequeños pasos has dado hacia adelante?', 'Celebra el progreso, por pequeño que sea', 16),

-- Semanas 13+ - Aceptación
(13, 'aceptacion', '¿Cómo describes tu relación con el duelo ahora?', 'El duelo evoluciona', 17),
(14, 'aceptacion', '¿Qué te hace sonreír cuando piensas en [nombre]?', 'Los buenos recuerdos traen paz', 18),
(15, 'aceptacion', '¿Cómo has crecido a través de esta experiencia?', 'Reconoce tu resiliencia', 19),
(16, 'aceptacion', '¿Qué mensaje le darías a alguien que está comenzando su proceso de duelo?', 'Comparte tu sabiduría', 20);
