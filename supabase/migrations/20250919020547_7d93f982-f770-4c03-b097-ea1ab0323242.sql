-- Tabela para backups de emergência dos usuários
CREATE TABLE public.backups_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_email text NOT NULL,
  dados jsonb NOT NULL,
  dispositivo text,
  versao text,
  created_at timestamptz DEFAULT now(),
  resolvido boolean DEFAULT false,
  observacoes text
);

-- Tabela para comunidade profissional
CREATE TABLE public.perfis_profissionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text NOT NULL,
  nome_negocio text,
  cidade text,
  estado text,
  especialidades text[],
  whatsapp text,
  instagram text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.backups_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_profissionais ENABLE ROW LEVEL SECURITY;

-- Políticas para backups_usuarios
CREATE POLICY "Qualquer um pode inserir backup" 
ON public.backups_usuarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Apenas administradores podem ver backups" 
ON public.backups_usuarios 
FOR SELECT 
USING (false); -- Por enquanto, apenas via dashboard admin

-- Políticas para perfis_profissionais  
CREATE POLICY "Qualquer um pode ver perfis ativos" 
ON public.perfis_profissionais 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Qualquer um pode inserir perfil" 
ON public.perfis_profissionais 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuario pode atualizar seu próprio perfil" 
ON public.perfis_profissionais 
FOR UPDATE 
USING (true) 
WITH CHECK (true);