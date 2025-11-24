-- Crear bucket para fotos de obituarios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('obituarios', 'obituarios', true);

-- Políticas para el bucket de obituarios
CREATE POLICY "Funerarias pueden subir fotos de obituarios"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'obituarios' 
  AND auth.uid() IN (
    SELECT user_id FROM empleados WHERE activo = true
  )
);

CREATE POLICY "Fotos de obituarios son públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'obituarios');

CREATE POLICY "Funerarias pueden actualizar sus fotos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'obituarios'
  AND auth.uid() IN (
    SELECT user_id FROM empleados WHERE activo = true
  )
);

CREATE POLICY "Funerarias pueden eliminar sus fotos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'obituarios'
  AND auth.uid() IN (
    SELECT user_id FROM empleados WHERE activo = true
  )
);