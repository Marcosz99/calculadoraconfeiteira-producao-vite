/**
 * Hook para formatação de valores monetários em Real brasileiro
 * Resolve problemas com campos monetários como formatação R$, validação e conversão
 */

import { useCallback } from 'react'

export const useFormatCurrency = () => {
  /**
   * Formata valor numérico para formato de moeda brasileira
   * @param value - valor numérico
   * @returns string formatada (ex: "R$ 123,45")
   */
  const formatToCurrency = useCallback((value: number | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'R$ 0,00'
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }, [])

  /**
   * Converte string monetária formatada para número
   * @param currencyString - string formatada (ex: "R$ 123,45" ou "123,45")
   * @returns número correspondente (ex: 123.45)
   */
  const parseCurrency = useCallback((currencyString: string): number => {
    if (!currencyString || currencyString.trim() === '') {
      return 0
    }
    
    // Remove símbolos de moeda, espaços e pontos de milhares
    const cleanString = currencyString
      .replace(/R\$\s?/g, '')
      .replace(/\./g, '') // Remove pontos de milhares
      .replace(',', '.') // Converte vírgula decimal para ponto
      .trim()
    
    const parsed = parseFloat(cleanString)
    return isNaN(parsed) ? 0 : parsed
  }, [])

  /**
   * Formata valor para exibição em input (apenas números com vírgula)
   * @param value - valor numérico
   * @returns string formatada para input (ex: "123,45")
   */
  const formatForInput = useCallback((value: number | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return ''
    }
    
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [])

  /**
   * Aplica máscara monetária enquanto o usuário digita
   * @param value - valor atual do input
   * @returns valor formatado com máscara
   */
  const applyCurrencyMask = useCallback((value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para centavos e depois para reais
    const cents = parseInt(numbers)
    const reais = cents / 100
    
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [])

  /**
   * Valida se uma string representa um valor monetário válido
   * @param value - string a ser validada
   * @returns true se válido, false caso contrário
   */
  const isValidCurrency = useCallback((value: string): boolean => {
    if (!value || value.trim() === '') return true // campo vazio é válido
    
    // Permite formatos como: 123,45 | 1.234,56 | R$ 123,45
    const currencyRegex = /^(R\$\s?)?(\d{1,3}(\.\d{3})*|\d+)(,\d{0,2})?$/
    return currencyRegex.test(value.trim())
  }, [])

  /**
   * Validator para uso com formulários
   * @param value - valor a ser validado
   * @returns string de erro ou vazio se válido
   */
  const currencyValidator = useCallback((value: string): string => {
    if (!value || value.trim() === '') return '' // campo vazio é válido
    
    if (!isValidCurrency(value)) {
      return 'Digite um valor monetário válido (ex: 123,45)'
    }
    
    const numericValue = parseCurrency(value)
    if (numericValue < 0) {
      return 'Valor deve ser positivo'
    }
    
    return ''
  }, [isValidCurrency, parseCurrency])

  return {
    formatToCurrency,
    parseCurrency,
    formatForInput,
    applyCurrencyMask,
    isValidCurrency,
    currencyValidator,
  }
}