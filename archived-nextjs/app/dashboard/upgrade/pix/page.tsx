'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Copy, 
  CheckCircle, 
  Clock,
  Smartphone,
  QrCode
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function PixPaymentPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [pixData, setPixData] = useState<{
    qrCode: string
    pixKey: string
    paymentId: string
    amount: number
  } | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')

  const isPro = profile?.plano === 'pro'

  useEffect(() => {
    if (isPro) {
      router.push('/dashboard')
      return
    }

    // Criar pagamento PIX ao carregar a página
    createPixPayment()
  }, [isPro, router])

  const createPixPayment = async () => {
    setIsLoading(true)
    
    try {
      // Simular criação de pagamento PIX via AbacatePay
      // Na implementação real, isso seria uma chamada para a API
      const response = await fetch('/api/payments/pix/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 29.00,
          description: 'Upgrade para DoceCalc PRO - Plano Mensal',
          customerName: profile?.nome,
          customerEmail: profile?.email || '',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento PIX')
      }

      const data = await response.json()
      setPixData(data)
      
      // Simular verificação de status do pagamento
      checkPaymentStatus(data.paymentId)
      
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = (paymentId: string) => {
    // Simular verificação periódica do status
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/pix/status/${paymentId}`)
        const data = await response.json()
        
        if (data.status === 'completed') {
          setPaymentStatus('completed')
          clearInterval(interval)
          
          toast({
            title: "Pagamento Confirmado! 🎉",
            description: "Bem-vinda ao DoceCalc PRO! Redirecionando...",
          })
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }, 3000) // Verificar a cada 3 segundos

    // Limpar interval após 10 minutos
    setTimeout(() => {
      clearInterval(interval)
    }, 600000)
  }

  const copyPixKey = () => {
    if (pixData?.pixKey) {
      navigator.clipboard.writeText(pixData.pixKey)
      toast({
        title: "PIX Copiado!",
        description: "Código PIX copiado para a área de transferência",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Gerando seu PIX...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Pagamento Confirmado!</CardTitle>
            <CardDescription>
              Bem-vinda ao DoceCalc PRO! 🎉 Você agora tem acesso a todas as funcionalidades premium.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Redirecionando para o dashboard...
            </p>
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
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
              <Smartphone className="h-4 w-4 mr-2" />
              Pagamento PIX
            </Badge>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Finalize seu upgrade
            </h1>
            <p className="text-gray-600">
              Pague via PIX e tenha acesso imediato ao DoceCalc PRO
            </p>
          </div>
        </div>

        {/* PIX Payment Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <QrCode className="h-6 w-6 mx-auto mb-2" />
              Pagamento via PIX
            </CardTitle>
            <CardDescription className="text-center">
              Escaneie o QR Code ou copie o código PIX abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pixData ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                      <div className="absolute text-xs text-gray-500 mt-20">
                        QR Code PIX
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Abra seu app do banco e escaneie o código
                  </p>
                </div>

                {/* PIX Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ou copie o código PIX:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={pixData.pixKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    />
                    <Button onClick={copyPixKey} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-800">Valor:</span>
                    <span className="text-lg font-bold text-blue-900">R$ {pixData.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Plano:</span>
                    <span className="text-sm text-blue-700">DoceCalc PRO - Mensal</span>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <Clock className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">Aguardando pagamento...</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    O pagamento será confirmado automaticamente em alguns segundos
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Erro ao gerar PIX. Tente novamente.</p>
                <Button onClick={createPixPayment} className="mt-4">
                  Tentar Novamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como pagar com PIX</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  1
                </div>
                <p>Abra o app do seu banco ou carteira digital</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  2
                </div>
                <p>Escolha a opção "Pix" e depois "Ler QR Code" ou "Pix Copia e Cola"</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  3
                </div>
                <p>Escaneie o QR Code ou cole o código PIX</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  4
                </div>
                <p>Confirme o pagamento de R$ 29,00</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  ✓
                </div>
                <p>Pronto! Você será redirecionada automaticamente</p>
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