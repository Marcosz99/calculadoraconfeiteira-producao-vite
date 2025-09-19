import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Copy, CheckCircle, Loader, CreditCard, User, Phone, Mail, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { planos } from '@/data/planos'
import { supabase } from '@/integrations/supabase/client'

export const UpgradePixPage = () => {
  const { user, upgradeUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'form' | 'pending' | 'paid' | 'expired'>('form')
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.nome || '',
    cellphone: '',
    email: user?.email || '',
    taxId: ''
  })

  const planoProfessional = planos.find(p => p.id === 'professional')!

  const createPixPayment = async () => {
    setLoading(true)
    
    try {
      console.log('Creating PIX payment...')
      
      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: {
          amount: planoProfessional.preco_mensal,
          description: `Upgrade para Plano Professional - ${user?.email}`,
          customer: {
            name: formData.name,
            cellphone: formData.cellphone,
            email: formData.email,
            taxId: formData.taxId
          },
          metadata: {
            userId: user?.id,
            plano: 'professional'
          }
        }
      })
      
      if (error) {
        console.error('Error creating PIX:', error)
        alert('Erro ao criar pagamento PIX: ' + error.message)
        return
      }
      
      console.log('PIX created successfully:', data)
      setPaymentData(data.data)
      setPaymentStatus('pending')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao criar pagamento PIX')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!paymentData?.id) return
    
    setCheckingPayment(true)
    
    try {
      console.log('Checking payment status for:', paymentData.id)
      
      const { data, error } = await supabase.functions.invoke('check-pix-status', {
        body: { pixId: paymentData.id }
      })
      
      if (error) {
        console.error('Error checking payment:', error)
        alert('Erro ao verificar pagamento: ' + error.message)
        return
      }
      
      console.log('Payment status:', data)
      
      if (data.data.status === 'PAID') {
        setPaymentStatus('paid')
        
        // Atualizar plano do usuário
        if (upgradeUser) {
          upgradeUser('professional')
        }
        
        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      } else if (data.data.status === 'EXPIRED') {
        setPaymentStatus('expired')
      }
      
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao verificar pagamento')
    } finally {
      setCheckingPayment(false)
    }
  }

  const copyPixKey = () => {
    if (paymentData?.brCode) {
      navigator.clipboard.writeText(paymentData.brCode)
      alert('Chave PIX copiada!')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obrigatórios
    if (!formData.name || !formData.cellphone || !formData.email || !formData.taxId) {
      alert('Todos os campos são obrigatórios')
      return
    }
    
    createPixPayment()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Formatador de CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Formatador de telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  if (paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu plano Professional foi ativado com sucesso. 
            Você será redirecionado para o dashboard.
          </p>
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/upgrade"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pagamento via PIX
            </h1>
            <p className="text-gray-600">
              {paymentStatus === 'form' ? 'Complete seus dados para continuar' : 'Escaneie o QR Code ou copie a chave PIX'}
            </p>
          </div>
        </div>

        {paymentStatus === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Plano Professional
              </h2>
              <div className="text-3xl font-bold text-green-600">
                R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone/WhatsApp *
                </label>
                <input
                  type="text"
                  value={formData.cellphone}
                  onChange={(e) => handleInputChange('cellphone', formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <QrCode className="w-5 h-5" />
                )}
                {loading ? 'Gerando PIX...' : 'Gerar QR Code PIX'}
              </button>
            </form>
          </div>
        )}

        {paymentStatus === 'pending' && paymentData && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                PIX Gerado com Sucesso
              </h2>
              <div className="text-3xl font-bold text-green-600">
                R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {paymentData.brCodeBase64 ? (
                <img 
                  src={paymentData.brCodeBase64} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              )}
              <p className="text-center text-sm text-gray-600 mt-4">
                Escaneie este QR Code no seu banco ou app de pagamento
              </p>
            </div>

            {/* Chave PIX */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou copie a chave PIX:
              </label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={paymentData.brCode || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={copyPixKey}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={checkPaymentStatus}
                disabled={checkingPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {checkingPayment ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {checkingPayment ? 'Verificando...' : 'Já efetuei o pagamento'}
              </button>

              {/* Status */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    Aguardando pagamento...
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Expira em: {new Date(paymentData.expiresAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-blue-900 mb-2">Como pagar:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o app do seu banco</li>
                <li>2. Vá em PIX e escolha "Pagar com QR Code"</li>
                <li>3. Escaneie o código acima ou cole a chave PIX</li>
                <li>4. Confirme o pagamento de R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}</li>
                <li>5. Clique em "Já efetuei o pagamento" para verificar</li>
              </ol>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Problemas com o pagamento? 
            <a href="#" className="text-purple-600 hover:underline ml-1">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}