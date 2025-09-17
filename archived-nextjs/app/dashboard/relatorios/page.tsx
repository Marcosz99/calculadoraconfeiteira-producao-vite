'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Eye,
  Calculator,
  ChefHat,
  Package,
  Users,
  Target,
  Crown,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase-client'
import { formatarMoeda } from '@/lib/calculations-lib'

type RelatorioFinanceiro = {
  periodo: string
  totalReceitas: number
  totalOrcamentos: number
  valorMedioOrcamento: number
  receitasCalculadas: number
  margemMediaLucro: number
  ingredientesCadastrados: number
  receitasMaisRentaveis: {
    nome: string
    margem: number
    custo: number
    preco: number
  }[]
  tendenciaVendas: {
    mes: string
    valor: number
  }[]
}

type EstatisticasGerais = {
  totalReceitas: number
  receitasAtivas: number
  totalIngredientes: number
  ingredientesAtivos: number
  totalOrcamentos: number
  orcamentosPendentes: number
  orcamentosAprovados: number
  valorTotalOrcamentos: number
  ultimosCalculos: {
    receita: string
    valor: number
    data: string
  }[]
}

type RelatorioIngredientes = {
  ingredientesMaisUsados: {
    nome: string
    categoria: string
    usos: number
    custoMedio: number
  }[]
  categoriasMaisUsadas: {
    nome: string
    quantidade: number
    cor: string
  }[]
  ingredientesCaros: {
    nome: string
    preco: number
    categoria: string
  }[]
}

export default function RelatoriosPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  
  // Estados principais
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('geral')
  const [periodoFiltro, setPeriodoFiltro] = useState('30') // dias
  
  // Estados dos relatórios
  const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasGerais | null>(null)
  const [relatorioFinanceiro, setRelatorioFinanceiro] = useState<RelatorioFinanceiro | null>(null)
  const [relatorioIngredientes, setRelatorioIngredientes] = useState<RelatorioIngredientes | null>(null)

  const isPro = profile?.plano === 'pro'

  useEffect(() => {
    if (profile?.id && isPro) {
      carregarTodosRelatorios()
    }
  }, [profile?.id, isPro, periodoFiltro])

  const carregarTodosRelatorios = async () => {
    setLoading(true)
    try {
      await Promise.all([
        carregarEstatisticasGerais(),
        carregarRelatorioFinanceiro(),
        carregarRelatorioIngredientes()
      ])
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const carregarEstatisticasGerais = async () => {
    try {
      // Carregar receitas
      const { data: receitas } = await supabase
        .from('receitas')
        .select('id, nome, ativa, custo_calculado, preco_sugerido')
        .eq('user_id', profile?.id)

      // Carregar ingredientes
      const { data: ingredientes } = await supabase
        .from('ingredientes')
        .select('id, nome, ativo')
        .eq('user_id', profile?.id)

      // Carregar orçamentos
      const { data: orcamentos } = await supabase
        .from('orcamentos')
        .select('id, status, valor_total, created_at')
        .eq('user_id', profile?.id)

      // Carregar últimos cálculos
      const { data: calculos } = await supabase
        .from('calculos_salvos')
        .select(`
          id, preco_total, created_at,
          receitas (nome)
        `)
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const stats: EstatisticasGerais = {
        totalReceitas: receitas?.length || 0,
        receitasAtivas: receitas?.filter(r => r.ativa).length || 0,
        totalIngredientes: ingredientes?.length || 0,
        ingredientesAtivos: ingredientes?.filter(i => i.ativo).length || 0,
        totalOrcamentos: orcamentos?.length || 0,
        orcamentosPendentes: orcamentos?.filter(o => o.status === 'pendente').length || 0,
        orcamentosAprovados: orcamentos?.filter(o => o.status === 'aprovado').length || 0,
        valorTotalOrcamentos: orcamentos?.reduce((sum, o) => sum + o.valor_total, 0) || 0,
        ultimosCalculos: calculos?.map(c => ({
          receita: (c as any).receitas?.nome || 'Receita removida',
          valor: c.preco_total,
          data: c.created_at
        })) || []
      }

      setEstatisticasGerais(stats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas gerais:', error)
    }
  }

  const carregarRelatorioFinanceiro = async () => {
    try {
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - parseInt(periodoFiltro))

      // Carregar orçamentos do período
      const { data: orcamentos } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('user_id', profile?.id)
        .gte('created_at', dataLimite.toISOString())
        .order('created_at', { ascending: false })

      // Carregar receitas com cálculos
      const { data: receitas } = await supabase
        .from('receitas')
        .select('nome, custo_calculado, preco_sugerido')
        .eq('user_id', profile?.id)
        .not('custo_calculado', 'is', null)
        .not('preco_sugerido', 'is', null)

      // Carregar ingredientes para contagem
      const { data: ingredientes } = await supabase
        .from('ingredientes')
        .select('id')
        .eq('user_id', profile?.id)

      // Carregar cálculos do período
      const { data: calculos } = await supabase
        .from('calculos_salvos')
        .select('*')
        .eq('user_id', profile?.id)
        .gte('created_at', dataLimite.toISOString())

      // Processar dados
      const valorMedioOrcamento = orcamentos?.length ? 
        orcamentos.reduce((sum, o) => sum + o.valor_total, 0) / orcamentos.length : 0

      const margemMediaLucro = calculos?.length ?
        calculos.reduce((sum, c) => {
          const detalhes = c.detalhes as any
          return sum + (detalhes?.margemLucro || 0)
        }, 0) / calculos.length : 0

      // Receitas mais rentáveis
      const receitasRentaveis = receitas?.map(r => ({
        nome: r.nome,
        custo: r.custo_calculado || 0,
        preco: r.preco_sugerido || 0,
        margem: r.custo_calculado && r.preco_sugerido ? 
          ((r.preco_sugerido - r.custo_calculado) / r.preco_sugerido) * 100 : 0
      })).sort((a, b) => b.margem - a.margem).slice(0, 5) || []

      // Tendência de vendas (últimos 6 meses)
      const tendenciaVendas = []
      for (let i = 5; i >= 0; i--) {
        const mesData = new Date()
        mesData.setMonth(mesData.getMonth() - i)
        const inicioMes = new Date(mesData.getFullYear(), mesData.getMonth(), 1)
        const fimMes = new Date(mesData.getFullYear(), mesData.getMonth() + 1, 0)
        
        const orcamentosMes = orcamentos?.filter(o => {
          const dataOrcamento = new Date(o.created_at)
          return dataOrcamento >= inicioMes && dataOrcamento <= fimMes
        }) || []
        
        tendenciaVendas.push({
          mes: mesData.toLocaleDateString('pt-BR', { month: 'short' }),
          valor: orcamentosMes.reduce((sum, o) => sum + o.valor_total, 0)
        })
      }

      const relatorio: RelatorioFinanceiro = {
        periodo: `Últimos ${periodoFiltro} dias`,
        totalReceitas: receitas?.length || 0,
        totalOrcamentos: orcamentos?.length || 0,
        valorMedioOrcamento,
        receitasCalculadas: receitas?.length || 0,
        margemMediaLucro: margemMediaLucro * 100, // converter para %
        ingredientesCadastrados: ingredientes?.length || 0,
        receitasMaisRentaveis: receitasRentaveis,
        tendenciaVendas
      }

      setRelatorioFinanceiro(relatorio)
    } catch (error) {
      console.error('Erro ao carregar relatório financeiro:', error)
    }
  }

  const carregarRelatorioIngredientes = async () => {
    try {
      // Carregar ingredientes com uso
      const { data: receitaIngredientes } = await supabase
        .from('receita_ingredientes')
        .select(`
          quantidade,
          ingredientes (id, nome, preco_kg, categoria:categorias_ingredientes(nome, cor)),
          receitas!inner (user_id)
        `)
        .eq('receitas.user_id', profile?.id)

      // Processar ingredientes mais usados
      const usoIngredientes: { [key: string]: { nome: string, categoria: string, usos: number, custoMedio: number } } = {}
      
      receitaIngredientes?.forEach(ri => {
        const ing = (ri as any).ingredientes
        if (ing) {
          const key = ing.id
          if (!usoIngredientes[key]) {
            usoIngredientes[key] = {
              nome: ing.nome,
              categoria: ing.categoria?.nome || 'Sem categoria',
              usos: 0,
              custoMedio: ing.preco_kg
            }
          }
          usoIngredientes[key].usos++
        }
      })

      const ingredientesMaisUsados = Object.values(usoIngredientes)
        .sort((a, b) => b.usos - a.usos)
        .slice(0, 10)

      // Carregar categorias com contagem
      const { data: categorias } = await supabase
        .from('categorias_ingredientes')
        .select(`
          nome, cor,
          ingredientes (id)
        `)
        .eq('user_id', profile?.id)

      const categoriasMaisUsadas = categorias?.map(cat => ({
        nome: cat.nome,
        quantidade: (cat as any).ingredientes?.length || 0,
        cor: cat.cor
      })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5) || []

      // Ingredientes mais caros
      const { data: ingredientesCaros } = await supabase
        .from('ingredientes')
        .select(`
          nome, preco_kg,
          categoria:categorias_ingredientes(nome)
        `)
        .eq('user_id', profile?.id)
        .eq('ativo', true)
        .order('preco_kg', { ascending: false })
        .limit(10)

      const relatorio: RelatorioIngredientes = {
        ingredientesMaisUsados,
        categoriasMaisUsadas,
        ingredientesCaros: ingredientesCaros?.map(ing => ({
          nome: ing.nome,
          preco: ing.preco_kg,
          categoria: (ing as any).categoria?.nome || 'Sem categoria'
        })) || []
      }

      setRelatorioIngredientes(relatorio)
    } catch (error) {
      console.error('Erro ao carregar relatório de ingredientes:', error)
    }
  }

  const exportarRelatorio = (tipo: string) => {
    const data = new Date().toLocaleDateString('pt-BR')
    let htmlContent = ''

    if (tipo === 'financeiro' && relatorioFinanceiro) {
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório Financeiro - DoceCalc</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #e91e63; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .metric { background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
          .metric h3 { margin: 0; color: #e91e63; }
          .metric p { margin: 5px 0; font-size: 24px; font-weight: bold; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #e91e63; color: white; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🍰 DoceCalc</div>
          <h2>Relatório Financeiro</h2>
          <p>Período: ${relatorioFinanceiro.periodo} | Gerado em: ${data}</p>
        </div>

        <div class="metrics">
          <div class="metric">
            <h3>Valor Médio/Orçamento</h3>
            <p>R$ ${relatorioFinanceiro.valorMedioOrcamento.toFixed(2)}</p>
          </div>
          <div class="metric">
            <h3>Margem Média</h3>
            <p>${relatorioFinanceiro.margemMediaLucro.toFixed(1)}%</p>
          </div>
          <div class="metric">
            <h3>Total de Receitas</h3>
            <p>${relatorioFinanceiro.totalReceitas}</p>
          </div>
        </div>

        <h3>Receitas Mais Rentáveis</h3>
        <table class="table">
          <thead>
            <tr><th>Receita</th><th>Custo</th><th>Preço</th><th>Margem</th></tr>
          </thead>
          <tbody>
            ${relatorioFinanceiro.receitasMaisRentaveis.map(r => `
              <tr>
                <td>${r.nome}</td>
                <td>R$ ${r.custo.toFixed(2)}</td>
                <td>R$ ${r.preco.toFixed(2)}</td>
                <td>${r.margem.toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #e91e63; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
            🖨️ Imprimir / Salvar PDF
          </button>
          <button onclick="window.close()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin-left: 10px;">
            ✕ Fechar
          </button>
        </div>
      </body>
      </html>
      `
    } else if (tipo === 'ingredientes' && relatorioIngredientes) {
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório de Ingredientes - DoceCalc</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #e91e63; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #e91e63; color: white; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🍰 DoceCalc</div>
          <h2>Relatório de Ingredientes</h2>
          <p>Gerado em: ${data}</p>
        </div>

        <h3>Ingredientes Mais Utilizados</h3>
        <table class="table">
          <thead>
            <tr><th>Ingrediente</th><th>Categoria</th><th>Usos</th><th>Custo/Kg</th></tr>
          </thead>
          <tbody>
            ${relatorioIngredientes.ingredientesMaisUsados.map(ing => `
              <tr>
                <td>${ing.nome}</td>
                <td>${ing.categoria}</td>
                <td>${ing.usos}</td>
                <td>R$ ${ing.custoMedio.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #e91e63; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
            🖨️ Imprimir / Salvar PDF
          </button>
          <button onclick="window.close()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin-left: 10px;">
            ✕ Fechar
          </button>
        </div>
      </body>
      </html>
      `
    }

    if (htmlContent) {
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
      } else {
        toast({
          title: "Erro ao exportar",
          description: "Não foi possível abrir a janela de exportação.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: `A exportação de ${tipo} será implementada em breve.`,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-8 px-4">
        <Card className="max-w-lg mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-doce rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Relatórios PRO</CardTitle>
            <CardDescription>
              Os relatórios detalhados estão disponíveis apenas no plano PRO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Análises financeiras completas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Relatórios de rentabilidade</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Análise de ingredientes e custos</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exportação em PDF profissional</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Tendências e projeções</span>
              </div>
            </div>
            
            <Button asChild className="w-full mt-6" variant="doce">
              <a href="/dashboard/upgrade">
                <Crown className="h-4 w-4 mr-2" />
                Fazer Upgrade para PRO
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Relatórios e Análises
            </h1>
            <Badge className="bg-gradient-doce text-white">
              <Crown className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Análises detalhadas do seu negócio, tendências financeiras e insights para tomar decisões estratégicas
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <Label htmlFor="periodo">Período:</Label>
            <select
              id="periodo"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
          </div>
          
          <Button 
            onClick={carregarTodosRelatorios}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="financeiro">Análise Financeira</TabsTrigger>
            <TabsTrigger value="ingredientes">Análise de Ingredientes</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="geral" className="space-y-6">
            {estatisticasGerais && (
              <>
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {estatisticasGerais.totalReceitas}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estatisticasGerais.receitasAtivas} ativas
                          </p>
                        </div>
                        <ChefHat className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Ingredientes</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {estatisticasGerais.totalIngredientes}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estatisticasGerais.ingredientesAtivos} ativos
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Orçamentos</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {estatisticasGerais.totalOrcamentos}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estatisticasGerais.orcamentosPendentes} pendentes
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Valor Total</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatarMoeda(estatisticasGerais.valorTotalOrcamentos)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estatisticasGerais.orcamentosAprovados} aprovados
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Últimos Cálculos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Últimos Cálculos Realizados</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {estatisticasGerais.ultimosCalculos.length > 0 ? (
                      <div className="space-y-3">
                        {estatisticasGerais.ultimosCalculos.map((calculo, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{calculo.receita}</p>
                              <p className="text-sm text-gray-600">{formatDate(calculo.data)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                {formatarMoeda(calculo.valor)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum cálculo realizado ainda</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Análise Financeira */}
          <TabsContent value="financeiro" className="space-y-6">
            {relatorioFinanceiro && (
              <>
                {/* Métricas Financeiras */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Valor Médio/Orçamento</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatarMoeda(relatorioFinanceiro.valorMedioOrcamento)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Margem Média de Lucro</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPercent(relatorioFinanceiro.margemMediaLucro)}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Receitas Calculadas</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {relatorioFinanceiro.receitasCalculadas}
                          </p>
                        </div>
                        <Calculator className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Receitas Mais Rentáveis */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Receitas Mais Rentáveis</span>
                      </CardTitle>
                      <Button onClick={() => exportarRelatorio('financeiro')} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {relatorioFinanceiro.receitasMaisRentaveis.length > 0 ? (
                      <div className="space-y-3">
                        {relatorioFinanceiro.receitasMaisRentaveis.map((receita, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{receita.nome}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Custo</p>
                              <p className="font-medium">{formatarMoeda(receita.custo)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Preço</p>
                              <p className="font-medium">{formatarMoeda(receita.preco)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Margem</p>
                              <p className="font-semibold text-green-600">
                                {formatPercent(receita.margem)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma receita com cálculo de rentabilidade</p>
                        <p className="text-sm">Use a calculadora para analisar suas receitas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tendência de Vendas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Tendência de Orçamentos (Últimos 6 Meses)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-4">
                      {relatorioFinanceiro.tendenciaVendas.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="bg-primary/10 rounded-lg p-4 mb-2">
                            <div 
                              className="bg-primary rounded w-full" 
                              style={{ 
                                height: `${Math.max(20, (item.valor / Math.max(...relatorioFinanceiro.tendenciaVendas.map(t => t.valor))) * 100)}px` 
                              }}
                            />
                          </div>
                          <p className="text-sm font-medium capitalize">{item.mes}</p>
                          <p className="text-xs text-gray-600">{formatarMoeda(item.valor)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Análise de Ingredientes */}
          <TabsContent value="ingredientes" className="space-y-6">
            {relatorioIngredientes && (
              <>
                {/* Ingredientes Mais Usados */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Ingredientes Mais Utilizados</span>
                      </CardTitle>
                      <Button onClick={() => exportarRelatorio('ingredientes')} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {relatorioIngredientes.ingredientesMaisUsados.length > 0 ? (
                      <div className="space-y-3">
                        {relatorioIngredientes.ingredientesMaisUsados.map((ingrediente, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{ingrediente.nome}</p>
                              <p className="text-sm text-gray-600">{ingrediente.categoria}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Usos</p>
                              <p className="font-medium">{ingrediente.usos}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Custo/Kg</p>
                              <p className="font-medium">{formatarMoeda(ingrediente.custoMedio)}</p>
                            </div>
                            <div>
                              <Badge variant="outline">
                                #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum ingrediente utilizado ainda</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Categorias Mais Usadas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5" />
                        <span>Categorias por Quantidade</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {relatorioIngredientes.categoriasMaisUsadas.length > 0 ? (
                        <div className="space-y-3">
                          {relatorioIngredientes.categoriasMaisUsadas.map((categoria, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: categoria.cor }}
                                />
                                <span className="font-medium">{categoria.nome}</span>
                              </div>
                              <Badge variant="outline">
                                {categoria.quantidade} {categoria.quantidade === 1 ? 'item' : 'itens'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Nenhuma categoria criada</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ingredientes Mais Caros */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Ingredientes Mais Caros</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {relatorioIngredientes.ingredientesCaros.length > 0 ? (
                        <div className="space-y-3">
                          {relatorioIngredientes.ingredientesCaros.slice(0, 5).map((ingrediente, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{ingrediente.nome}</p>
                                <p className="text-sm text-gray-600">{ingrediente.categoria}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600">
                                  {formatarMoeda(ingrediente.preco)}
                                </p>
                                <p className="text-xs text-gray-500">por Kg</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Nenhum ingrediente cadastrado</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}