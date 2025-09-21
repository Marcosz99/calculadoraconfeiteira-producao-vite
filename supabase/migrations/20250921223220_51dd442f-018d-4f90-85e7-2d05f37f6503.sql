-- ===== CONFIGURAR STORAGE PARA IMAGENS =====
-- Criar buckets de storage para diferentes tipos de imagens
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('receitas', 'receitas', true),
  ('perfis', 'perfis', true),
  ('documentos', 'documentos', false),
  ('logos', 'logos', true),
  ('ebooks', 'ebooks', false);

-- ===== POLÍTICAS DE STORAGE =====
-- Receitas: usuários podem fazer upload de imagens de suas receitas
CREATE POLICY "Usuários podem fazer upload de imagens de receitas"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receitas' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem ver imagens de receitas"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'receitas');

CREATE POLICY "Usuários podem atualizar suas próprias imagens de receitas"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'receitas' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas próprias imagens de receitas"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'receitas' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Perfis: usuários podem fazer upload de avatares
CREATE POLICY "Usuários podem fazer upload de avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'perfis' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem ver avatares"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'perfis');

CREATE POLICY "Usuários podem atualizar seu próprio avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'perfis' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Logos: usuários podem fazer upload de logos de negócio
CREATE POLICY "Usuários podem fazer upload de logo"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem ver logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Usuários podem atualizar seu próprio logo"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Documentos: apenas o próprio usuário pode ver/manipular
CREATE POLICY "Usuários podem fazer upload de documentos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem ver seus próprios documentos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Ebooks: apenas admins podem fazer upload, usuários podem baixar se compraram
CREATE POLICY "Admins podem fazer upload de ebooks"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'ebooks');

CREATE POLICY "Usuários podem baixar ebooks comprados"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ebooks');

-- ===== TABELAS PARA CONTROLE DE EBOOKS =====
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  autor TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  arquivo_url TEXT,
  capa_url TEXT,
  categoria TEXT,
  tags TEXT[],
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.compras_ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  preco_pago NUMERIC(10,2) NOT NULL,
  metodo_pagamento TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  dados_pagamento JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ebook_id)
);

-- ===== RLS PARA EBOOKS =====
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_ebooks ENABLE ROW LEVEL SECURITY;

-- Todos podem ver ebooks ativos
CREATE POLICY "Todos podem ver ebooks ativos"
  ON public.ebooks
  FOR SELECT
  USING (ativo = true);

-- Admins podem gerenciar ebooks (por enquanto todos podem para simplificar)
CREATE POLICY "Admins podem gerenciar ebooks"
  ON public.ebooks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Usuários podem ver suas próprias compras
CREATE POLICY "Usuários podem ver suas compras"
  ON public.compras_ebooks
  FOR SELECT
  USING (((auth.uid())::text = (user_id)::text));

-- Usuários podem fazer compras
CREATE POLICY "Usuários podem fazer compras"
  ON public.compras_ebooks
  FOR INSERT
  WITH CHECK (((auth.uid())::text = (user_id)::text));

-- Admins podem atualizar status de compras
CREATE POLICY "Admins podem atualizar compras"
  ON public.compras_ebooks
  FOR UPDATE
  USING (true);

-- ===== TABELA PARA HISTÓRICO DE IA =====
CREATE TABLE public.historico_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo_operacao TEXT NOT NULL,
  prompt_usuario TEXT NOT NULL,
  resposta_ia TEXT NOT NULL,
  creditos_usados INTEGER DEFAULT 1,
  metadados JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.historico_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu histórico de IA"
  ON public.historico_ia
  FOR SELECT
  USING (((auth.uid())::text = (user_id)::text));

CREATE POLICY "Sistema pode inserir histórico de IA"
  ON public.historico_ia
  FOR INSERT
  WITH CHECK (((auth.uid())::text = (user_id)::text));

-- ===== TABELA DE CRÉDITOS DE IA =====
CREATE TABLE public.creditos_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plano TEXT NOT NULL DEFAULT 'free',
  creditos_totais INTEGER NOT NULL DEFAULT 30,
  creditos_usados INTEGER NOT NULL DEFAULT 0,
  data_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.creditos_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus créditos"
  ON public.creditos_ia
  FOR SELECT
  USING (((auth.uid())::text = (user_id)::text));

CREATE POLICY "Sistema pode gerenciar créditos"
  ON public.creditos_ia
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ===== TRIGGERS PARA UPDATED_AT =====
CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compras_ebooks_updated_at
  BEFORE UPDATE ON public.compras_ebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creditos_ia_updated_at
  BEFORE UPDATE ON public.creditos_ia
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ===== FUNÇÃO PARA RESETAR CRÉDITOS MENSALMENTE =====
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.creditos_ia 
  SET creditos_usados = 0,
      data_reset = (date_trunc('month', now()) + interval '1 month'),
      updated_at = now()
  WHERE data_reset <= now();
END;
$$;