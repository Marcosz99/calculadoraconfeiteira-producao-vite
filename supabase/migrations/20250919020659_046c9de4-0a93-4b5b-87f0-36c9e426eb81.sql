-- Habilitar RLS na tabela profiles existente
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas para a tabela profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem inserir seus próprios perfis" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON public.profiles 
FOR UPDATE 
USING (true) 
WITH CHECK (true);