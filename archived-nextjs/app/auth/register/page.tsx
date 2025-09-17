'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/local-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Cake, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { isValidEmail } from '@/lib/utils'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.nome.trim()) {
      alert("Por favor, insira seu nome.")
      return
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      alert("Por favor, insira um email válido.")
      return
    }

    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem. Por favor, confirme sua senha corretamente.")
      return
    }

    setIsLoading(true)
    
    try {
      await signUp(formData.email, formData.password, formData.nome)
      // Sucesso - usuário receberá email de confirmação
    } catch (error) {
      // Erro já tratado no AuthProvider
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' }
    if (password.length < 6) return { strength: 1, label: 'Muito fraca' }
    if (password.length < 8) return { strength: 2, label: 'Fraca' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: 'Forte' }
    }
    return { strength: 3, label: 'Média' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
            <Cake className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-gray-900">DoceCalc</span>
          </Link>
          <p className="text-gray-600 text-sm sm:text-base">Crie sua conta gratuita</p>
        </div>

        <Card className="auth-card shadow-lg">
          <CardHeader className="text-center px-6 pt-8 pb-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">Bem-vinda ao DoceCalc! 🎉</CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">
              Comece grátis e transforme sua confeitaria em um negócio lucrativo
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input-focus h-11 text-base"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input-focus h-11 text-base"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-focus pr-11 h-11 text-base"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Indicador de força da senha melhorado */}
                {formData.password && (
                  <div className="space-y-2 mt-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`password-strength-bar ${
                            level <= passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? 'bg-red-500'
                                : passwordStrength.strength === 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${
                        passwordStrength.strength <= 2
                          ? 'text-red-600'
                          : passwordStrength.strength === 3
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                        Força: {passwordStrength.label}
                      </p>
                      {passwordStrength.strength >= 3 && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-focus pr-11 h-11 text-base"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Senhas coincidem</span>
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-red-500 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-red-600 font-medium">Senhas não coincidem</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium mt-6" 
                variant="doce"
                disabled={isLoading || !formData.nome.trim() || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta gratuita'
                )}
              </Button>
            </form>

            {/* Benefícios do cadastro */}
            <div className="mt-6 p-4 bg-green-50/80 rounded-xl border border-green-200/60">
              <h4 className="font-semibold text-green-800 mb-3 text-sm">✨ Seu plano gratuito inclui:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                  <span className="text-xs text-green-700">3 receitas cadastradas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                  <span className="text-xs text-green-700">Calculadora de preços</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                  <span className="text-xs text-green-700">Base de ingredientes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                  <span className="text-xs text-green-700">Suporte por email</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors">
                  Faça login
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link href="/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Voltar para home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-primary transition-colors text-sm inline-flex items-center">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
