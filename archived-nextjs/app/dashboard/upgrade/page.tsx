'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Crown, 
  CreditCard, 
  Smartphone, 
  Zap,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpgradePage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'card'>('pix')

  const isPro = profile?.plano === 'pro'

  if (isPro) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-doce rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
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
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleUpgrade = async (method: 'pix' | 'card') => {
    setIsLoading(true)
    
    try {
      if (method === 'pix') {
        // Redirecionar para página de pagamento PIX (AbacatePay)
        router.push('/dashboard/upgrade/pix')
      } else {
        // Redirecionar para página de pagamento Stripe
        router.push('/dashboard/upgrade/stripe')
      }
    } catch (error) {
      console.error('Erro no upgrade:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const proFeatures = [
    'Receitas ilimitadas',
    'Calculadora avançada com economia de escala',
    'Orçamentos profissionais em PDF',
    'Relatórios detalhados de lucratividade',
    'Templates de receitas prontos',
    'Análise de custos por categoria',
    'Suporte prioritário',
    'Atualizações de preços automáticas'
  ]

  return (
    <div className="min-h-screen bg-gradient-soft py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Upgrade Disponível 🚀
          </Badge>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Desbloqueie todo o potencial do 
            <span className="text-transparent bg-gradient-doce bg-clip-text"> DoceCalc</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforme sua confeitaria em um negócio realmente lucrativo com nosso plano profissional
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Plano Atual */}
          <Card className="relative">
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-xl mb-2">Plano Atual - Gratuito</CardTitle>
                <div className="text-3xl font-bold text-gray-600">R$ 0</div>
                <p className="text-gray-500">Funcionalidades básicas</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  Até 3 receitas
                </li>
                <li className="flex items-center text-gray-400 line-through">
                  <Crown className="h-4 w-4 text-gray-300 mr-3" />
                  Receitas ilimitadas
                </li>
                <li className="flex items-center text-gray-400 line-through">
                  <Crown className="h-4 w-4 text-gray-300 mr-3" />
                  Orçamentos profissionais
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Plano PRO */}
          <Card className="relative border-primary bg-gradient-to-b from-primary/5 to-transparent">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-doce text-white">Recomendado 🔥</Badge>
            </div>
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-xl mb-2 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-primary mr-2" />
                  Plano Profissional
                </CardTitle>
                <div className="text-4xl font-bold text-primary">R$ 29</div>
                <p className="text-gray-600">por mês</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Métodos de Pagamento */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Escolha como pagar 💳
            </CardTitle>
            <CardDescription className="text-center">
              Oferecemos as melhores opções de pagamento para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPayment} onValueChange={(value) => setSelectedPayment(value as 'pix' | 'card')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pix" className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  PIX
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cartão
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pix" className="mt-6">
                <div className="text-center space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">PIX Instantâneo</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Pagamento processado na hora, acesso imediato às funcionalidades PRO
                    </p>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900">
                    R$ 29,00
                  </div>
                  
                  <Button 
                    onClick={() => handleUpgrade('pix')} 
                    disabled={isLoading}
                    size="lg" 
                    variant="doce" 
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Smartphone className="h-5 w-5 mr-2" />
                    )}
                    Pagar com PIX
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="mt-6">
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-800">Pagamento Seguro</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Processado pelo Stripe, a plataforma mais segura do mundo
                    </p>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900">
                    R$ 29,00
                  </div>
                  
                  <Button 
                    onClick={() => handleUpgrade('card')} 
                    disabled={isLoading}
                    size="lg" 
                    variant="doce" 
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <CreditCard className="h-5 w-5 mr-2" />
                    )}
                    Pagar com Cartão
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Acesso imediato
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Cancele quando quiser
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Suporte 24/7
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Depoimentos */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            O que dizem nossas usuárias PRO 💬
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  "Depois do upgrade, meu lucro aumentou 150%! Os relatórios me mostraram onde eu estava perdendo dinheiro."
                </p>
                <p className="font-semibold">Marina Santos</p>
                <p className="text-xs text-gray-500">Docinhos da Mari</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  "Os orçamentos em PDF impressionam os clientes. Consegui fechar 40% mais vendas!"
                </p>
                <p className="font-semibold">Julia Oliveira</p>
                <p className="text-xs text-gray-500">Confeitaria Ju</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  "Agora sei exatamente quanto cobrar em cada receita. Nunca mais vendo no prejuízo!"
                </p>
                <p className="font-semibold">Carla Silva</p>
                <p className="text-xs text-gray-500">Doces da Carla</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}