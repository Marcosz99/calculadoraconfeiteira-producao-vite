import { X, Crown, CreditCard, QrCode } from 'lucide-react'
import { planos } from '@/data/planos'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  onUpgrade: (method: 'pix' | 'card') => void
}

export const UpgradeModal = ({ isOpen, onClose, feature, onUpgrade }: UpgradeModalProps) => {
  if (!isOpen) return null
  
  const planoProfessional = planos.find(p => p.id === 'professional')!
  
  const handleUpgrade = (method: 'pix' | 'card') => {
    onUpgrade(method)
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Upgrade para continuar
          </h2>
          <p className="text-gray-600">
            Você atingiu o limite do plano gratuito para <strong>{feature}</strong>.
            Faça upgrade para o plano Professional e tenha acesso ilimitado.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Plano Professional</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-sm text-gray-600">/mês</div>
            </div>
          </div>
          <div className="space-y-1">
            {planoProfessional.funcionalidades.slice(0, 4).map((func, index) => (
              <div key={index} className="text-sm text-gray-700 flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                {func}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-center mb-4">
            Escolha sua forma de pagamento:
          </h4>
          
          <button
            onClick={() => handleUpgrade('pix')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode className="w-5 h-5" />
            Pagar com PIX
            <span className="bg-green-500 px-2 py-1 rounded text-xs ml-2">Instantâneo</span>
          </button>
          
          <button
            onClick={() => handleUpgrade('card')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Pagar com Cartão
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Cancele a qualquer momento. Sem fidelidade.
          </p>
        </div>
      </div>
    </div>
  )
}