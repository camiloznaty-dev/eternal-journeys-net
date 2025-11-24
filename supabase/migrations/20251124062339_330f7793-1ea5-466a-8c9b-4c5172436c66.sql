-- Create activity_logs table for system monitoring
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs(entity_type);
CREATE INDEX idx_activity_logs_severity ON public.activity_logs(severity);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only superadmins can view activity logs
CREATE POLICY "Superadmins can view all activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Only superadmins can insert activity logs
CREATE POLICY "Superadmins can insert activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- Enable realtime for activity_logs
ALTER TABLE public.activity_logs REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- Create function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    user_email,
    action,
    entity_type,
    entity_id,
    details,
    severity
  )
  VALUES (
    auth.uid(),
    auth.email(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_details,
    p_severity
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;