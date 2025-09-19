import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign, Package, FileText, BarChart3, Settings, LogOut, Crown, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
          <Link to="/login" className="text-pink-500 hover:text-pink-600">
            Fazer login
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calculator className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DoceCalc</h1>
                <p className="text-sm text-gray-600">{profile?.nome_negocio || 'Minha Confeitaria'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className={`h-5 w-5 ${
                  profile?.plano === 'free' ? 'text-gray-400' :
                  profile?.plano === 'professional' ? 'text-blue-500' :
                  'text-yellow-500'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  Plano {profile?.plano === 'professional' ? 'Pro' : 'Gratuito'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to="/comunidade"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Comunidade"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <Link
                  to="/upgrade"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Configurações"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Olá, {profile?.nome || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vinda ao seu painel de controle
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/calculadora"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-center space-x-4">
                <Calculator className="h-10 w-10 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Calculadora</h3>
                  <p className="text-gray-600">Calcule preços precisos</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/receitas"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
            >
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-10 w-10 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Receitas</h3>
                  <p className="text-gray-600">Gerencie suas receitas</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/ingredientes"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
            >
              <div className="flex items-center space-x-4">
                <Package className="h-10 w-10 text-purple-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ingredientes</h3>
                  <p className="text-gray-600">Controle de estoque</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/clientes"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
            >
              <div className="flex items-center space-x-4">
                <Users className="h-10 w-10 text-indigo-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
                  <p className="text-gray-600">Gerencie clientes</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/orcamentos"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-pink-500"
            >
              <div className="flex items-center space-x-4">
                <FileText className="h-10 w-10 text-pink-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Orçamentos</h3>
                  <p className="text-gray-600">Crie orçamentos</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/relatorios"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500"
            >
              <div className="flex items-center space-x-4">
                <BarChart3 className="h-10 w-10 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                  <p className="text-gray-600">Analytics do negócio</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/comunidade"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-500"
            >
              <div className="flex items-center space-x-4">
                <MessageSquare className="h-10 w-10 text-teal-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Comunidade</h3>
                  <p className="text-gray-600">Troque ideias e dicas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Upgrade Notice for Free Plan */}
        {profile?.plano === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Desbloqueie o Poder Total do DoceCalc! 🚀
                </h3>
                <p className="text-gray-600">
                  Upgrade para o plano Professional e tenha acesso ilimitado a todas as funcionalidades.
                </p>
              </div>
              <Link 
                to="/upgrade"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Fazer Upgrade
              </Link>
            </div>
          </div>
        )}

        {/* Footer de suporte */}
        <footer className="mt-12 border-t pt-4 text-center text-gray-500 text-sm">
          Suporte/Feedbacks: 15 9512....
        </footer>
      </div>
    </div>
  )
}