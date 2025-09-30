import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useToast } from '../hooks/use-toast'
import { CreditCard, ArrowLeft, Shield, Check, Star } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { checkoutSchema } from '../utils/validation'
import { z } from 'zod'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

interface CheckoutFormProps {
  onSuccess: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerPhone, setCustomerPhone] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      // Validate input before submission
      const validated = checkoutSchema.parse({
        customerName,
        customerEmail,
        customerPhone: customerPhone || ''
      })

      // Criar checkout session usando edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userEmail: validated.customerEmail,
          userName: validated.customerName
        }
      })

      if (error) throw error

      if (data.url) {
        // Redirecionar para checkout do Stripe
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout não recebida')
      }

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro no pagamento",
          description: error.message || "Tente novamente em alguns segundos",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <Input
            type="text"
            value={customerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
            placeholder="Seu nome completo"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={customerEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp/Telefone
          </label>
          <Input
            type="tel"
            value={customerPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dados do Cartão
          </label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processando...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Confirmar Assinatura - R$ 19,90/mês
          </div>
        )}
      </Button>
    </form>
  )
}

export default function CheckoutStripePage() {
  const navigate = useNavigate()
  const { user, profile, checkSubscription } = useAuth()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkExistingSubscription = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      // Verificar se já tem assinatura ativa
      if (profile?.plano === 'professional') {
        navigate('/dashboard')
        return
      }

      setChecking(false)
    }

    checkExistingSubscription()
  }, [user, profile, navigate])

  const handleSuccess = async () => {
    // Recarregar dados de assinatura
    await checkSubscription()
    navigate('/dashboard')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando assinatura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DoceCalc Professional
          </h1>
          <p className="text-gray-600">
            Todas as funcionalidades para profissionalizar sua confeitaria
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plano Professional */}
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary fill-current" />
                <CardTitle className="text-xl text-primary">
                  Plano Professional
                </CardTitle>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                R$ 19,90
                <span className="text-base font-normal text-gray-600">/mês</span>
              </div>
              <CardDescription className="text-primary font-medium">
                💳 Cobrança imediata • Compromisso de 12 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">✨ Receitas ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">🧮 Calculadora avançada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">🤖 100 créditos DoceBot IA/mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">💰 Gestão financeira completa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">📊 Relatórios avançados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">🛒 Catálogo personalizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">👥 Gestão completa de clientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">☁️ Backup automático</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">🎯 Suporte prioritário</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center">
                  💳 Pagamento seguro via Stripe • 🔒 Dados protegidos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Pagamento Seguro
              </CardTitle>
              <CardDescription>
                Seus dados estão protegidos com criptografia de ponta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm onSuccess={handleSuccess} />
              </Elements>

              <div className="mt-6 text-center space-y-2">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    SSL Seguro
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Stripe
                  </div>
                </div>
                
                <p className="text-xs text-gray-400">
                  Ao confirmar, você concorda com nossos termos de uso.
                  <br />Assinatura de R$19,90/mês com compromisso de 12 meses.
                  <br />Cancelamento antecipado sujeito à multa proporcional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações adicionais */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dúvidas sobre o pagamento?
          </h3>
          <p className="text-gray-600 mb-4">
            Nossa equipe está aqui para ajudar você a começar
          </p>
          <div className="text-center">
            <p className="text-gray-600 mb-2">💬 Suporte via WhatsApp:</p>
            <p className="text-lg font-semibold text-primary">(15) 99704-1319</p>
          </div>
        </div>
      </div>
    </div>
  )
}