export interface IngredienteConfeitaria {
  id: string
  nome: string
  categoria: string
  unidade_padrao: string
  preco_medio_nacional: number
}

export const INGREDIENTES_CONFEITARIA: IngredienteConfeitaria[] = [
  // AÇÚCARES E ADOÇANTES
  { id: 'acucar_cristal', nome: 'Açúcar Cristal', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.005 },
  { id: 'acucar_refinado', nome: 'Açúcar Refinado', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.006 },
  { id: 'acucar_mascavo', nome: 'Açúcar Mascavo', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.012 },
  { id: 'acucar_demerara', nome: 'Açúcar Demerara', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.015 },
  { id: 'acucar_confeiteiro', nome: 'Açúcar de Confeiteiro', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.008 },
  { id: 'acucar_impalpavel', nome: 'Açúcar Impalpável', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.010 },
  { id: 'mel', nome: 'Mel', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'glucose_liquida', nome: 'Glucose Líquida', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.018 },
  { id: 'glucose_po', nome: 'Glucose em Pó', categoria: 'Açúcares', unidade_padrao: 'g', preco_medio_nacional: 0.035 },
  { id: 'xarope_milho', nome: 'Xarope de Milho', categoria: 'Açúcares', unidade_padrao: 'ml', preco_medio_nacional: 0.015 },

  // FARINHAS E AMIDOS
  { id: 'farinha_trigo', nome: 'Farinha de Trigo', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.004 },
  { id: 'farinha_trigo_integral', nome: 'Farinha de Trigo Integral', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.008 },
  { id: 'farinha_amendoa', nome: 'Farinha de Amêndoa', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.080 },
  { id: 'farinha_aveia', nome: 'Farinha de Aveia', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.015 },
  { id: 'farinha_coco', nome: 'Farinha de Coco', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'amido_milho', nome: 'Amido de Milho (Maisena)', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.012 },
  { id: 'polvilho_doce', nome: 'Polvilho Doce', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.008 },
  { id: 'polvilho_azedo', nome: 'Polvilho Azedo', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.009 },
  { id: 'fuba', nome: 'Fubá', categoria: 'Farinhas', unidade_padrao: 'g', preco_medio_nacional: 0.005 },

  // CHOCOLATES
  { id: 'chocolate_po', nome: 'Chocolate em Pó', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.020 },
  { id: 'achocolatado_po', nome: 'Achocolatado em Pó', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.015 },
  { id: 'chocolate_meio_amargo', nome: 'Chocolate Meio Amargo', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.040 },
  { id: 'chocolate_amargo', nome: 'Chocolate Amargo 70%', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.055 },
  { id: 'chocolate_branco', nome: 'Chocolate Branco', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.045 },
  { id: 'chocolate_ao_leite', nome: 'Chocolate ao Leite', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.035 },
  { id: 'gotas_chocolate', nome: 'Gotas de Chocolate', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.030 },
  { id: 'cacau_po', nome: 'Cacau em Pó 100%', categoria: 'Chocolates', unidade_padrao: 'g', preco_medio_nacional: 0.050 },

  // LATICÍNIOS
  { id: 'leite_integral', nome: 'Leite Integral', categoria: 'Laticínios', unidade_padrao: 'ml', preco_medio_nacional: 0.004 },
  { id: 'leite_desnatado', nome: 'Leite Desnatado', categoria: 'Laticínios', unidade_padrao: 'ml', preco_medio_nacional: 0.004 },
  { id: 'leite_condensado', nome: 'Leite Condensado', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.008 },
  { id: 'creme_leite', nome: 'Creme de Leite', categoria: 'Laticínios', unidade_padrao: 'ml', preco_medio_nacional: 0.015 },
  { id: 'manteiga', nome: 'Manteiga', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'margarina', nome: 'Margarina', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.012 },
  { id: 'queijo_cream', nome: 'Cream Cheese', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.035 },
  { id: 'iogurte_natural', nome: 'Iogurte Natural', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.012 },
  { id: 'ricota', nome: 'Ricota', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.020 },
  { id: 'mascarpone', nome: 'Mascarpone', categoria: 'Laticínios', unidade_padrao: 'g', preco_medio_nacional: 0.080 },

  // OVOS E SUBSTITUTOS
  { id: 'ovos', nome: 'Ovos', categoria: 'Ovos', unidade_padrao: 'unidade', preco_medio_nacional: 0.80 },
  { id: 'clara_ovos', nome: 'Clara de Ovos', categoria: 'Ovos', unidade_padrao: 'ml', preco_medio_nacional: 0.020 },
  { id: 'gema_ovos', nome: 'Gema de Ovos', categoria: 'Ovos', unidade_padrao: 'ml', preco_medio_nacional: 0.025 },
  { id: 'ovo_desidratado', nome: 'Ovo Desidratado', categoria: 'Ovos', unidade_padrao: 'g', preco_medio_nacional: 0.120 },

  // FERMENTO E AGENTES LEVEDORES
  { id: 'fermento_po', nome: 'Fermento em Pó', categoria: 'Fermentos', unidade_padrao: 'g', preco_medio_nacional: 0.080 },
  { id: 'bicarbonato_sodio', nome: 'Bicarbonato de Sódio', categoria: 'Fermentos', unidade_padrao: 'g', preco_medio_nacional: 0.015 },
  { id: 'cremor_tartaro', nome: 'Cremor Tártaro', categoria: 'Fermentos', unidade_padrao: 'g', preco_medio_nacional: 0.200 },
  { id: 'fermento_biologico', nome: 'Fermento Biológico', categoria: 'Fermentos', unidade_padrao: 'g', preco_medio_nacional: 0.025 },

  // ÓLEOS E GORDURAS
  { id: 'oleo_girassol', nome: 'Óleo de Girassol', categoria: 'Óleos', unidade_padrao: 'ml', preco_medio_nacional: 0.008 },
  { id: 'oleo_canola', nome: 'Óleo de Canola', categoria: 'Óleos', unidade_padrao: 'ml', preco_medio_nacional: 0.012 },
  { id: 'oleo_coco', nome: 'Óleo de Coco', categoria: 'Óleos', unidade_padrao: 'ml', preco_medio_nacional: 0.035 },
  { id: 'gordura_vegetal', nome: 'Gordura Vegetal', categoria: 'Óleos', unidade_padrao: 'g', preco_medio_nacional: 0.015 },

  // ESSÊNCIAS E AROMAS
  { id: 'essencia_baunilha', nome: 'Essência de Baunilha', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 0.500 },
  { id: 'extrato_baunilha', nome: 'Extrato de Baunilha', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 2.000 },
  { id: 'essencia_morango', nome: 'Essência de Morango', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 0.400 },
  { id: 'essencia_chocolate', nome: 'Essência de Chocolate', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 0.600 },
  { id: 'essencia_limao', nome: 'Essência de Limão', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 0.350 },
  { id: 'essencia_coco', nome: 'Essência de Coco', categoria: 'Essências', unidade_padrao: 'ml', preco_medio_nacional: 0.450 },

  // FRUTAS E POLPAS
  { id: 'morango_fresco', nome: 'Morango Fresco', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'banana_nanica', nome: 'Banana Nanica', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.008 },
  { id: 'maca_fuji', nome: 'Maçã Fuji', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.012 },
  { id: 'limao_tahiti', nome: 'Limão Tahiti', categoria: 'Frutas', unidade_padrao: 'unidade', preco_medio_nacional: 0.80 },
  { id: 'laranja_pera', nome: 'Laranja Pêra', categoria: 'Frutas', unidade_padrao: 'unidade', preco_medio_nacional: 1.00 },
  { id: 'polpa_morango', nome: 'Polpa de Morango', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.020 },
  { id: 'polpa_maracuja', nome: 'Polpa de Maracujá', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'polpa_acai', nome: 'Polpa de Açaí', categoria: 'Frutas', unidade_padrao: 'g', preco_medio_nacional: 0.030 },

  // NOZES E CASTANHAS
  { id: 'amendoa_laminas', nome: 'Amêndoa em Lâminas', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.080 },
  { id: 'amendoa_picada', nome: 'Amêndoa Picada', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.070 },
  { id: 'castanha_para', nome: 'Castanha do Pará', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.060 },
  { id: 'castanha_caju', nome: 'Castanha de Caju', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.080 },
  { id: 'noz_peca', nome: 'Noz Pecã', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.120 },
  { id: 'amendoim', nome: 'Amendoim', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.015 },
  { id: 'pistache', nome: 'Pistache', categoria: 'Nozes', unidade_padrao: 'g', preco_medio_nacional: 0.200 },

  // ESPECIARIAS
  { id: 'canela_po', nome: 'Canela em Pó', categoria: 'Especiarias', unidade_padrao: 'g', preco_medio_nacional: 0.100 },
  { id: 'canela_pau', nome: 'Canela em Pau', categoria: 'Especiarias', unidade_padrao: 'g', preco_medio_nacional: 0.150 },
  { id: 'noz_moscada', nome: 'Noz Moscada', categoria: 'Especiarias', unidade_padrao: 'g', preco_medio_nacional: 0.300 },
  { id: 'cravo_po', nome: 'Cravo em Pó', categoria: 'Especiarias', unidade_padrao: 'g', preco_medio_nacional: 0.400 },
  { id: 'gengibre_po', nome: 'Gengibre em Pó', categoria: 'Especiarias', unidade_padrao: 'g', preco_medio_nacional: 0.250 },

  // GELATINAS E ESPESSANTES
  { id: 'gelatina_incolor', nome: 'Gelatina Incolor', categoria: 'Gelatinas', unidade_padrao: 'g', preco_medio_nacional: 0.150 },
  { id: 'gelatina_vermelha', nome: 'Gelatina Vermelha', categoria: 'Gelatinas', unidade_padrao: 'g', preco_medio_nacional: 0.120 },
  { id: 'agar_agar', nome: 'Ágar Ágar', categoria: 'Gelatinas', unidade_padrao: 'g', preco_medio_nacional: 0.800 },

  // CORANTES
  { id: 'corante_vermelho', nome: 'Corante Vermelho', categoria: 'Corantes', unidade_padrao: 'ml', preco_medio_nacional: 0.300 },
  { id: 'corante_azul', nome: 'Corante Azul', categoria: 'Corantes', unidade_padrao: 'ml', preco_medio_nacional: 0.300 },
  { id: 'corante_amarelo', nome: 'Corante Amarelo', categoria: 'Corantes', unidade_padrao: 'ml', preco_medio_nacional: 0.300 },
  { id: 'corante_verde', nome: 'Corante Verde', categoria: 'Corantes', unidade_padrao: 'ml', preco_medio_nacional: 0.300 },
  { id: 'corante_rosa', nome: 'Corante Rosa', categoria: 'Corantes', unidade_padrao: 'ml', preco_medio_nacional: 0.300 },

  // COBERTURAS E RECHEIOS
  { id: 'chantilly_po', nome: 'Chantilly em Pó', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.040 },
  { id: 'brigadeiro_pronto', nome: 'Brigadeiro Pronto', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'doce_leite', nome: 'Doce de Leite', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.018 },
  { id: 'geleia_morango', nome: 'Geléia de Morango', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.020 },
  { id: 'nutella', nome: 'Nutella', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.045 },
  { id: 'creme_avela', nome: 'Creme de Avelã', categoria: 'Coberturas', unidade_padrao: 'g', preco_medio_nacional: 0.035 },

  // CONFEITOS E DECORAÇÃO
  { id: 'confeitos_coloridos', nome: 'Confeitos Coloridos', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.080 },
  { id: 'granulado_chocolate', nome: 'Granulado de Chocolate', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'granulado_colorido', nome: 'Granulado Colorido', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.030 },
  { id: 'coco_ralado', nome: 'Coco Ralado', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.020 },
  { id: 'pacoca_farofa', nome: 'Paçoca Farofa', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.035 },
  { id: 'bolinhas_chocolate', nome: 'Bolinhas de Chocolate', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.120 },
  { id: 'perolas_acucar', nome: 'Pérolas de Açúcar', categoria: 'Decoração', unidade_padrao: 'g', preco_medio_nacional: 0.200 },

  // PASTA AMERICANA E MODELAGEM
  { id: 'pasta_americana', nome: 'Pasta Americana Branca', categoria: 'Modelagem', unidade_padrao: 'g', preco_medio_nacional: 0.025 },
  { id: 'pasta_americana_colorida', nome: 'Pasta Americana Colorida', categoria: 'Modelagem', unidade_padrao: 'g', preco_medio_nacional: 0.035 },
  { id: 'fondant', nome: 'Fondant', categoria: 'Modelagem', unidade_padrao: 'g', preco_medio_nacional: 0.040 },
  { id: 'goma_tragacanto', nome: 'Goma Tragacanto', categoria: 'Modelagem', unidade_padrao: 'g', preco_medio_nacional: 2.500 },

  // BEBIDAS E LÍQUIDOS
  { id: 'cafe_liquido', nome: 'Café Líquido', categoria: 'Líquidos', unidade_padrao: 'ml', preco_medio_nacional: 0.008 },
  { id: 'rum', nome: 'Rum', categoria: 'Líquidos', unidade_padrao: 'ml', preco_medio_nacional: 0.080 },
  { id: 'conhaque', nome: 'Conhaque', categoria: 'Líquidos', unidade_padrao: 'ml', preco_medio_nacional: 0.100 },
  { id: 'licor_chocolate', nome: 'Licor de Chocolate', categoria: 'Líquidos', unidade_padrao: 'ml', preco_medio_nacional: 0.120 },

  // OUTROS ESSENCIAIS
  { id: 'sal_refinado', nome: 'Sal Refinado', categoria: 'Outros', unidade_padrao: 'g', preco_medio_nacional: 0.002 },
  { id: 'vinagre_branco', nome: 'Vinagre Branco', categoria: 'Outros', unidade_padrao: 'ml', preco_medio_nacional: 0.005 },
  { id: 'suco_limao', nome: 'Suco de Limão', categoria: 'Outros', unidade_padrao: 'ml', preco_medio_nacional: 0.015 },
  { id: 'raspas_limao', nome: 'Raspas de Limão', categoria: 'Outros', unidade_padrao: 'g', preco_medio_nacional: 0.200 },
  { id: 'raspas_laranja', nome: 'Raspas de Laranja', categoria: 'Outros', unidade_padrao: 'g', preco_medio_nacional: 0.180 }
]

// Top 30 ingredientes mais usados por confeiteiras
export const INGREDIENTES_MAIS_USADOS = [
  'acucar_cristal',
  'farinha_trigo', 
  'ovos',
  'manteiga',
  'leite_integral',
  'fermento_po',
  'chocolate_po',
  'leite_condensado',
  'creme_leite',
  'essencia_baunilha',
  'acucar_confeiteiro',
  'oleo_girassol',
  'bicarbonato_sodio',
  'sal_refinado',
  'doce_leite',
  'chantilly_po',
  'granulado_chocolate',
  'coco_ralado',
  'limao_tahiti',
  'corante_vermelho',
  'margarina',
  'glucose_liquida',
  'amido_milho',
  'queijo_cream',
  'chocolate_meio_amargo',
  'essencia_morango',
  'polpa_morango',
  'canela_po',
  'gelatina_incolor',
  'confeitos_coloridos'
]

// Função para buscar ingredientes por categoria
export const getIngredientesPorCategoria = (categoria: string): IngredienteConfeitaria[] => {
  return INGREDIENTES_CONFEITARIA.filter(ing => ing.categoria === categoria)
}

// Lista de categorias disponíveis
export const CATEGORIAS_INGREDIENTES = [
  'Açúcares',
  'Farinhas', 
  'Chocolates',
  'Laticínios',
  'Ovos',
  'Fermentos',
  'Óleos',
  'Essências',
  'Frutas',
  'Nozes',
  'Especiarias',
  'Gelatinas',
  'Corantes',
  'Coberturas',
  'Decoração',
  'Modelagem',
  'Líquidos',
  'Outros'
]