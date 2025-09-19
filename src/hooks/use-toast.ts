import { useState } from 'react'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastRef: ((props: ToastProps) => void) | null = null

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toastItem = { ...props, id }
    
    setToasts(prev => [...prev, toastItem])
    
    // Mostrar como alert temporariamente
    alert(`${props.title}: ${props.description}`)
    
    // Remover após 5 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }

  // Registrar a função toast globalmente na primeira vez
  if (!toastRef) {
    toastRef = toast
  }

  return { toast, toasts }
}

// Função global para usar em qualquer lugar
export const toast = (props: ToastProps) => {
  if (toastRef) {
    toastRef(props)
  } else {
    // Fallback para alert se não estiver inicializado
    alert(`${props.title}: ${props.description}`)
  }
}