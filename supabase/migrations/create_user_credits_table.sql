-- Criar tabela para controle de créditos de IA dos usuários
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'professional')),
  credits_ia integer NOT NULL DEFAULT 30,
  credits_used_this_month integer NOT NULL DEFAULT 0,
  reset_date timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS user_credits_plan_type_idx ON user_credits(plan_type);

-- RLS (Row Level Security)
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários só acessam seus próprios créditos
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits" ON user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_credits_updated_at 
  BEFORE UPDATE ON user_credits 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();