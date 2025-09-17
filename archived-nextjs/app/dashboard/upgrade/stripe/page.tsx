'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CreditCard,
  Shield,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useToast } from '@/hooks/use-toast'

// Configurar Stripe (usando a chave pública do ambiente)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLIC_KEY || '')

function CheckoutForm() {
  const { profile } = useAuth()
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    // Criar Payment Intent quando o componente carregar
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2900, // R$ 29,00 em centavos
          currency: 'brl',
          description: 'Upgrade para DoceCalc PRO - Plano Mensal',
          customerName: profile?.nome,
          customerEmail: profile?.email || '',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar intenção de pagamento')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error)
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsLoading(true)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsLoading(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: profile?.nome || '',
            email: profile?.email || '',
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: "Pagamento Confirmado! 🎉",
          description: "Bem-vinda ao DoceCalc PRO! Redirecionando...",
        })

        // Atualizar perfil do usuário para PRO
        await fetch('/api/user/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            plan: 'pro',
          }),
        })

        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error: any) {
      toast({
        title: "Erro no Pagamento",
        description: error.message || "Não foi possível processar o pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mr-3" />
        <span className="text-gray-600">Preparando pagamento...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Informações do Cartão
        </label>
        <div className="border border-gray-300 rounded-md p-4 bg-white">
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
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 text-blue-800 mb-2">
          <Shield className="h-5 w-5" />
          <span className="font-medium text-sm">Pagamento 100% Seguro</span>
        </div>
        <p className="text-blue-700 text-xs">
          Seus dados são protegidos pela criptografia SSL e processados pelo Stripe, 
          a plataforma de pagamentos mais segura do mundo.
        </p>
      </div>

      {/* Payment Button */}
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        size="lg"
        variant="doce"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pagar R$ 29,00
          </>
        )}
      </Button>

      <div className="text-center text-xs text-gray-500">
        Ao confirmar o pagamento, você concorda com nossos{' '}
        <a href="/termos" className="text-primary hover:underline">
          Termos de Uso
        </a>
      </div>
    </form>
  )
}

export default function StripePaymentPage() {
  const { profile } = useAuth()
  const router = useRouter()

  const isPro = profile?.plano === 'pro'

  useEffect(() => {
    if (isPro) {
      router.push('/dashboard')
    }
  }, [isPro, router])

  if (isPro) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-doce rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Você já é PRO! 🎉</CardTitle>
            <CardDescription>
              Você já tem acesso a todas as funcionalidades premium do DoceCalc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant="doce" className="w-full">
                Voltar ao Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <p className="text-red-600">Erro na configuração do pagamento.</p>
            <Link href="/dashboard/upgrade">
              <Button variant="outline" className="mt-4">
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/upgrade">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamento por Cartão
            </Badge>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Finalize seu upgrade
            </h1>
            <p className="text-gray-600">
              Pague com cartão de crédito ou débito de forma segura
            </p>
          </div>
        </div>

        {/* Main Payment Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Upgrade para DoceCalc PRO
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os dados do seu cartão para concluir o upgrade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Resumo do Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">DoceCalc PRO - Mensal</span>
                  <span className="font-medium">R$ 29,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de processamento</span>
                  <span className="font-medium">R$ 0,00</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>R$ 29,00</span>
                </div>
              </div>
            </div>

            {/* Stripe Payment Form */}
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </CardContent>
        </Card>

        {/* Features Reminder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O que você ganha com o PRO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Receitas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Calculadora avançada</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Orçamentos em PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Relatórios detalhados</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Templates de receitas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Suporte prioritário</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Problemas com o pagamento?{' '}
            <a href="mailto:suporte@docecalc.com" className="text-primary hover:underline">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}