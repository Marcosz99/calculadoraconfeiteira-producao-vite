-- Create table for financial transactions
CREATE TABLE public.transacoes_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  descricao TEXT,
  data_transacao DATE NOT NULL,
  metodo_pagamento TEXT,
  comprovante_url TEXT,
  dados_ocr JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for planned expenses
CREATE TABLE public.gastos_planejados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  valor_estimado NUMERIC NOT NULL,
  data_vencimento DATE,
  categoria TEXT NOT NULL,
  observacoes TEXT,
  pago BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos_planejados ENABLE ROW LEVEL SECURITY;

-- Create policies for transacoes_financeiras
CREATE POLICY "Users can view their own transactions" 
ON public.transacoes_financeiras 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transacoes_financeiras 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transacoes_financeiras 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transacoes_financeiras 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for gastos_planejados
CREATE POLICY "Users can view their own planned expenses" 
ON public.gastos_planejados 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own planned expenses" 
ON public.gastos_planejados 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned expenses" 
ON public.gastos_planejados 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned expenses" 
ON public.gastos_planejados 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_transacoes_financeiras_updated_at
BEFORE UPDATE ON public.transacoes_financeiras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gastos_planejados_updated_at
BEFORE UPDATE ON public.gastos_planejados
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();