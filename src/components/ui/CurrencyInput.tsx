/**
 * Componente de input monetário com formatação automática para Real brasileiro
 * Resolve problemas de campos com "0" fixo, formatação R$ e validação
 */

import React, { useState, useEffect, forwardRef } from 'react'
import { useFormatCurrency } from '../../hooks/useFormatCurrency'

interface CurrencyInputProps {
  value?: number | null
  onChange?: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  'data-testid'?: string
  autoFocus?: boolean
  onBlur?: () => void
  onFocus?: () => void
  allowEmpty?: boolean
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(({
  value,
  onChange,
  placeholder = "R$ 0,00",
  disabled = false,
  className = "",
  id,
  name,
  'data-testid': dataTestId,
  autoFocus,
  onBlur,
  onFocus,
  allowEmpty = true,
  ...props
}, ref) => {
  const { applyCurrencyMask, parseCurrency, formatForInput } = useFormatCurrency()
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Sincroniza o valor exibido com o valor prop
  useEffect(() => {
    if (!isFocused) {
      if (value === null || value === undefined) {
        setDisplayValue('')
      } else {
        setDisplayValue(formatForInput(value))
      }
    }
  }, [value, formatForInput, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Se o campo está sendo limpo
    if (inputValue === '') {
      setDisplayValue('')
      if (onChange) {
        onChange(allowEmpty ? null : 0)
      }
      return
    }

    // Aplica a máscara monetária
    const maskedValue = applyCurrencyMask(inputValue)
    setDisplayValue(maskedValue)
    
    // Converte para número e notifica mudança
    if (onChange) {
      const numericValue = parseCurrency(maskedValue)
      onChange(numericValue)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (onFocus) {
      onFocus()
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    
    // Se o campo está vazio no blur, mantém vazio se allowEmpty for true
    if (displayValue === '' && allowEmpty) {
      if (onChange) {
        onChange(null)
      }
    } else if (displayValue === '' && !allowEmpty) {
      setDisplayValue('0,00')
      if (onChange) {
        onChange(0)
      }
    }
    
    if (onBlur) {
      onBlur()
    }
  }

  // Classes padrão do input similar aos outros inputs da aplicação
  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    text-right
    ${className}
  `.trim()

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        autoComplete="off"
        inputMode="numeric"
        data-testid={dataTestId}
        autoFocus={autoFocus}
        {...props}
      />
      {!displayValue && !isFocused && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          R$
        </div>
      )}
    </div>
  )
})

CurrencyInput.displayName = 'CurrencyInput'

export default CurrencyInput