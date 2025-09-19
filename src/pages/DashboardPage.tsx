import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign, Package, FileText, BarChart3, Settings, LogOut, Crown, MessageCircle, Shield, Store, ShoppingBag, Cloud, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Receita, IngredienteUsuario, Cliente, Orcamento } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage'
import { planos } from '../data/planos'
import { OnboardingTutorial } from '../components/OnboardingTutorial'
import { MigrationModal } from '../components/MigrationModal'
import { SubscriptionManager } from '../components/SubscriptionManager'

export default function DashboardPage() {
  const { user, profile, perfilConfeitaria, signOut } = useAuth()
  const [stats, setStats] = useState({
    totalReceitas: 0,
    receitasCalculadas: 0,
    valorTotalOrcamentos: 0,
    ingredientesAtivos: 0,
    clientesAtivos: 0,
    orcamentosAprovados: 0
  })
  const [proximasEntregas, setProximasEntregas] = useState<any[]>([])
  const [receitasPopulares, setReceitasPopulares] = useState<any[]>([])
  const [alertasEstoque, setAlertasEstoque] = useState<any[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showMigration, setShowMigration] = useState(false)
  
  useEffect(() => {
    if (user) {
      // Verificar se é primeira vez do usuário
      const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.id}`)
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }

      // Verificar se precisa mostrar migração
      const hasLocalData = getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, []).length > 0 ||
                          getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []).length > 0
      const hasMigrated = localStorage.getItem(`migrated_${user.id}`)
      
      if (hasLocalData && !hasMigrated) {
        setShowMigration(true)
      }
      const receitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
        .filter(r => r.usuario_id === user.id && r.ativo)
      
      const ingredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
        .filter(i => i.usuario_id === user.id)
      
      const clientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
        .filter(c => c.usuario_id === user.id && c.ativo)
      
      const orcamentos = getFromLocalStorage<Orcamento[]>(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
        .filter(o => o.usuario_id === user.id)
      
      const orcamentosAprovados = orcamentos.filter(o => o.status === 'aprovado')
      
      setStats({
        totalReceitas: receitas.length,
        receitasCalculadas: receitas.filter(r => r.preco_sugerido).length,
        valorTotalOrcamentos: orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0),
        ingredientesAtivos: ingredientes.length,
        clientesAtivos: clientes.length,
        orcamentosAprovados: orcamentosAprovados.length
      })
      
      // Alertas de estoque baixo
      const estoqueBaixo = ingredientes.filter(i => 
        i.estoque_atual !== undefined && 
        i.estoque_minimo !== undefined && 
        i.estoque_atual <= i.estoque_minimo
      )
      setAlertasEstoque(estoqueBaixo)
      
      // Próximas entregas (mock)
      setProximasEntregas([
        { cliente: 'Maria Silva', produto: 'Bolo de Chocolate', data: '2025-09-20', valor: 89.90 },
        { cliente: 'João Santos', produto: 'Docinhos Festa', data: '2025-09-22', valor: 150.00 }
      ])
      
      // Receitas mais usadas (mock baseado nas receitas)
      setReceitasPopulares(receitas.slice(0, 3).map(r => ({
        nome: r.nome,
        categoria: 'Popular',
        vendas: Math.floor(Math.random() * 20) + 1
      })))
    }
  }, [user])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem(`onboarding_${user?.id}`, 'completed')
  }

  const handleMigrationComplete = () => {
    setShowMigration(false)
    localStorage.setItem(`migrated_${user?.id}`, 'completed')
  }
  
  const planoAtual = planos.find(p => p.id === profile?.plano)

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">DoceCalc</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{perfilConfeitaria?.nome_fantasia || 'Minha Confeitaria'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 overflow-x-auto">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Crown className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  profile?.plano === 'free' ? 'text-muted-foreground' :
                  profile?.plano === 'professional' ? 'text-blue-500' :
                  profile?.plano === 'premium' ? 'text-purple-500' :
                  'text-yellow-500'
                }`} />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {planoAtual?.nome}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/subscription"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Assinatura"
                >
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link
                  to="/upgrade"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Configurações"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  title="Tutorial"
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setShowMigration(true)}
                  className="p-2 text-muted-foreground hover:text-success transition-colors"
                  title="Migrar dados"
                >
                  <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={signOut}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 lg:mb-2">
            Olá, {profile?.nome}! 👋
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Bem-vinda ao seu painel de controle
          </p>
        </div>
        
        {/* Alertas de Boas-Vindas para Usuários Novos */}
        {profile && !profile.nome_negocio && (
          <div className="bg-accent border-l-4 border-primary p-4 mb-6 rounded-r-lg">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <BookOpen className="h-5 w-5 text-primary mr-0 sm:mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-accent-foreground">
                  <strong>👋 Novo por aqui?</strong> Acesse o 
                  <Link to="/como-usar" className="ml-1 underline hover:no-underline font-medium">
                    Guia "Como Usar"
                  </Link>
                  {" "}para aprender a dominar o DoceCalc!
                </p>
              </div>
            </div>
          </div>
        )}
        {alertasEstoque.length > 0 && (
          <div className="bg-accent border-l-4 border-warning p-4 mb-6 rounded-r-lg">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
              <Package className="h-5 w-5 text-warning flex-shrink-0" />
              <div className="ml-0 sm:ml-3">
                <p className="text-sm text-accent-foreground">
                  <strong>{alertasEstoque.length} ingredientes</strong> com estoque baixo precisam de reposição.
                  <Link to="/ingredientes" className="ml-2 underline hover:no-underline">
                    Ver agora
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receitas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReceitas}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calculadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.receitasCalculadas}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.valorTotalOrcamentos.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingredientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ingredientesAtivos}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clientesAtivos}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orcamentosAprovados}</p>
              </div>
              <FileText className="h-8 w-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Gerenciamento de Assinatura */}
        {profile && (
          <div className="mb-8">
            <SubscriptionManager />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-cyan-500"
              >
                <div className="flex items-center space-x-4">
                  <MessageCircle className="h-10 w-10 text-cyan-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Comunidade</h3>
                    <p className="text-gray-600">Converse com confeiteiros</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/meu-catalogo"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500 block"
              >
                <div className="flex items-center space-x-4">
                  <Store className="h-10 w-10 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Meu Catálogo</h3>
                    <p className="text-gray-600">Venda online</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/encomendas"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500 block"
              >
                <div className="flex items-center space-x-4">
                  <ShoppingBag className="h-10 w-10 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Encomendas</h3>
                    <p className="text-gray-600">Pedidos recebidos</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/backup-emergencial"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500 block"
              >
                <div className="flex items-center space-x-4">
                  <Shield className="h-10 w-10 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Backup Emergencial</h3>
                    <p className="text-gray-600">Proteja seus dados</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/como-usar"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-500 block"
              >
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-10 w-10 text-yellow-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Como Usar</h3>
                    <p className="text-red-600 font-medium">NOVO! Guia completo</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Próximas Entregas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Entregas</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {proximasEntregas.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma entrega agendada</p>
              ) : (
                <div className="space-y-4">
                  {proximasEntregas.map((entrega, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">{entrega.cliente}</h4>
                      <p className="text-sm text-gray-600">{entrega.produto}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-500">{entrega.data}</span>
                        <span className="font-bold text-green-600">R$ {entrega.valor.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Receitas Populares */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Receitas Populares</h2>
            {receitasPopulares.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma receita cadastrada ainda</p>
            ) : (
              <div className="space-y-3">
                {receitasPopulares.map((receita, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{receita.nome}</h4>
                      <p className="text-sm text-gray-600">{receita.categoria}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {receita.vendas} vendas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Dicas e Sugestões */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dicas DoceCalc 💡</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💰 Precificação Inteligente</h4>
                <p className="text-sm text-blue-700">
                  Sempre considere seus custos de mão de obra! Inclua o tempo de preparo no cálculo.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📊 Acompanhe Seu Crescimento</h4>
                <p className="text-sm text-green-700">
                  Use os relatórios para identificar seus produtos mais rentáveis e clientes mais valiosos.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎯 Organize-se Melhor</h4>
                <p className="text-sm text-purple-700">
                  Mantenha seu estoque de ingredientes atualizado para ter custos sempre precisos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OnboardingTutorial
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      <MigrationModal
        isOpen={showMigration}
        onClose={() => setShowMigration(false)}
      />
    </div>
  )
}