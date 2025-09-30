-- Phase 1: Critical Data Protection

-- 1.1 Fix profiles Table RLS Policies
-- Drop the dangerous policy that allows everyone to see all profiles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON public.profiles;

-- Create new restrictive policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Remove the obsolete password column (auth is handled by Supabase Auth)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS password;

-- 1.2 Fix creditos_ia Table RLS Policies
-- Drop the dangerous policy that allows system-wide access
DROP POLICY IF EXISTS "Sistema pode gerenciar créditos" ON public.creditos_ia;
DROP POLICY IF EXISTS "Usuários podem ver seus créditos" ON public.creditos_ia;

-- Create restrictive policies - users can only see their own credits
CREATE POLICY "Users can view own credits"
  ON public.creditos_ia
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- System operations (INSERT, UPDATE, DELETE) should use service role
-- These policies allow service role to manage credits
CREATE POLICY "Service role can insert credits"
  ON public.creditos_ia
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update credits"
  ON public.creditos_ia
  FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete credits"
  ON public.creditos_ia
  FOR DELETE
  USING (true);

-- 1.3 Fix backups_usuarios Table RLS Policy
-- Drop the dangerous policy allowing anonymous inserts
DROP POLICY IF EXISTS "Qualquer um pode inserir backup" ON public.backups_usuarios;
DROP POLICY IF EXISTS "Apenas administradores podem ver backups" ON public.backups_usuarios;

-- Only authenticated users can insert backups
CREATE POLICY "Authenticated users can insert backup"
  ON public.backups_usuarios
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only service role can view backups (for admin purposes)
CREATE POLICY "Service role can view backups"
  ON public.backups_usuarios
  FOR SELECT
  USING (true);

-- Phase 3.1: Database Function Security
-- Update the reset_monthly_credits function with proper security
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.creditos_ia 
  SET creditos_usados = 0,
      data_reset = (date_trunc('month', now()) + interval '1 month'),
      updated_at = now()
  WHERE data_reset <= now();
END;
$function$;

-- Update the update_updated_at_column function with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;