import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Copy, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { planos } from '@/data/planos'

export const UpgradePixPage = () => {
  const { user, upgradeUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending')

  const planoProfessional = planos.find(p => p.id === 'professional')!

  useEffect(() => {
    // Simular criação do PIX
    const createPixPayment = async () => {
      setLoading(true)
      
      // Simular delay da API
      setTimeout(() => {
        const mockPixData = {
          pixKey: '00020126580014br.gov.bcb.pix013633f9c4b4-8e5c-4a5a-9e6d-123456789abc5204000053039865802BR5925DoceCalc Confeitaria6009SAO_PAULO61080100000062070503***6304A1B2',
          qrCode: 'data:image/png;base64,iVBORw0KG...',
          amount: planoProfessional.preco_mensal,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutos
        }
        
        setPaymentData(mockPixData)
        setLoading(false)
        
        // Simular verificação de pagamento
        checkPaymentStatus()
      }, 2000)
    }
    
    createPixPayment()
  }, [])

  const checkPaymentStatus = () => {
    // Simular verificação de pagamento (em produção seria uma chamada real à API)
    const interval = setInterval(() => {
      // Simular pagamento aprovado após 30 segundos (para demonstração)
      const randomSuccess = Math.random() > 0.8
      
      if (randomSuccess) {
        setPaymentStatus('paid')
        clearInterval(interval)
        
        // Atualizar plano do usuário
        if (upgradeUser) {
          upgradeUser('professional')
        }
        
        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      }
    }, 5000)
    
    // Limpar interval após 15 minutos
    setTimeout(() => {
      clearInterval(interval)
      if (paymentStatus === 'pending') {
        setPaymentStatus('expired')
      }
    }, 15 * 60 * 1000)
  }

  const copyPixKey = () => {
    if (paymentData?.pixKey) {
      navigator.clipboard.writeText(paymentData.pixKey)
      alert('Chave PIX copiada!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Preparando seu pagamento PIX...
          </h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </div>
    )
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
              Escaneie o QR Code ou copie a chave PIX
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Plano Professional
            </h2>
            <div className="text-3xl font-bold text-green-600">
              R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
            <p className="text-center text-sm text-gray-600">
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
                value={paymentData?.pixKey || ''}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={copyPixKey}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Como pagar:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Abra o app do seu banco</li>
              <li>2. Vá em PIX e escolha "Pagar com QR Code"</li>
              <li>3. Escaneie o código acima ou cole a chave PIX</li>
              <li>4. Confirme o pagamento de R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}</li>
              <li>5. Seu plano será ativado automaticamente</li>
            </ol>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Aguardando pagamento...
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              O status será atualizado automaticamente após o pagamento
            </p>
          </div>
        </div>

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