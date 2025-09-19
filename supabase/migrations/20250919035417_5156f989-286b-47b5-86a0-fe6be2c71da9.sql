-- Melhorar a tabela de perfis existente
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telefone TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS nome_negocio TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS foto_perfil TEXT,
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS valor_hora DECIMAL(10,2) DEFAULT 0;

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo_pagamento TEXT NOT NULL CHECK (tipo_pagamento IN ('pix', 'cartao', 'transferencia')),
  valor DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'cancelado')),
  plano TEXT NOT NULL CHECK (plano IN ('free', 'pro', 'premium')),
  referencia_externa TEXT, -- ID do payment no Stripe/PIX
  dados_pagamento JSONB, -- Dados extras do pagamento
  data_vencimento TIMESTAMP WITH TIME ZONE,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de pagamentos
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pagamentos
CREATE POLICY "Usuários podem ver seus próprios pagamentos"
  ON public.pagamentos
  FOR SELECT
  USING (user_id = (SELECT id FROM public.profiles WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Usuários podem criar seus próprios pagamentos"
  ON public.pagamentos
  FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Usuários podem atualizar seus próprios pagamentos"
  ON public.pagamentos
  FOR UPDATE
  USING (user_id = (SELECT id FROM public.profiles WHERE email = auth.jwt() ->> 'email'));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at na tabela pagamentos
CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON public.pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();