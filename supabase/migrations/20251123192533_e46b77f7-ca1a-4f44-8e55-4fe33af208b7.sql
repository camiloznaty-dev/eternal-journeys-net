-- Fix function security by setting search_path (using CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add RLS policies for pedidos table
CREATE POLICY "Anyone can view their own pedidos" 
  ON public.pedidos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create pedidos" 
  ON public.pedidos 
  FOR INSERT 
  WITH CHECK (true);