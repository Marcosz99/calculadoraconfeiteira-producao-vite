-- SCHEMA CORRIGIDO - CALCULADORA CONFEITEIRA
-- Execute este script no SQL Editor do Supabase

-- Enable RLS
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- 1. PROFILES (Cadastro simples)
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    plano VARCHAR DEFAULT 'free' CHECK (plano IN ('free', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIAS DE INGREDIENTES
CREATE TABLE public.categorias_ingredientes (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL,
    cor VARCHAR DEFAULT '#3B82F6',
    icone VARCHAR DEFAULT 'package',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 3. INGREDIENTES BASE
CREATE TABLE public.ingredientes (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL,
    categoria_id UUID REFERENCES public.categorias_ingredientes(id),
    preco_kg DECIMAL(10,2) NOT NULL,
    unidade VARCHAR DEFAULT 'g' CHECK (unidade IN ('g', 'ml', 'unidades')),
    densidade DECIMAL(5,2) DEFAULT 1.0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 4. RECEITAS
CREATE TABLE public.receitas (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL,
    descricao TEXT,
    tempo_producao INTEGER DEFAULT 60,
    complexidade VARCHAR DEFAULT 'media' CHECK (complexidade IN ('simples', 'media', 'complexa')),
    rendimento INTEGER DEFAULT 1,
    imagem_url VARCHAR,
    categoria VARCHAR DEFAULT 'doces',
    ativa BOOLEAN DEFAULT true,
    custo_calculado DECIMAL(10,2),
    preco_sugerido DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 5. RECEITA <-> INGREDIENTES
CREATE TABLE public.receita_ingredientes (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    receita_id UUID NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
    ingrediente_id UUID NOT NULL REFERENCES public.ingredientes(id),
    quantidade DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(receita_id, ingrediente_id)
);

-- 6. HISTÓRICO DE CÁLCULOS
CREATE TABLE public.calculos_salvos (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receita_id UUID NOT NULL REFERENCES public.receitas(id),
    quantidade_produzida INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    preco_total DECIMAL(10,2) NOT NULL,
    detalhes JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- 7. ORÇAMENTOS
CREATE TABLE public.orcamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cliente_nome VARCHAR NOT NULL,
    cliente_contato VARCHAR,
    itens JSONB NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'concluido')),
    observacoes TEXT,
    valido_ate DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_ingredientes_updated_at BEFORE UPDATE ON public.categorias_ingredientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredientes_updated_at BEFORE UPDATE ON public.ingredientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receitas_updated_at BEFORE UPDATE ON public.receitas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receita_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculos_salvos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_ingredientes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Demais policies (iguais às que você já tinha, ajustadas)
CREATE POLICY "Users can view own receitas" ON public.receitas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create receitas" ON public.receitas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own receitas" ON public.receitas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own receitas" ON public.receitas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view receita ingredients" ON public.receita_ingredientes FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.receitas WHERE id = receita_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage receita ingredients" ON public.receita_ingredientes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.receitas WHERE id = receita_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own calculos" ON public.calculos_salvos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create calculos" ON public.calculos_salvos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orcamentos" ON public.orcamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orcamentos" ON public.orcamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orcamentos" ON public.orcamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own orcamentos" ON public.orcamentos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ingredientes" ON public.ingredientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create ingredientes" ON public.ingredientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ingredientes" ON public.ingredientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ingredientes" ON public.ingredientes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own categorias" ON public.categorias_ingredientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create categorias" ON public.categorias_ingredientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categorias" ON public.categorias_ingredientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categorias" ON public.categorias_ingredientes FOR DELETE USING (auth.uid() = user_id);
