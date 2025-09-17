import { ReceitaCompleta, CalculoDetalhes } from '@/lib/database-types'

// Multiplicadores de complexidade para mão de obra
export const MULTIPLICADORES_COMPLEXIDADE = {
  simples: 1.0,   // Brigadeiro, beijinho, etc
  media: 1.5,     // Bolo simples, torta básica
  complexa: 2.0   // Cake design, doces elaborados
} as const

// Percentuais de custos fixos
export const CUSTOS_FIXOS = {
  energia: 0.03,      // 3% do custo base
  gas: 0.02,          // 2% do custo base
  embalagem: 0.05,    // 5% do custo base
  transporte: 0.02,   // 2% do custo base (se houver entrega)
  outros: 0.01        // 1% do custo base (desgaste equipamentos, etc)
} as const

export const CUSTOS_FIXOS_TOTAL = Object.values(CUSTOS_FIXOS).reduce((acc, val) => acc + val, 0)

// Função principal de cálculo de preços
export function calcularPrecoReceita(
  receita: ReceitaCompleta,
  valorHoraTrabalhador: number,
  margemLucro: number,
  quantidadeProduzir: number = 1,
  incluirTransporte: boolean = false
): CalculoDetalhes {
  
  // 1. Calcular custo dos ingredientes
  const { custoIngredientes, breakdown } = calcularCustoIngredientes(
    receita,
    quantidadeProduzir
  )
  
  // 2. Calcular custo da mão de obra
  const custoMaoDeObra = calcularCustoMaoDeObra(
    receita,
    valorHoraTrabalhador,
    quantidadeProduzir
  )
  
  // 3. Calcular custos fixos
  const custoBase = custoIngredientes + custoMaoDeObra
  let custosFixos = custoBase * (CUSTOS_FIXOS_TOTAL - CUSTOS_FIXOS.transporte)
  
  if (incluirTransporte) {
    custosFixos += custoBase * CUSTOS_FIXOS.transporte
  }
  
  // 4. Custo total
  const custoTotal = custoIngredientes + custoMaoDeObra + custosFixos
  
  // 5. Preço final com margem de lucro
  const precoFinal = custoTotal * (1 + margemLucro)
  
  return {
    custoIngredientes,
    custoMaoDeObra,
    custosFixos,
    custoTotal,
    margemLucro,
    precoFinal: Math.ceil(precoFinal * 2) / 2, // Arredonda para 0,50
    breakdown
  }
}

// Calcular custo dos ingredientes
function calcularCustoIngredientes(
  receita: ReceitaCompleta,
  quantidadeProduzir: number
) {
  let custoIngredientes = 0
  const breakdown: { ingrediente: string; quantidade: number; custo: number }[] = []
  
  receita.receita_ingredientes.forEach(receitaIngrediente => {
    const ingrediente = receitaIngrediente.ingredientes
    const quantidadeNecessaria = receitaIngrediente.quantidade * quantidadeProduzir
    
    // Calcular custo usando preço por kg (convertido para preço por unidade)
    const custoIngrediente = quantidadeNecessaria * (ingrediente.preco_por_unidade || ingrediente.preco_kg)
    
    custoIngredientes += custoIngrediente
    breakdown.push({
      ingrediente: ingrediente.nome,
      quantidade: quantidadeNecessaria,
      custo: custoIngrediente
    })
  })
  
  return { custoIngredientes, breakdown }
}

// Calcular custo da mão de obra
function calcularCustoMaoDeObra(
  receita: ReceitaCompleta,
  valorHora: number,
  quantidadeProduzir: number
): number {
  const tempoTotalMinutos = (receita.tempo_preparo || receita.tempo_producao) * quantidadeProduzir
  const tempoTotalHoras = tempoTotalMinutos / 60
  
  const multiplicador = MULTIPLICADORES_COMPLEXIDADE[receita.complexidade]
  
  return tempoTotalHoras * valorHora * multiplicador
}

// Calcular preço por unidade
export function calcularPrecoPorUnidade(
  receita: ReceitaCompleta,
  valorHoraTrabalhador: number,
  margemLucro: number,
  incluirTransporte: boolean = false
): number {
  const calculo = calcularPrecoReceita(
    receita,
    valorHoraTrabalhador,
    margemLucro,
    1,
    incluirTransporte
  )
  
  return calculo.precoFinal / receita.rendimento
}

// Função para sugerir margem de lucro baseada na complexidade
export function sugerirMargemLucro(complexidade: 'simples' | 'media' | 'complexa'): number {
  switch (complexidade) {
    case 'simples':
      return 0.40 // 40% de margem para produtos simples
    case 'media':
      return 0.60 // 60% de margem para produtos médios
    case 'complexa':
      return 0.80 // 80% de margem para produtos complexos
    default:
      return 0.50
  }
}

// Função para calcular preço de venda competitivo
export function calcularPrecoCompetitivo(
  custoTotal: number,
  margemMinima: number = 0.30, // 30% margem mínima
  margemMaxima: number = 1.00   // 100% margem máxima
) {
  const precoMinimo = custoTotal * (1 + margemMinima)
  const precoMaximo = custoTotal * (1 + margemMaxima)
  const precoSugerido = custoTotal * (1 + 0.50) // 50% margem padrão
  
  return {
    precoMinimo: Math.ceil(precoMinimo * 2) / 2,
    precoMaximo: Math.ceil(precoMaximo * 2) / 2,
    precoSugerido: Math.ceil(precoSugerido * 2) / 2
  }
}

// Função para análise de rentabilidade
export function analisarRentabilidade(
  precoVenda: number,
  custoTotal: number
) {
  const lucro = precoVenda - custoTotal
  const margemPercentual = (lucro / custoTotal) * 100
  const margemSobreVenda = (lucro / precoVenda) * 100
  
  let classificacao: 'baixa' | 'boa' | 'excelente'
  
  if (margemPercentual < 30) {
    classificacao = 'baixa'
  } else if (margemPercentual < 60) {
    classificacao = 'boa'
  } else {
    classificacao = 'excelente'
  }
  
  return {
    lucro,
    margemPercentual: Math.round(margemPercentual * 100) / 100,
    margemSobreVenda: Math.round(margemSobreVenda * 100) / 100,
    classificacao
  }
}

// Função para calcular economia de escala
export function calcularEconomiaEscala(
  receita: ReceitaCompleta,
  valorHora: number,
  margem: number,
  quantidades: number[]
) {
  return quantidades.map(qty => {
    const calculo = calcularPrecoReceita(receita, valorHora, margem, qty)
    const precoPorUnidade = calculo.precoFinal / (receita.rendimento * qty)
    
    return {
      quantidade: qty,
      custoTotal: calculo.custoTotal,
      precoTotal: calculo.precoFinal,
      precoPorUnidade: Math.ceil(precoPorUnidade * 2) / 2,
      economiaPercentual: qty > 1 ? 
        ((quantidades[0] && calcularPrecoReceita(receita, valorHora, margem, 1).precoFinal / receita.rendimento) - precoPorUnidade) / 
        (quantidades[0] && calcularPrecoReceita(receita, valorHora, margem, 1).precoFinal / receita.rendimento) * 100 : 0
    }
  })
}

// Função para validar se os preços estão corretos
export function validarCalculos(calculo: CalculoDetalhes): {
  valido: boolean
  erros: string[]
  avisos: string[]
} {
  const erros: string[] = []
  const avisos: string[] = []
  
  // Validações de erro
  if (calculo.custoIngredientes <= 0) {
    erros.push('Custo de ingredientes deve ser maior que zero')
  }
  
  if (calculo.custoMaoDeObra <= 0) {
    erros.push('Custo de mão de obra deve ser maior que zero')
  }
  
  if (calculo.margemLucro < 0) {
    erros.push('Margem de lucro não pode ser negativa')
  }
  
  // Validações de aviso
  if (calculo.margemLucro < 0.20) {
    avisos.push('Margem de lucro muito baixa (menos de 20%)')
  }
  
  if (calculo.custoMaoDeObra > calculo.custoIngredientes * 2) {
    avisos.push('Custo de mão de obra muito alto comparado aos ingredientes')
  }
  
  if (calculo.margemLucro > 1.5) {
    avisos.push('Margem de lucro muito alta (mais de 150%) - pode afetar competitividade')
  }
  
  return {
    valido: erros.length === 0,
    erros,
    avisos
  }
}

// Utilitários para formatação
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

export function formatarPercentual(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(valor)
}

export function formatarQuantidade(quantidade: number, unidade: string): string {
  if (unidade === 'unidades') {
    return `${quantidade} un`
  }
  
  if (quantidade >= 1000 && unidade === 'g') {
    return `${(quantidade / 1000).toFixed(2)} kg`
  }
  
  if (quantidade >= 1000 && unidade === 'ml') {
    return `${(quantidade / 1000).toFixed(2)} L`
  }
  
  return `${quantidade} ${unidade}`
}