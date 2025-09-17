import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign, Package, FileText, BarChart3, Settings, LogOut, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Receita, IngredienteUsuario, Cliente, Orcamento } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage'
import { planos } from '../data/planos'

export default function DashboardPage() {
  const { user, perfilConfeitaria, signOut } = useAuth()
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
  
  useEffect(() => {
    if (user) {
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
  
  const planoAtual = planos.find(p => p.id === user?.plano)

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
                <p className="text-sm text-gray-600">{perfilConfeitaria?.nome_fantasia || 'Minha Confeitaria'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className={`h-5 w-5 ${
                  user.plano === 'free' ? 'text-gray-400' :
                  user.plano === 'professional' ? 'text-blue-500' :
                  user.plano === 'premium' ? 'text-purple-500' :
                  'text-yellow-500'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  Plano {planoAtual?.nome}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
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
            Olá, {user.nome}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vinda ao seu painel de controle
          </p>
        </div>
        
        {/* Alertas */}
        {alertasEstoque.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <Package className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
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
    </div>
  )
}