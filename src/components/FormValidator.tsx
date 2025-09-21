import React from 'react'
import { AlertCircle } from 'lucide-react'

interface FormValidatorProps {
  errors: { [key: string]: string }
  touched: { [key: string]: boolean }
  field: string
  className?: string
}

export const FormValidator: React.FC<FormValidatorProps> = ({ 
  errors, 
  touched, 
  field, 
  className = "" 
}) => {
  const hasError = errors[field] && touched[field]
  
  if (!hasError) return null
  
  return (
    <div className={`flex items-center space-x-1 text-red-600 text-sm mt-1 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <span>{errors[field]}</span>
    </div>
  )
}

// Validation helpers
export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Este campo é obrigatório'
    }
    return ''
  },
  
  email: (value: string) => {
    if (!value) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? '' : 'Email inválido'
  },
  
  phone: (value: string) => {
    if (!value) return ''
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    return phoneRegex.test(value) ? '' : 'Formato: (11) 99999-9999'
  },
  
  cpf: (value: string) => {
    if (!value) return ''
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!cpfRegex.test(value)) return 'Formato: 000.000.000-00'
    
    // Validação matemática do CPF
    const cleanCpf = value.replace(/\D/g, '')
    if (cleanCpf.length !== 11) return 'CPF deve ter 11 dígitos'
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCpf)) return 'CPF inválido'
    
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cleanCpf[i]) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    if (resto >= 10) resto = 0
    if (resto !== parseInt(cleanCpf[9])) return 'CPF inválido'
    
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cleanCpf[i]) * (11 - i)
    }
    resto = 11 - (soma % 11)
    if (resto >= 10) resto = 0
    if (resto !== parseInt(cleanCpf[10])) return 'CPF inválido'
    
    return ''
  },
  
  minLength: (min: number) => (value: string) => {
    if (!value) return ''
    return value.length >= min ? '' : `Mínimo ${min} caracteres`
  },
  
  maxLength: (max: number) => (value: string) => {
    if (!value) return ''
    return value.length <= max ? '' : `Máximo ${max} caracteres`
  },
  
  number: (value: string) => {
    if (!value || value.trim() === '') return ''
    const normalized = value.replace(',', '.')
    return /^\d+([.,]\d+)?$/.test(value) && !isNaN(parseFloat(normalized)) ? '' : 'Digite apenas números (use vírgula ou ponto para decimais)'
  },
  
  positiveNumber: (value: string) => {
    if (!value || value.trim() === '') return ''
    const normalized = value.replace(',', '.')
    if (!/^\d+([.,]\d+)?$/.test(value) || isNaN(parseFloat(normalized))) {
      return 'Digite apenas números (use vírgula ou ponto para decimais)'
    }
    const num = parseFloat(normalized)
    return num > 0 ? '' : 'Deve ser um número positivo'
  }
}

// Hook para gerenciar validação de formulários
export const useFormValidation = (initialValues: any, validationRules: any) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({})
  
  const validateField = (field: string, value: any) => {
    const rules = validationRules[field]
    if (!rules) return ''
    
    if (Array.isArray(rules)) {
      for (const rule of rules) {
        const error = rule(value)
        if (error) return error
      }
    } else {
      return rules(value)
    }
    
    return ''
  }
  
  const handleChange = (field: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev: any) => ({ ...prev, [field]: error }))
    }
  }
  
  const handleBlur = (field: string) => {
    setTouched((prev: any) => ({ ...prev, [field]: true }))
    const error = validateField(field, values[field])
    setErrors((prev: any) => ({ ...prev, [field]: error }))
  }
  
  const validateAll = () => {
    const newErrors: { [key: string]: string } = {}
    const newTouched: { [key: string]: boolean } = {}
    
    Object.keys(validationRules).forEach(field => {
      newTouched[field] = true
      newErrors[field] = validateField(field, values[field])
    })
    
    setTouched(newTouched)
    setErrors(newErrors)
    
    return Object.values(newErrors).every(error => !error)
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.values(errors).every(error => !error) && Object.keys(touched).length > 0
  }
}