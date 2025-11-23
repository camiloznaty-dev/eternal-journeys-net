-- Update RLS policies for obituarios to allow funerarias to manage their own obituarios

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view obituarios" ON public.obituarios;

-- Create new policies for funerarias
CREATE POLICY "Anyone can view obituarios" 
ON public.obituarios 
FOR SELECT 
USING (true);

CREATE POLICY "Funerarias can insert their obituarios" 
ON public.obituarios 
FOR INSERT 
WITH CHECK (
  funeraria_id IN (
    SELECT funeraria_id 
    FROM empleados 
    WHERE user_id = auth.uid() AND activo = true
  )
);

CREATE POLICY "Funerarias can update their obituarios" 
ON public.obituarios 
FOR UPDATE 
USING (
  funeraria_id IN (
    SELECT funeraria_id 
    FROM empleados 
    WHERE user_id = auth.uid() AND activo = true
  )
);

CREATE POLICY "Funerarias can delete their obituarios" 
ON public.obituarios 
FOR DELETE 
USING (
  funeraria_id IN (
    SELECT funeraria_id 
    FROM empleados 
    WHERE user_id = auth.uid() AND activo = true
  )
);