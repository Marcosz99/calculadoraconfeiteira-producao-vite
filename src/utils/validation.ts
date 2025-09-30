import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email deve ter no máximo 255 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' }),
})

export const signupSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  nomeConfeitaria: z
    .string()
    .trim()
    .min(2, { message: 'Nome da confeitaria deve ter no mínimo 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email deve ter no máximo 255 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' }),
})

// Checkout validation schema
export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  customerEmail: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email deve ter no máximo 255 caracteres' }),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, { message: 'Telefone inválido (apenas números, 10-11 dígitos)' })
    .optional()
    .or(z.literal('')),
})

// Reset password validation
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email deve ter no máximo 255 caracteres' }),
})

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
