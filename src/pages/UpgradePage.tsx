import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Star, Zap, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { planos } from '../data/planos'

export default function UpgradePage() {
  const { user, upgradeUser } = useAuth()

  const handleUpgrade = (planoId: string) => {
    if (user) {
      upgradeUser(planoId as any)
      alert(`Plano ${planos.find(p => p.id === planoId)?.nome} ativado com sucesso!`)
    }
  }

  const getPlanoIcon = (planoId: string) => {
    switch (planoId) {
      case 'free': return <Check className="h-8 w-8" />
      case 'professional': return <Star className="h-8 w-8" />
      case 'premium': return <Zap className="h-8 w-8" />
      case 'master': return <Crown className="h-8 w-8" />
      default: return <Check className="h-8 w-8" />
    }
  }

  const getPlanoColor = (planoId: string) => {
    switch (planoId) {
      case 'free': return 'border-gray-200 bg-white'
      case 'professional': return 'border-blue-200 bg-blue-50'
      case 'premium': return 'border-purple-200 bg-purple-50'
      case 'master': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-gray-200 bg-white'
    }
  }

  const getPlanoButtonColor = (planoId: string) => {
    switch (planoId) {
      case 'free': return 'bg-gray-500 hover:bg-gray-600'
      case 'professional': return 'bg-blue-500 hover:bg-blue-600'
      case 'premium': return 'bg-purple-500 hover:bg-purple-600'
      case 'master': return 'bg-yellow-500 hover:bg-yellow-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Escolha seu Plano
            </h1>
            <p className="text-gray-600">
              Desbloqueie recursos avançados para fazer seu negócio crescer
            </p>
          </div>
        </div>

        {/* Plano Atual */}
        {user && (
          <div className="bg-white border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {getPlanoIcon(user.plano)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Plano Atual: {planos.find(p => p.id === user.plano)?.nome}
                </h3>
                <p className="text-gray-600">
                  {user.plano === 'free' ? 'Upgrade para desbloquear mais recursos' : 'Obrigado por ser nosso cliente!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparativo de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {planos.map(plano => {
            const isPlanoAtual = user?.plano === plano.id
            const podeUpgrade = user && user.plano !== plano.id
            
            return (
              <div 
                key={plano.id} 
                className={`relative rounded-lg border-2 p-6 ${getPlanoColor(plano.id)} ${
                  plano.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plano.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plano.id === 'free' ? 'bg-gray-100 text-gray-600' :
                    plano.id === 'professional' ? 'bg-blue-100 text-blue-600' :
                    plano.id === 'premium' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getPlanoIcon(plano.id)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plano.nome}
                  </h3>
                  
                  <div className="mb-4">
                    {plano.preco_mensal === 0 ? (
                      <span className="text-3xl font-bold text-gray-900">Grátis</span>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          R$ {plano.preco_mensal.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-gray-600">/mês</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {plano.descricao}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {plano.funcionalidades.map((funcionalidade, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{funcionalidade}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isPlanoAtual ? (
                    <div className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
                      Plano Atual
                    </div>
                  ) : podeUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plano.id)}
                      className={`w-full py-2 px-4 text-white rounded-lg font-medium transition-colors ${getPlanoButtonColor(plano.id)}`}
                    >
                      {plano.preco_mensal === 0 ? 'Voltar ao Gratuito' : 'Fazer Upgrade'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plano.id)}
                      className={`w-full py-2 px-4 text-white rounded-lg font-medium transition-colors ${getPlanoButtonColor(plano.id)}`}
                    >
                      Selecionar Plano
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Perguntas Frequentes
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso mudar de plano a qualquer momento?
                </h4>
                <p className="text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As alterações entram em vigor imediatamente.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Como funciona o período de teste?
                </h4>
                <p className="text-gray-600">
                  Todos os planos pagos incluem 7 dias de teste gratuito. 
                  Você pode cancelar a qualquer momento durante o período de teste.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Meus dados ficam seguros?
                </h4>
                <p className="text-gray-600">
                  Sim! Seus dados são criptografados e armazenados com segurança. 
                  Fazemos backup automático de todas as informações.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Preciso de cartão de crédito para o teste?
                </h4>
                <p className="text-gray-600">
                  Não! O plano gratuito é permanente e não requer cartão de crédito. 
                  Para planos pagos, só pedimos cartão após o período de teste.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso cancelar a qualquer momento?
                </h4>
                <p className="text-gray-600">
                  Sim! Não há contratos ou fidelidade. Você pode cancelar sua assinatura 
                  a qualquer momento e continuar usando até o final do período pago.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Oferecem suporte técnico?
                </h4>
                <p className="text-gray-600">
                  Sim! Oferecemos suporte por email para todos os planos. 
                  Planos Premium e Master incluem suporte prioritário e telefônico.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para fazer seu negócio crescer?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Junte-se a milhares de confeiteiras que já estão vendendo mais com o DoceCalc
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}