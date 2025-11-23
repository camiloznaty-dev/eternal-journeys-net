-- Add new columns to funerarias table for employee count and legal representative info
ALTER TABLE public.funerarias
ADD COLUMN employee_count_range text,
ADD COLUMN registrant_type text,
ADD COLUMN legal_rep_name text,
ADD COLUMN legal_rep_rut text,
ADD COLUMN legal_rep_position text;

-- Update the handle_new_user function to include new funeraria fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_funeraria_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Insert role (default to cliente if not specified)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'cliente')
  );
  
  -- If user is a funeraria, create funeraria record and empleado
  IF (NEW.raw_user_meta_data->>'role') = 'funeraria' THEN
    -- Create funeraria record
    INSERT INTO public.funerarias (
      name,
      address,
      email,
      phone,
      primary_color,
      secondary_color,
      employee_count_range,
      registrant_type,
      legal_rep_name,
      legal_rep_rut,
      legal_rep_position,
      slug
    ) VALUES (
      NEW.raw_user_meta_data->>'funeraria_name',
      NEW.raw_user_meta_data->>'funeraria_address',
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_user_meta_data->>'primary_color', '#000000'),
      COALESCE(NEW.raw_user_meta_data->>'secondary_color', '#666666'),
      NEW.raw_user_meta_data->>'employee_count_range',
      NEW.raw_user_meta_data->>'registrant_type',
      NEW.raw_user_meta_data->>'legal_rep_name',
      NEW.raw_user_meta_data->>'legal_rep_rut',
      NEW.raw_user_meta_data->>'legal_rep_position',
      lower(replace(regexp_replace(NEW.raw_user_meta_data->>'funeraria_name', '[^a-zA-Z0-9\s-]', '', 'g'), ' ', '-'))
    )
    RETURNING id INTO new_funeraria_id;
    
    -- Create empleado record linking user to funeraria
    INSERT INTO public.empleados (
      funeraria_id,
      user_id,
      nombre,
      apellido,
      email,
      phone,
      role,
      activo,
      fecha_ingreso
    )
    SELECT 
      new_funeraria_id,
      NEW.id,
      split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1),
      substring(NEW.raw_user_meta_data->>'full_name' from position(' ' in NEW.raw_user_meta_data->>'full_name') + 1),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      CASE 
        WHEN NEW.raw_user_meta_data->>'registrant_type' IN ('dueno', 'representante_legal') THEN 'director'
        ELSE 'administrador'
      END,
      true,
      CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();