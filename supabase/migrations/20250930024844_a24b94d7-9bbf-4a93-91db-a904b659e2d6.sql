-- Fix backups_usuarios table - restrict SELECT access
-- Drop the dangerous policy that allows everyone to read all backups
DROP POLICY IF EXISTS "Service role can view backups" ON public.backups_usuarios;

-- Allow authenticated users to view only their own backups (matched by email)
CREATE POLICY "Users can view own backups"
  ON public.backups_usuarios
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND usuario_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Update INSERT policy to ensure email matches authenticated user
DROP POLICY IF EXISTS "Authenticated users can insert backup" ON public.backups_usuarios;

CREATE POLICY "Users can insert own backup"
  ON public.backups_usuarios
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND usuario_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );