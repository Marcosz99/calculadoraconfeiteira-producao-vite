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
            disabled
            className="w-full bg-gray-400 text-gray-600 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
            title="PIX temporariamente indisponível"
          >
            <QrCode className="w-5 h-5" />
            PIX (Em breve)
            <span className="bg-gray-300 px-2 py-1 rounded text-xs ml-2">Indisponível</span>
          </button>
          
          <button
            onClick={() => handleUpgrade('card')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg animate-pulse border-2 border-yellow-400"
          >
            <CreditCard className="w-5 h-5" />
            💳 Assinar por R$ 19,90/mês
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs ml-2 font-bold">7 dias grátis!</span>
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