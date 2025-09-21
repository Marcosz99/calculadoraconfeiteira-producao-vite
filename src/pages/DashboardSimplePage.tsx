import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign, Package, FileText, BarChart3, Crown, MessageSquare, BookOpen, TestTube, Bot, ShoppingBag, Brain, Palette, User, Plus, ArrowRight, Zap, Target, Clock, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AppLayout } from '../components/Layout'

export default function DashboardPage() {
  const { user, profile } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
          <Link to="/login" className="hover:text-pink-600" style={{ color: 'var(--primary)' }}>
            Fazer login
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Olá, {profile?.nome || user?.email?.split('@')[0] || 'Confeiteira'}! 👋
            </h1>
            <p className="text-pink-100 mb-4">
              Bem-vinda ao seu painel de controle da {profile?.nome_negocio || 'sua confeitaria'}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Crown className={`h-4 w-4 mr-1 ${
                  profile?.plano === 'professional' ? 'text-yellow-300' : 'text-pink-200'
                }`} />
                <span>Plano {profile?.plano === 'professional' ? 'Pro' : 'Gratuito'}</span>
              </div>
              {profile?.plano !== 'professional' && (
                <Link 
                  to="/upgrade" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  Fazer Upgrade ✨
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats - Simplified */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-pink-100">
                <FileText className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Receitas</p>
                <p className="text-lg font-semibold text-gray-900">15</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ingredientes</p>
                <p className="text-lg font-semibold text-gray-900">32</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                <p className="text-lg font-semibold text-gray-900">R$ 250,00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Principais Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/calculadora"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-pink-100 group-hover:bg-pink-500 transition-colors">
                  <Calculator className="h-6 w-6 text-pink-600 group-hover:text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculadora</h3>
              <p className="text-gray-600 text-sm mb-3">Calcule preços precisos para suas receitas</p>
              <div className="flex items-center text-sm text-pink-600">
                <Zap className="h-4 w-4 mr-1" />
                <span>Ação rápida</span>
              </div>
            </Link>

            <Link 
              to="/receitas"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors">
                  <FileText className="h-6 w-6 text-green-600 group-hover:text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Receitas</h3>
              <p className="text-gray-600 text-sm mb-3">Gerencie e organize suas receitas</p>
              <div className="flex items-center text-sm text-green-600">
                <Bot className="h-4 w-4 mr-1" />
                <span>Com IA</span>
              </div>
            </Link>

            <Link 
              to="/ingredientes"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-500 transition-colors">
                  <Package className="h-6 w-6 text-purple-600 group-hover:text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredientes</h3>
              <p className="text-gray-600 text-sm mb-3">Controle de estoque e preços</p>
              <div className="flex items-center text-sm text-purple-600">
                <Target className="h-4 w-4 mr-1" />
                <span>32 itens</span>
              </div>
            </Link>

            <Link 
              to="/comunidade"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-teal-100 group-hover:bg-teal-500 transition-colors">
                  <Users className="h-6 w-6 text-teal-600 group-hover:text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunidade</h3>
              <p className="text-gray-600 text-sm mb-3">Troque receitas e experiências</p>
              <div className="flex items-center text-sm text-teal-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Conectar</span>
              </div>
            </Link>


            <Link 
              to="/financeiro"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-500 transition-colors">
                  <DollarSign className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financeiro</h3>
              <p className="text-gray-600 text-sm mb-3">Controle financeiro completo</p>
              <div className="flex items-center text-sm text-emerald-600">
                <Bot className="h-4 w-4 mr-1" />
                <span>OCR + IA</span>
              </div>
            </Link>
          </div>
        </div>

        {/* More Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mais Funcionalidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link 
              to="/clientes"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-500 transition-colors inline-block mb-3">
                  <Users className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Clientes</h3>
                <p className="text-xs text-gray-600">CRM completo</p>
              </div>
            </Link>
            
            <Link 
              to="/orcamentos"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg bg-indigo-100 group-hover:bg-indigo-500 transition-colors inline-block mb-3">
                  <FileText className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Orçamentos</h3>
                <p className="text-xs text-gray-600">Crie propostas</p>
              </div>
            </Link>
            

            <Link 
              to="/ai-assistant"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all group"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg bg-yellow-100 group-hover:bg-yellow-500 transition-colors inline-block mb-3">
                  <Bot className="h-6 w-6 text-yellow-600 group-hover:text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">DoceBot IA</h3>
                <p className="text-xs text-gray-600">Assistente</p>
              </div>
            </Link>

            <Link 
              to="/marketplace"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg bg-red-100 group-hover:bg-red-500 transition-colors inline-block mb-3">
                  <ShoppingBag className="h-6 w-6 text-red-600 group-hover:text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Marketplace</h3>
                <p className="text-xs text-gray-600">E-books</p>
              </div>
            </Link>

            <Link 
              to="/custom-catalog"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-rose-200 transition-all group"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg bg-rose-100 group-hover:bg-rose-500 transition-colors inline-block mb-3">
                  <Palette className="h-6 w-6 text-rose-600 group-hover:text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Catálogo</h3>
                <p className="text-xs text-gray-600">Personalize</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Features & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Dicas Rápidas</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Use a calculadora para precificar corretamente suas receitas</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Mantenha seus ingredientes sempre atualizados</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Utilize o CRM para fidelizar seus clientes</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Próximos Passos</h3>
            <div className="space-y-3">
              <Link to="/calculadora" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-gray-900">Calcular uma receita</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link to="/receitas" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-gray-900">Adicionar nova receita</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link to="/clientes" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-gray-900">Cadastrar cliente</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}