-- Criar tabelas para migrar do localStorage para Supabase

-- Tabela para ingredientes do usuário
CREATE TABLE public.ingredientes_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  unidade_padrao TEXT NOT NULL,
  preco_medio NUMERIC(10,2) NOT NULL DEFAULT 0,
  fornecedor TEXT,
  estoque NUMERIC(10,2) DEFAULT 0,
  data_ultima_compra DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para categorias
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  cor_hex TEXT NOT NULL,
  icone TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para receitas
CREATE TABLE public.receitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  categoria_id UUID,
  descricao TEXT,
  tempo_preparo INTEGER, -- em minutos
  rendimento TEXT,
  ingredientes JSONB NOT NULL DEFAULT '[]',
  modo_preparo TEXT,
  observacoes TEXT,
  custo_total NUMERIC(10,2) DEFAULT 0,
  preco_sugerido NUMERIC(10,2) DEFAULT 0,
  margem_lucro NUMERIC(5,2) DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE SET NULL
);

-- Tabela para clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  data_nascimento DATE,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para orçamentos
CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID,
  numero TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  data_evento DATE,
  local_evento TEXT,
  quantidade_pessoas INTEGER,
  itens JSONB NOT NULL DEFAULT '[]',
  valor_total NUMERIC(10,2) DEFAULT 0,
  desconto NUMERIC(10,2) DEFAULT 0,
  valor_final NUMERIC(10,2) DEFAULT 0,
  observacoes TEXT,
  valido_ate DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL
);

-- Tabela para configurações do usuário
CREATE TABLE public.configuracoes_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  moeda TEXT DEFAULT 'BRL',
  fuso_horario TEXT DEFAULT 'America/Sao_Paulo',
  margem_padrao NUMERIC(5,2) DEFAULT 30,
  custo_hora_trabalho NUMERIC(10,2) DEFAULT 25.00,
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_whatsapp BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.ingredientes_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para ingredientes_usuario
CREATE POLICY "Usuários podem ver seus próprios ingredientes" 
ON public.ingredientes_usuario 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir seus próprios ingredientes" 
ON public.ingredientes_usuario 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar seus próprios ingredientes" 
ON public.ingredientes_usuario 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar seus próprios ingredientes" 
ON public.ingredientes_usuario 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para categorias
CREATE POLICY "Usuários podem ver suas próprias categorias" 
ON public.categorias 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir suas próprias categorias" 
ON public.categorias 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar suas próprias categorias" 
ON public.categorias 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar suas próprias categorias" 
ON public.categorias 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para receitas
CREATE POLICY "Usuários podem ver suas próprias receitas" 
ON public.receitas 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir suas próprias receitas" 
ON public.receitas 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar suas próprias receitas" 
ON public.receitas 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar suas próprias receitas" 
ON public.receitas 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para clientes
CREATE POLICY "Usuários podem ver seus próprios clientes" 
ON public.clientes 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir seus próprios clientes" 
ON public.clientes 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar seus próprios clientes" 
ON public.clientes 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar seus próprios clientes" 
ON public.clientes 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para orçamentos
CREATE POLICY "Usuários podem ver seus próprios orçamentos" 
ON public.orcamentos 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir seus próprios orçamentos" 
ON public.orcamentos 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos" 
ON public.orcamentos 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos" 
ON public.orcamentos 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para configurações_usuario
CREATE POLICY "Usuários podem ver suas próprias configurações" 
ON public.configuracoes_usuario 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem inserir suas próprias configurações" 
ON public.configuracoes_usuario 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem atualizar suas próprias configurações" 
ON public.configuracoes_usuario 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_ingredientes_usuario_updated_at
BEFORE UPDATE ON public.ingredientes_usuario
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at
BEFORE UPDATE ON public.categorias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receitas_updated_at
BEFORE UPDATE ON public.receitas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orcamentos_updated_at
BEFORE UPDATE ON public.orcamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuracoes_usuario_updated_at
BEFORE UPDATE ON public.configuracoes_usuario
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();