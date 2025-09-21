/**
 * Utilitários para lidar com campos numéricos
 * Resolve problemas com vírgulas que não viram ponto e zeros fixos
 */

/**
 * Normaliza entrada numérica: converte vírgulas para pontos
 * @param value - valor de entrada (pode ser string)
 * @returns string normalizada com pontos
 */
export const normalizeNumericInput = (value: string): string => {
  if (!value || value === '') return ''
  return value.replace(',', '.')
}

/**
 * Converte entrada de texto para número, permitindo campo vazio
 * @param value - valor do input
 * @returns número ou null se campo vazio/inválido
 */
export const parseNumericInput = (value: string): number | null => {
  if (!value || value.trim() === '') return null
  
  const normalized = normalizeNumericInput(value)
  const parsed = parseFloat(normalized)
  
  return isNaN(parsed) ? null : parsed
}

/**
 * Converte entrada de texto para número inteiro, permitindo campo vazio
 * @param value - valor do input
 * @returns número inteiro ou null se campo vazio/inválido
 */
export const parseIntegerInput = (value: string): number | null => {
  if (!value || value.trim() === '') return null
  
  const normalized = normalizeNumericInput(value)
  const parsed = parseInt(normalized)
  
  return isNaN(parsed) ? null : parsed
}

/**
 * Handler para mudanças em campos numéricos que permite campo vazio
 * @param setValue - função para atualizar o estado
 * @param field - nome do campo a ser atualizado
 * @param allowEmpty - se deve permitir valor null (padrão: true)
 * @returns função handler para o onChange
 */
export const createNumericChangeHandler = (
  setValue: (field: string, value: number | null) => void,
  field: string,
  allowEmpty: boolean = true
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseNumericInput(e.target.value)
    
    if (parsed === null && !allowEmpty) {
      setValue(field, 0)
    } else {
      setValue(field, parsed)
    }
  }
}

/**
 * Handler para mudanças em campos de números inteiros que permite campo vazio
 * @param setValue - função para atualizar o estado
 * @param field - nome do campo a ser atualizado
 * @param allowEmpty - se deve permitir valor null (padrão: true)
 * @returns função handler para o onChange
 */
export const createIntegerChangeHandler = (
  setValue: (field: string, value: number | null) => void,
  field: string,
  allowEmpty: boolean = true
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseIntegerInput(e.target.value)
    
    if (parsed === null && !allowEmpty) {
      setValue(field, 0)
    } else {
      setValue(field, parsed)
    }
  }
}

/**
 * Formata valor numérico para exibição no input
 * @param value - valor numérico ou null
 * @returns string formatada para o input
 */
export const formatForInput = (value: number | null): string => {
  if (value === null || value === undefined) return ''
  return value.toString()
}

/**
 * Valida entrada numérica aceitando vírgulas e pontos
 * @param value - valor a ser validado
 * @returns true se for um número válido
 */
export const isValidNumericInput = (value: string): boolean => {
  if (!value || value.trim() === '') return true // campo vazio é válido
  
  const normalized = normalizeNumericInput(value)
  return /^\d+([.,]\d+)?$/.test(value) && !isNaN(parseFloat(normalized))
}

/**
 * Validator para FormValidator que aceita vírgulas e permite campo vazio
 * @param value - valor a ser validado
 * @returns string de erro ou vazio se válido
 */
export const numericValidator = (value: string): string => {
  if (!value || value.trim() === '') return '' // campo vazio é válido
  
  if (!isValidNumericInput(value)) {
    return 'Digite apenas números (use vírgula ou ponto para decimais)'
  }
  
  return ''
}

/**
 * Validator para números positivos que aceita vírgulas e permite campo vazio
 * @param value - valor a ser validado
 * @returns string de erro ou vazio se válido
 */
export const positiveNumericValidator = (value: string): string => {
  if (!value || value.trim() === '') return '' // campo vazio é válido
  
  const basicValidation = numericValidator(value)
  if (basicValidation) return basicValidation
  
  const parsed = parseNumericInput(value)
  if (parsed !== null && parsed <= 0) {
    return 'Deve ser um número positivo'
  }
  
  return ''
}