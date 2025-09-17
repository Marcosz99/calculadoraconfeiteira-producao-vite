import { IngredienteSistema } from '../types'

export const ingredientesSistema: IngredienteSistema[] = [
  // Açúcares e Adoçantes
  { id: '1', nome: 'Açúcar Cristal', unidade_padrao: 'kg', categoria: 'Açúcares', preco_medio_nacional: 4.50 },
  { id: '2', nome: 'Açúcar Refinado', unidade_padrao: 'kg', categoria: 'Açúcares', preco_medio_nacional: 5.20 },
  { id: '3', nome: 'Açúcar Demerara', unidade_padrao: 'kg', categoria: 'Açúcares', preco_medio_nacional: 8.90 },
  { id: '4', nome: 'Açúcar de Confeiteiro', unidade_padrao: 'kg', categoria: 'Açúcares', preco_medio_nacional: 7.80 },
  { id: '5', nome: 'Mel', unidade_padrao: 'kg', categoria: 'Açúcares', preco_medio_nacional: 25.00 },

  // Farinhas
  { id: '6', nome: 'Farinha de Trigo', unidade_padrao: 'kg', categoria: 'Farinhas', preco_medio_nacional: 3.80 },
  { id: '7', nome: 'Farinha de Trigo Integral', unidade_padrao: 'kg', categoria: 'Farinhas', preco_medio_nacional: 5.50 },
  { id: '8', nome: 'Farinha de Amêndoas', unidade_padrao: 'kg', categoria: 'Farinhas', preco_medio_nacional: 65.00 },
  { id: '9', nome: 'Farinha de Coco', unidade_padrao: 'kg', categoria: 'Farinhas', preco_medio_nacional: 18.00 },
  { id: '10', nome: 'Polvilho Doce', unidade_padrao: 'kg', categoria: 'Farinhas', preco_medio_nacional: 7.20 },

  // Lácteos
  { id: '11', nome: 'Leite Integral', unidade_padrao: 'l', categoria: 'Lácteos', preco_medio_nacional: 4.50 },
  { id: '12', nome: 'Creme de Leite', unidade_padrao: 'l', categoria: 'Lácteos', preco_medio_nacional: 8.90 },
  { id: '13', nome: 'Manteiga', unidade_padrao: 'kg', categoria: 'Lácteos', preco_medio_nacional: 22.00 },
  { id: '14', nome: 'Cream Cheese', unidade_padrao: 'kg', categoria: 'Lácteos', preco_medio_nacional: 28.00 },
  { id: '15', nome: 'Iogurte Natural', unidade_padrao: 'kg', categoria: 'Lácteos', preco_medio_nacional: 8.50 },

  // Ovos
  { id: '16', nome: 'Ovos', unidade_padrao: 'unidade', categoria: 'Ovos', preco_medio_nacional: 0.65 },
  { id: '17', nome: 'Clara de Ovo', unidade_padrao: 'kg', categoria: 'Ovos', preco_medio_nacional: 12.00 },
  { id: '18', nome: 'Gema de Ovo', unidade_padrao: 'kg', categoria: 'Ovos', preco_medio_nacional: 15.00 },

  // Chocolates
  { id: '19', nome: 'Chocolate ao Leite', unidade_padrao: 'kg', categoria: 'Chocolates', preco_medio_nacional: 35.00 },
  { id: '20', nome: 'Chocolate Meio Amargo', unidade_padrao: 'kg', categoria: 'Chocolates', preco_medio_nacional: 38.00 },
  { id: '21', nome: 'Chocolate Branco', unidade_padrao: 'kg', categoria: 'Chocolates', preco_medio_nacional: 42.00 },
  { id: '22', nome: 'Cacau em Pó', unidade_padrao: 'kg', categoria: 'Chocolates', preco_medio_nacional: 25.00 },
  { id: '23', nome: 'Nutella', unidade_padrao: 'kg', categoria: 'Chocolates', preco_medio_nacional: 18.50 },

  // Essências e Aromas
  { id: '24', nome: 'Essência de Baunilha', unidade_padrao: 'ml', categoria: 'Essências', preco_medio_nacional: 0.45 },
  { id: '25', nome: 'Essência de Morango', unidade_padrao: 'ml', categoria: 'Essências', preco_medio_nacional: 0.35 },
  { id: '26', nome: 'Essência de Coco', unidade_padrao: 'ml', categoria: 'Essências', preco_medio_nacional: 0.40 },

  // Frutas e Conservas
  { id: '27', nome: 'Morango', unidade_padrao: 'kg', categoria: 'Frutas', preco_medio_nacional: 12.00 },
  { id: '28', nome: 'Maçã', unidade_padrao: 'kg', categoria: 'Frutas', preco_medio_nacional: 6.50 },
  { id: '29', nome: 'Banana', unidade_padrao: 'kg', categoria: 'Frutas', preco_medio_nacional: 4.20 },
  { id: '30', nome: 'Leite Condensado', unidade_padrao: 'kg', categoria: 'Conservas', preco_medio_nacional: 8.90 },

  // Fermento e Melhoradores
  { id: '31', nome: 'Fermento em Pó', unidade_padrao: 'kg', categoria: 'Fermentos', preco_medio_nacional: 18.00 },
  { id: '32', nome: 'Bicarbonato de Sódio', unidade_padrao: 'kg', categoria: 'Fermentos', preco_medio_nacional: 8.50 },
  { id: '33', nome: 'Emulsificante', unidade_padrao: 'kg', categoria: 'Melhoradores', preco_medio_nacional: 15.00 },

  // Decoração
  { id: '34', nome: 'Confeito Colorido', unidade_padrao: 'kg', categoria: 'Decoração', preco_medio_nacional: 22.00 },
  { id: '35', nome: 'Pasta Americana', unidade_padrao: 'kg', categoria: 'Decoração', preco_medio_nacional: 18.00 },
  { id: '36', nome: 'Corante Alimentício', unidade_padrao: 'ml', categoria: 'Decoração', preco_medio_nacional: 0.25 },

  // Outros
  { id: '37', nome: 'Sal', unidade_padrao: 'kg', categoria: 'Outros', preco_medio_nacional: 2.50 },
  { id: '38', nome: 'Óleo Vegetal', unidade_padrao: 'l', categoria: 'Outros', preco_medio_nacional: 8.50 },
  { id: '39', nome: 'Vinagre', unidade_padrao: 'l', categoria: 'Outros', preco_medio_nacional: 4.20 },
  { id: '40', nome: 'Gelatina sem Sabor', unidade_padrao: 'kg', categoria: 'Outros', preco_medio_nacional: 45.00 }
]