'use client'

import { useAuth } from '@/components/auth/local-auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Calculator, 
  ChefHat, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ArrowRight,
  Crown,
  Plus,
  BarChart3,
  Zap,
  Target,
  Package,
  FileText,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatarMoeda } from '@/lib/calculations-lib'

interface DashboardStats {
  totalReceitas: number
  receitasAtivas: number
  ultimoCalculoValor: number | null
  mediaMargemLucro: number
  totalIngredientes: number
  ingredientesAtivos: number
  totalOrcamentos: number
  valorTotalOrcamentos: number
  orcamentosPendentes: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalReceitas: 0,
    receitasAtivas: 0,
    ultimoCalculoValor: null,
    mediaMargemLucro: 0,
    totalIngredientes: 0,
    ingredientesAtivos: 0,
    totalOrcamentos: 0,
    valorTotalOrcamentos: 0,
    orcamentosPendentes: 0
  })
  const [loading, setLoading] = useState(true)

  const isPro = user?.plano === 'pro'

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // TODO: Implementar carregamento de dados usando nossa API local
      // Por enquanto, usando dados mock para demonstrar funcionalidade
      setStats({
        totalReceitas: 5,
        receitasAtivas: 3,
        ultimoCalculoValor: 45.50,
        mediaMargemLucro: 30,
        totalIngredientes: 12,
        ingredientesAtivos: 10,
        totalOrcamentos: 3,
        valorTotalOrcamentos: 230.75,
        orcamentosPendentes: 1
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Calcular Preço',
      description: 'Calcule o preço de uma receita',
      icon: Calculator,
      href: '/dashboard/calculadora',
      color: 'bg-primary',
      highlight: true
    },
    {
      title: 'Nova Receita',
      description: 'Cadastre uma nova receita',
      icon: Plus,
      href: '/dashboard/receitas?action=new',
      color: 'bg-green-500'
    },
    {
      title: 'Ver Receitas',
      description: 'Gerenciar suas receitas',
      icon: ChefHat,
      href: '/dashboard/receitas',
      color: 'bg-blue-500'
    },
    {
      title: 'Relatórios',
      description: 'Análises do seu negócio',
      icon: BarChart3,
      href: '/dashboard/relatorios',
      color: 'bg-purple-500',
      isPro: true
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Olá, {user?.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vinda ao seu painel de controle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isPro ? "default" : "secondary"} className="flex items-center gap-1">
            {isPro ? <Crown className="h-3 w-3" /> : null}
            {isPro ? 'Plano PRO' : 'Plano Gratuito'}
          </Badge>
          {!isPro && (
            <Link href="/dashboard/upgrade">
              <Button size="sm" className="bg-gradient-doce">
                <Crown className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReceitas}</div>
            <p className="text-xs text-muted-foreground">
              {stats.receitasAtivas} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingredientes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIngredientes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ingredientesAtivos} em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Cálculo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.ultimoCalculoValor ? formatarMoeda(stats.ultimoCalculoValor) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Margem: {stats.mediaMargemLucro}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrcamentos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orcamentosPendentes} pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isProFeature = action.isPro && !isPro
            
            return (
              <Link key={action.title} href={isProFeature ? '/dashboard/upgrade' : action.href}>
                <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  action.highlight ? 'ring-2 ring-primary ring-opacity-20' : ''
                } ${isProFeature ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {action.title}
                          {isProFeature && <Crown className="h-4 w-4 text-primary" />}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        {isProFeature && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            PRO
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>Suas últimas receitas cadastradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600 p-4 rounded-lg bg-gray-50">
              Você ainda não tem receitas cadastradas. 
              <Link href="/dashboard/receitas" className="text-primary hover:underline ml-1">
                Cadastre sua primeira receita
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips & Dicas</CardTitle>
            <CardDescription>Maximize seus lucros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="text-sm font-medium">Calcule sua margem ideal</p>
                <p className="text-xs text-gray-600">Mantenha entre 30-50% para garantir lucro</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="text-sm font-medium">Atualize preços regularmente</p>
                <p className="text-xs text-gray-600">Ingredientes podem variar de preço</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="text-sm font-medium">Use o plano PRO</p>
                <p className="text-xs text-gray-600">Acesse relatórios e recursos avançados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}