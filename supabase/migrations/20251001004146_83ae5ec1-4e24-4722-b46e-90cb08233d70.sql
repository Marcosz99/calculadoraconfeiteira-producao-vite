-- Primeiro adicionar as colunas stripe_product_id e stripe_price_id
ALTER TABLE public.ebooks 
ADD COLUMN IF NOT EXISTS stripe_product_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Agora inserir os 3 ebooks
INSERT INTO public.ebooks (
  titulo,
  autor,
  categoria,
  descricao,
  preco,
  capa_url,
  arquivo_url,
  tags,
  ativo,
  stripe_product_id,
  stripe_price_id
) VALUES 
(
  '30 Receitas de Mini Donuts',
  'DoceCalc',
  'receitas',
  'Ebook completo com 30 receitas deliciosas de mini donuts. Arquivo PDF para download imediato após a compra.',
  49.00,
  'https://dbwbxzbtydeauczfleqx.supabase.co/storage/v1/object/public/ebooks/30-Receitas-de-Mini-Donuts.pdf',
  '30-Receitas-de-Mini-Donuts.pdf',
  ARRAY['donuts', 'receitas', 'confeitaria'],
  true,
  'prod_T9X9DCn7hZq010',
  'price_1SDE5UEkyU3B9iiUFBwFmvYM'
),
(
  'A Arte do Pudim',
  'DoceCalc',
  'receitas',
  'Ebook exclusivo sobre a arte de fazer pudins perfeitos. Arquivo PDF para download imediato após a compra.',
  49.00,
  'https://dbwbxzbtydeauczfleqx.supabase.co/storage/v1/object/public/ebooks/A-Arte-do-Pudim.pdf',
  'A-Arte-do-Pudim.pdf',
  ARRAY['pudim', 'sobremesa', 'receitas'],
  true,
  'prod_T9X9GkI3ypswGa',
  'price_1SDE5fEkyU3B9iiUMJ8IkSBF'
),
(
  'Ebook Receitas de Chocolate',
  'DoceCalc',
  'receitas',
  'Coleção completa de receitas de chocolate para confeiteiros. Arquivo PDF para download imediato após a compra.',
  49.00,
  'https://dbwbxzbtydeauczfleqx.supabase.co/storage/v1/object/public/ebooks/Ebook receitas de Chocolate.pdf',
  'Ebook receitas de Chocolate.pdf',
  ARRAY['chocolate', 'receitas', 'confeitaria'],
  true,
  'prod_T9XAAMXEwUIKbl',
  'price_1SDE5rEkyU3B9iiUXeswYomO'
)
ON CONFLICT (stripe_product_id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  stripe_price_id = EXCLUDED.stripe_price_id,
  ativo = EXCLUDED.ativo,
  updated_at = now();