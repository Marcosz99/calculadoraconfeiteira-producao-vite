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
  const { user } = useAuth()
  const { toast } = useToast()
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [currentEbookId, setCurrentEbookId] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null)
  const [pixData, setPixData] = useState<any>(null)
  const [pixFormData, setPixFormData] = useState({
    name: '',
    cellphone: '',
    email: user?.email || '',
    taxId: ''
  })

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

  const handleSelectPaymentMethod = (ebookId: string) => {
    setCurrentEbookId(ebookId)
    setShowPaymentModal(true)
  }

  const handleBuyEbook = async (method: 'pix' | 'card') => {
    if (!currentEbookId) return
    
    try {
      setCheckoutLoading(currentEbookId)

      if (method === 'card') {
        const { data, error } = await supabase.functions.invoke('create-ebook-checkout', {
          body: { ebookId: currentEbookId },
        })

        if (error) throw error

        if (data.url) {
          window.open(data.url, '_blank')
          setCurrentSessionId(data.sessionId)
        }
      } else {
        // PIX - mostrar formulário
        setPaymentMethod('pix')
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

  const handleCreatePixPayment = async () => {
    if (!currentEbookId) return
    
    // Validar campos
    if (!pixFormData.name || !pixFormData.cellphone || !pixFormData.email || !pixFormData.taxId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para continuar',
        variant: 'destructive',
      })
      return
    }
    
    setCheckoutLoading(currentEbookId)
    
    try {
      const { data, error } = await supabase.functions.invoke('create-ebook-pix', {
        body: {
          ebookId: currentEbookId,
          customer: pixFormData
        }
      })
      
      if (error) throw error
      
      setPixData(data.data)
      toast({
        title: 'PIX gerado com sucesso!',
        description: 'Escaneie o QR Code para finalizar o pagamento',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar PIX',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCheckoutLoading(null)
    }
  }

  const handleVerifyPixPayment = async () => {
    if (!pixData?.id) return
    
    setVerifying(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('check-pix-status', {
        body: { pixId: pixData.id }
      })
      
      if (error) throw error
      
      if (data.data.status === 'PAID') {
        toast({
          title: 'Pagamento confirmado! 🎉',
          description: 'Seu ebook está pronto para download.',
        })
        
        // Download do ebook
        if (currentEbookId) {
          const { data: ebook } = await supabase
            .from('ebooks')
            .select('arquivo_url')
            .eq('id', currentEbookId)
            .single()
            
          if (ebook?.arquivo_url) {
            window.open(ebook.arquivo_url, '_blank')
          }
        }
        
        setShowPaymentModal(false)
        setPaymentMethod(null)
        setPixData(null)
        setCurrentEbookId(null)
      } else {
        toast({
          title: 'Pagamento ainda não confirmado',
          description: 'Por favor, aguarde e tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao verificar pagamento',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setVerifying(false)
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
                    onClick={() => handleSelectPaymentMethod(ebook.id)}
                    disabled={checkoutLoading === ebook.id}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Comprar
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

      {/* Payment Selection Modal */}
      {showPaymentModal && !paymentMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Escolha o método de pagamento</h3>
              <p className="text-muted-foreground">
                Selecione como deseja pagar pelo ebook
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleBuyEbook('pix')}
                disabled={checkoutLoading !== null}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                Pagar com PIX
                <span className="ml-2 bg-green-500 px-2 py-1 rounded text-xs">Instantâneo</span>
              </Button>

              <Button
                onClick={() => handleBuyEbook('card')}
                disabled={checkoutLoading !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/>
                  <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                </svg>
                Pagar com Cartão
              </Button>

              <Button
                onClick={() => {
                  setShowPaymentModal(false)
                  setCurrentEbookId(null)
                }}
                variant="outline"
                className="w-full"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* PIX Form Modal */}
      {showPaymentModal && paymentMethod === 'pix' && !pixData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-md w-full p-6 my-8">
            <div className="text-center mb-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Dados para PIX</h3>
              <p className="text-muted-foreground">
                Preencha seus dados para gerar o QR Code
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={pixFormData.name}
                  onChange={(e) => setPixFormData({...pixFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone/WhatsApp *</label>
                <input
                  type="text"
                  value={pixFormData.cellphone}
                  onChange={(e) => setPixFormData({...pixFormData, cellphone: e.target.value})}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">E-mail *</label>
                <input
                  type="email"
                  value={pixFormData.email}
                  onChange={(e) => setPixFormData({...pixFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CPF *</label>
                <input
                  type="text"
                  value={pixFormData.taxId}
                  onChange={(e) => setPixFormData({...pixFormData, taxId: e.target.value})}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCreatePixPayment}
                  disabled={checkoutLoading !== null}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gerando PIX...
                    </>
                  ) : (
                    'Gerar QR Code PIX'
                  )}
                </Button>

                <Button
                  onClick={() => {
                    setPaymentMethod(null)
                    setPixFormData({ name: '', cellphone: '', email: user?.email || '', taxId: '' })
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PIX QR Code Modal */}
      {showPaymentModal && paymentMethod === 'pix' && pixData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-md w-full p-6 my-8">
            <div className="text-center mb-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">PIX Gerado</h3>
              <p className="text-muted-foreground">
                Escaneie o QR Code ou copie a chave PIX
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {pixData.brCodeBase64 ? (
                <img 
                  src={pixData.brCodeBase64} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Chave PIX */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Ou copie a chave PIX:
              </label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={pixData.brCode || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm font-mono"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.brCode)
                    toast({ title: 'Chave PIX copiada!' })
                  }}
                  className="px-4"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"/>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyPixPayment}
                disabled={verifying}
                className="w-full bg-blue-600 hover:bg-blue-700"
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
                  setPaymentMethod(null)
                  setPixData(null)
                  setCurrentEbookId(null)
                }}
                variant="outline"
                className="w-full"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o app do seu banco</li>
                <li>2. Vá em PIX e escolha "Pagar com QR Code"</li>
                <li>3. Escaneie o código acima ou cole a chave PIX</li>
                <li>4. Confirme o pagamento</li>
                <li>5. Clique em "Já efetuei o pagamento"</li>
              </ol>
            </div>
          </Card>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPaymentModal && paymentMethod === 'card' && currentSessionId && (
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
                  setPaymentMethod(null)
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
