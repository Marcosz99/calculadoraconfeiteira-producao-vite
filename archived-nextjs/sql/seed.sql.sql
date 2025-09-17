-- DADOS INICIAIS - CATEGORIAS E INGREDIENTES
-- Execute após criar o schema principal

-- CATEGORIAS DE INGREDIENTES
INSERT INTO public.categorias_ingredientes (nome, cor, icone) VALUES
('Farinhas e Cereais', '#8B4513', 'wheat'),
('Açúcares e Adoçantes', '#FFD700', 'candy'),
('Chocolates e Cacau', '#654321', 'cookie'),
('Laticínios', '#FFFFFF', 'milk'),
('Ovos', '#FFA500', 'egg'),
('Frutas Frescas', '#FF6347', 'apple'),
('Frutas Secas e Nozes', '#DEB887', 'nut'),
('Especiarias', '#D2691E', 'leaf'),
('Fermento e Essências', '#90EE90', 'flask'),
('Recheios e Coberturas', '#FF69B4', 'ice-cream'),
('Embalagens', '#C0C0C0', 'package-2');

-- INGREDIENTES BASE COM PREÇOS MÉDIOS (R$ por KG - Nov 2024)
INSERT INTO public.ingredientes (nome, categoria_id, preco_kg, unidade, densidade) VALUES
-- Farinhas e Cereais
('Farinha de Trigo', (SELECT id FROM categorias_ingredientes WHERE nome = 'Farinhas e Cereais'), 4.50, 'g', 0.6),
('Farinha de Amêndoa', (SELECT id FROM categorias_ingredientes WHERE nome = 'Farinhas e Cereais'), 45.00, 'g', 0.65),
('Amido de Milho', (SELECT id FROM categorias_ingredientes WHERE nome = 'Farinhas e Cereais'), 8.00, 'g', 0.7),
('Aveia em Flocos', (SELECT id FROM categorias_ingredientes WHERE nome = 'Farinhas e Cereais'), 12.00, 'g', 0.4),

-- Açúcares e Adoçantes  
('Açúcar Cristal', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 4.20, 'g', 0.8),
('Açúcar Refinado', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 4.80, 'g', 0.85),
('Açúcar Demerara', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 8.50, 'g', 0.75),
('Açúcar de Confeiteiro', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 7.20, 'g', 0.6),
('Mel', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 18.00, 'ml', 1.4),
('Glucose de Milho', (SELECT id FROM categorias_ingredientes WHERE nome = 'Açúcares e Adoçantes'), 15.00, 'ml', 1.3),

-- Chocolates e Cacau
('Chocolate 70% Cacau', (SELECT id FROM categorias_ingredientes WHERE nome = 'Chocolates e Cacau'), 35.00, 'g', 1.0),
('Chocolate ao Leite', (SELECT id FROM categorias_ingredientes WHERE nome = 'Chocolates e Cacau'), 28.00, 'g', 1.0),
('Chocolate Branco', (SELECT id FROM categorias_ingredientes WHERE nome = 'Chocolates e Cacau'), 32.00, 'g', 1.0),
('Cacau em Pó', (SELECT id FROM categorias_ingredientes WHERE nome = 'Chocolates e Cacau'), 25.00, 'g', 0.5),
('Chocolate Gotas', (SELECT id FROM categorias_ingredientes WHERE nome = 'Chocolates e Cacau'), 22.00, 'g', 1.0),

-- Laticínios
('Leite Integral', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 5.50, 'ml', 1.03),
('Creme de Leite', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 8.00, 'ml', 1.0),
('Manteiga', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 18.00, 'g', 0.9),
('Cream Cheese', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 24.00, 'g', 1.0),
('Leite Condensado', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 8.50, 'ml', 1.2),
('Leite em Pó', (SELECT id FROM categorias_ingredientes WHERE nome = 'Laticínios'), 22.00, 'g', 0.5),

-- Ovos
('Ovos Grandes', (SELECT id FROM categorias_ingredientes WHERE nome = 'Ovos'), 12.00, 'unidades', 1.0),
('Clara de Ovo', (SELECT id FROM categorias_ingredientes WHERE nome = 'Ovos'), 18.00, 'ml', 1.0),
('Gema de Ovo', (SELECT id FROM categorias_ingredientes WHERE nome = 'Ovos'), 25.00, 'ml', 1.0),

-- Frutas Frescas
('Morangos', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Frescas'), 12.00, 'g', 0.9),
('Bananas', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Frescas'), 6.50, 'g', 0.9),
('Limão (suco)', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Frescas'), 8.00, 'ml', 1.0),
('Maçã', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Frescas'), 7.50, 'g', 0.85),

-- Frutas Secas e Nozes
('Amêndoas', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Secas e Nozes'), 55.00, 'g', 0.8),
('Castanha do Pará', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Secas e Nozes'), 65.00, 'g', 0.7),
('Nozes', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Secas e Nozes'), 48.00, 'g', 0.6),
('Coco Ralado', (SELECT id FROM categorias_ingredientes WHERE nome = 'Frutas Secas e Nozes'), 15.00, 'g', 0.4),

-- Especiarias
('Canela em Pó', (SELECT id FROM categorias_ingredientes WHERE nome = 'Especiarias'), 35.00, 'g', 0.6),
('Cravo da Índia', (SELECT id FROM categorias_ingredientes WHERE nome = 'Especiarias'), 80.00, 'g', 0.8),
('Noz Moscada', (SELECT id FROM categorias_ingredientes WHERE nome = 'Especiarias'), 120.00, 'g', 0.7),
('Sal', (SELECT id FROM categorias_ingredientes WHERE nome = 'Especiarias'), 3.00, 'g', 1.2),

-- Fermento e Essências
('Fermento em Pó', (SELECT id FROM categorias_ingredientes WHERE nome = 'Fermento e Essências'), 18.00, 'g', 0.8),
('Bicarbonato de Sódio', (SELECT id FROM categorias_ingredientes WHERE nome = 'Fermento e Essências'), 12.00, 'g', 2.2),
('Essência de Baunilha', (SELECT id FROM categorias_ingredientes WHERE nome = 'Fermento e Essências'), 25.00, 'ml', 0.9),
('Essência de Morango', (SELECT id FROM categorias_ingredientes WHERE nome = 'Fermento e Essências'), 18.00, 'ml', 0.9),

-- Recheios e Coberturas
('Doce de Leite', (SELECT id FROM categorias_ingredientes WHERE nome = 'Recheios e Coberturas'), 12.00, 'g', 1.2),
('Nutella', (SELECT id FROM categorias_ingredientes WHERE nome = 'Recheios e Coberturas'), 32.00, 'g', 1.1),
('Geleia de Morango', (SELECT id FROM categorias_ingredientes WHERE nome = 'Recheios e Coberturas'), 8.50, 'g', 1.1),
('Chantilly', (SELECT id FROM categorias_ingredientes WHERE nome = 'Recheios e Coberturas'), 15.00, 'ml', 0.8),

-- Embalagens
('Formas de Papel', (SELECT id FROM categorias_ingredientes WHERE nome = 'Embalagens'), 0.15, 'unidades', 1.0),
('Caixas de Doces', (SELECT id FROM categorias_ingredientes WHERE nome = 'Embalagens'), 1.20, 'unidades', 1.0),
('Sacolas Personalizadas', (SELECT id FROM categorias_ingredientes WHERE nome = 'Embalagens'), 0.80, 'unidades', 1.0),
('Papel Crepom', (SELECT id FROM categorias_ingredientes WHERE nome = 'Embalagens'), 0.05, 'g', 0.1);

-- RECEITAS TEMPLATE (algumas receitas populares para começar)
-- Nota: Será implementado via interface, mas aqui alguns exemplos para referência

/*
RECEITA EXEMPLO: BRIGADEIRO TRADICIONAL
- Leite Condensado: 395g (1 lata)
- Chocolate em Pó: 50g
- Manteiga: 15g
- Chocolate Granulado: 100g (cobertura)
Rendimento: 30 unidades
Tempo: 30 minutos
Complexidade: Simples

RECEITA EXEMPLO: BOLO DE CHOCOLATE SIMPLES  
- Farinha de Trigo: 300g
- Açúcar: 250g
- Cacau em Pó: 50g
- Ovos: 3 unidades (150g)
- Leite: 200ml
- Óleo: 100ml
- Fermento: 15g
Rendimento: 1 bolo (12 fatias)
Tempo: 90 minutos
Complexidade: Média
*/