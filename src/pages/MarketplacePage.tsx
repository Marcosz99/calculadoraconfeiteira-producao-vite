import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Download, Check, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Ebook {
  id: string
  titulo: string
  autor: string
  categoria: string | null
  descricao: string | null
  preco: number
  capa_url: string | null
  arquivo_url: string | null
  tags: string[] | null
  stripe_product_id: string | null
  stripe_price_id: string | null
}

export default function MarketplacePage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [currentEbookId, setCurrentEbookId] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchEbooks()
  }, [])

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEbooks(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar ebooks:', error)
      toast({
        title: 'Erro ao carregar ebooks',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBuyEbook = async (ebookId: string) => {
    try {
      setCheckoutLoading(ebookId)

      const { data, error } = await supabase.functions.invoke('create-ebook-checkout', {
        body: { ebookId },
      })

      if (error) throw error

      if (data.url) {
        // Abrir checkout em nova aba
        window.open(data.url, '_blank')
        
        // Salvar session ID para verificação
        setCurrentSessionId(data.sessionId)
        setCurrentEbookId(ebookId)
        setShowPaymentModal(true)
      }
    } catch (error: any) {
      console.error('Erro ao criar checkout:', error)
      toast({
        title: 'Erro ao iniciar compra',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCheckoutLoading(null)
    }
  }

  const handleVerifyPayment = async () => {
    if (!currentSessionId || !currentEbookId) return

    try {
      setVerifying(true)

      const { data, error } = await supabase.functions.invoke('verify-ebook-payment', {
        body: {
          sessionId: currentSessionId,
          ebookId: currentEbookId,
        },
      })

      if (error) throw error

      if (data.paid) {
        toast({
          title: 'Pagamento confirmado! 🎉',
          description: 'Seu ebook está pronto para download.',
        })

        // Enviar e-mail com link de download
        if (user?.email && data.downloadUrl) {
          await supabase.functions.invoke('send-ebook-email', {
            body: {
              email: user.email,
              ebookId: currentEbookId,
              downloadUrl: data.downloadUrl,
            },
          })
        }

        // Fazer download automático
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank')
        }

        setShowPaymentModal(false)
        setCurrentSessionId(null)
        setCurrentEbookId(null)
      } else {
        toast({
          title: 'Pagamento ainda não confirmado',
          description: 'Por favor, aguarde alguns instantes e tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Erro ao verificar pagamento:', error)
      toast({
        title: 'Erro ao verificar pagamento',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Marketplace 🛒
            </h1>
            <p className="text-muted-foreground">
              E-books e materiais exclusivos para confeiteiros
            </p>
          </div>
        </div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-pink-500 opacity-50" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{ebook.titulo}</h3>
                <p className="text-sm text-muted-foreground mb-2">por {ebook.autor}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {ebook.descricao}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {ebook.tags?.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-accent text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {ebook.preco.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Pagamento único</p>
                  </div>
                  
                  <Button
                    onClick={() => handleBuyEbook(ebook.id)}
                    disabled={checkoutLoading === ebook.id}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {checkoutLoading === ebook.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Carregando...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {ebooks.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Nenhum produto disponível</h3>
            <p className="text-muted-foreground">
              Novos produtos serão adicionados em breve!
            </p>
          </div>
        )}
      </div>

      {/* Payment Verification Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Finalize seu pagamento</h3>
              <p className="text-muted-foreground">
                Uma nova aba foi aberta com o checkout. Após completar o pagamento, clique no botão abaixo.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyPayment}
                disabled={verifying}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                size="lg"
              >
                {verifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Já efetuei o pagamento
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowPaymentModal(false)
                  setCurrentSessionId(null)
                  setCurrentEbookId(null)
                }}
                variant="outline"
                className="w-full"
                disabled={verifying}
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Após a confirmação do pagamento, você receberá o ebook por e-mail e poderá fazer o download imediatamente.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
