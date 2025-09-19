import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { planos } from '@/data/planos'

export const UpgradeStripePage = () => {
  const { user, upgradeUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'form' | 'processing' | 'success'>('form')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const planoProfessional = planos.find(p => p.id === 'professional')!

  const handleCardDataChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPaymentStatus('processing')

    // Simular processamento do cartão
    setTimeout(() => {
      // Simular sucesso
      setPaymentStatus('success')
      
      // Atualizar plano do usuário
      if (upgradeUser) {
        upgradeUser('professional')
      }
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    }, 3000)
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Aprovado!
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
              Pagamento com Cartão
            </h1>
            <p className="text-gray-600">
              Finalize sua assinatura do plano Professional
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Dados do Cartão
              </h2>
            </div>

            {paymentStatus === 'processing' ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processando pagamento...
                </h3>
                <p className="text-gray-600">
                  Aguarde enquanto confirmamos seu cartão
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => handleCardDataChange('number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => handleCardDataChange('expiry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => handleCardDataChange('cvc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="Seu Nome Completo"
                    value={cardData.name}
                    onChange={(e) => handleCardDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Processando...' : `Pagar R$ ${planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}`}
                </button>
              </form>
            )}

            <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro e criptografado</span>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plano Professional</span>
                <span className="font-medium">
                  R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}/mês</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900">
                Você terá acesso a:
              </h3>
              {planoProfessional.funcionalidades.slice(0, 6).map((func, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{func}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Garantia:</strong> Cancele a qualquer momento. 
                Sem fidelidade ou taxas extras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}