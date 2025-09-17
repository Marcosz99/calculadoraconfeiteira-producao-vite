'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  ChefHat,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  DollarSign,
  Calculator,
  Copy,
  Minus,
  Package,
  ShoppingCart
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase, getUserProfile } from '@/lib/supabase-client'
import { formatarMoeda, formatarQuantidade, calcularPrecoReceita } from '@/lib/calculations-lib'
import { ReceitaCompleta, Ingrediente, ReceitaIngrediente } from '@/lib/database-types'
import Link from 'next/link'

type IngredienteReceita = {
  id?: string
  ingrediente_id: string
  quantidade: number
  ingrediente: Ingrediente
}

type ReceitaListItem = {
  id: string
  nome: string
  descricao: string | null
  tempo_producao: number
  complexidade: 'simples' | 'media' | 'complexa'
  rendimento: number
  categoria: string
  ativa: boolean
  custo_calculado: number | null
  preco_sugerido: number | null
  created_at: string
  updated_at: string
}

export default function ReceitasPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  
  // Estados
  const [receitas, setReceitas] = useState<ReceitaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [filterComplexidade, setFilterComplexidade] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingReceita, setEditingReceita] = useState<ReceitaListItem | null>(null)
  
  // Estados para ingredientes
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<Ingrediente[]>([])
  const [ingredientesReceita, setIngredientesReceita] = useState<IngredienteReceita[]>([])
  const [loadingIngredientes, setLoadingIngredientes] = useState(false)
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  
  // Estados para vista detalhada
  const [receitaDetalhada, setReceitaDetalhada] = useState<ReceitaListItem | null>(null)
  const [ingredientesDetalhada, setIngredientesDetalhada] = useState<IngredienteReceita[]>([])
  const [custoCalculadoDetalhado, setCustoCalculadoDetalhado] = useState<number | null>(null)
  const [showDetalheModal, setShowDetalheModal] = useState(false)

  // Formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tempo_producao: 60,
    complexidade: 'simples' as 'simples' | 'media' | 'complexa',
    rendimento: 1,
    categoria: 'doces',
    ativa: true
  })

  const isPro = profile?.plano === 'pro'
  const action = searchParams.get('action')

  useEffect(() => {
    if (action === 'new') {
      setShowForm(true)
    }
  }, [action])

  useEffect(() => {
    if (profile?.id) {
      loadReceitas()
      loadIngredientesDisponiveis()
    }
  }, [profile?.id])

  const loadIngredientesDisponiveis = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setIngredientesDisponiveis(data || [])
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error)
    }
  }

  const loadIngredientesReceita = async (receitaId: string) => {
    try {
      setLoadingIngredientes(true)
      const { data, error } = await supabase
        .from('receita_ingredientes')
        .select(`
          *,
          ingredientes (*)
        `)
        .eq('receita_id', receitaId)

      if (error) throw error
      
      const ingredientesFormatados = (data || []).map(item => ({
        id: item.id,
        ingrediente_id: item.ingrediente_id,
        quantidade: item.quantidade,
        ingrediente: item.ingredientes
      }))
      
      setIngredientesReceita(ingredientesFormatados)
    } catch (error) {
      console.error('Erro ao carregar ingredientes da receita:', error)
      toast({
        title: "Erro ao carregar ingredientes",
        description: "Não foi possível carregar os ingredientes da receita.",
        variant: "destructive",
      })
    } finally {
      setLoadingIngredientes(false)
    }
  }

  const adicionarIngredienteReceita = (ingredienteId: string) => {
    const ingrediente = ingredientesDisponiveis.find(i => i.id === ingredienteId)
    if (!ingrediente) return

    // Verificar se já existe
    if (ingredientesReceita.some(ir => ir.ingrediente_id === ingredienteId)) {
      toast({
        title: "Ingrediente já adicionado",
        description: "Este ingrediente já está na receita.",
        variant: "destructive",
      })
      return
    }

    const novoIngrediente: IngredienteReceita = {
      ingrediente_id: ingredienteId,
      quantidade: 100, // valor padrão
      ingrediente
    }

    setIngredientesReceita([...ingredientesReceita, novoIngrediente])
    setShowIngredientSelector(false)
  }

  const atualizarQuantidadeIngrediente = (ingredienteId: string, novaQuantidade: number) => {
    setIngredientesReceita(prev => 
      prev.map(ir => 
        ir.ingrediente_id === ingredienteId 
          ? { ...ir, quantidade: novaQuantidade }
          : ir
      )
    )
  }

  const removerIngredienteReceita = (ingredienteId: string) => {
    setIngredientesReceita(prev => 
      prev.filter(ir => ir.ingrediente_id !== ingredienteId)
    )
  }

  const salvarIngredientesReceita = async (receitaId: string) => {
    try {
      // Primeiro, remover ingredientes existentes
      await supabase
        .from('receita_ingredientes')
        .delete()
        .eq('receita_id', receitaId)

      // Depois, inserir os novos ingredientes
      if (ingredientesReceita.length > 0) {
        const ingredientesParaInserir = ingredientesReceita.map(ir => ({
          receita_id: receitaId,
          ingrediente_id: ir.ingrediente_id,
          quantidade: ir.quantidade
        }))

        const { error } = await supabase
          .from('receita_ingredientes')
          .insert(ingredientesParaInserir)

        if (error) throw error
      }
    } catch (error) {
      console.error('Erro ao salvar ingredientes:', error)
      throw error
    }
  }

  const carregarDetalhesReceita = async (receita: ReceitaListItem) => {
    try {
      setReceitaDetalhada(receita)
      setShowDetalheModal(true)
      
      // Carregar ingredientes da receita
      const { data, error } = await supabase
        .from('receita_ingredientes')
        .select(`
          *,
          ingredientes (*)
        `)
        .eq('receita_id', receita.id)

      if (error) throw error
      
      const ingredientesFormatados = (data || []).map(item => ({
        id: item.id,
        ingrediente_id: item.ingrediente_id,
        quantidade: item.quantidade,
        ingrediente: item.ingredientes
      }))
      
      setIngredientesDetalhada(ingredientesFormatados)
      
      // Calcular custo se há ingredientes
      if (ingredientesFormatados.length > 0) {
        calcularCustoReceita(receita, ingredientesFormatados)
      } else {
        setCustoCalculadoDetalhado(null)
      }
      
    } catch (error) {
      console.error('Erro ao carregar detalhes da receita:', error)
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes da receita.",
        variant: "destructive",
      })
    }
  }

  const calcularCustoReceita = (receita: ReceitaListItem, ingredientes: IngredienteReceita[]) => {
    try {
      // Criar uma receita completa simulada para o cálculo
      const receitaCompleta: ReceitaCompleta = {
        ...receita,
        user_id: profile?.id || '',
        imagem_url: '',
        tempo_preparo: receita.tempo_producao,
        receita_ingredientes: ingredientes.map(ir => ({
          id: ir.id || '',
          receita_id: receita.id,
          ingrediente_id: ir.ingrediente_id,
          quantidade: ir.quantidade,
          created_at: '',
          ingredientes: {
            ...ir.ingrediente,
            preco_por_unidade: ir.ingrediente.preco_kg,
            user_id: profile?.id || ''
          }
        }))
      }

      const resultado = calcularPrecoReceita(
        receitaCompleta,
        profile?.valor_hora || 25,
        profile?.margem_padrao || 0.6,
        1,
        false
      )

      setCustoCalculadoDetalhado(resultado.custoTotal)
    } catch (error) {
      console.error('Erro ao calcular custo:', error)
      setCustoCalculadoDetalhado(null)
    }
  }

  const loadReceitas = async () => {
    if (!profile?.id) return

    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', profile.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setReceitas(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
      toast({
        title: "Erro ao carregar receitas",
        description: "Não foi possível carregar suas receitas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveReceita = async () => {
    if (!profile?.id) return

    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da receita é obrigatório.",
        variant: "destructive",
      })
      return
    }

    // Verificar limite do plano gratuito
    if (!isPro && !editingReceita && receitas.length >= 3) {
      toast({
        title: "Limite do Plano Gratuito",
        description: "Upgrade para PRO para criar receitas ilimitadas.",
        variant: "destructive",
      })
      return
    }

    try {
      const receitaData = {
        ...formData,
        user_id: profile.id,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingReceita) {
        result = await supabase
          .from('receitas')
          .update(receitaData)
          .eq('id', editingReceita.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('receitas')
          .insert(receitaData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      // Salvar ingredientes da receita
      await salvarIngredientesReceita(result.data.id)

      toast({
        title: editingReceita ? "Receita atualizada!" : "Receita criada! 🎂",
        description: `${formData.nome} foi ${editingReceita ? 'atualizada' : 'criada'} com sucesso.`,
      })

      // Resetar formulário
      setFormData({
        nome: '',
        descricao: '',
        tempo_producao: 60,
        complexidade: 'simples',
        rendimento: 1,
        categoria: 'doces',
        ativa: true
      })
      setIngredientesReceita([])
      setShowForm(false)
      setEditingReceita(null)
      
      // Recarregar receitas
      loadReceitas()

    } catch (error) {
      console.error('Erro ao salvar receita:', error)
      toast({
        title: "Erro ao salvar receita",
        description: "Não foi possível salvar a receita.",
        variant: "destructive",
      })
    }
  }

  const handleEditReceita = (receita: ReceitaListItem) => {
    setFormData({
      nome: receita.nome,
      descricao: receita.descricao || '',
      tempo_producao: receita.tempo_producao,
      complexidade: receita.complexidade,
      rendimento: receita.rendimento,
      categoria: receita.categoria,
      ativa: receita.ativa
    })
    setEditingReceita(receita)
    setShowForm(true)
    // Carregar ingredientes da receita
    loadIngredientesReceita(receita.id)
  }

  const handleDeleteReceita = async (receita: ReceitaListItem) => {
    if (!confirm(`Tem certeza que deseja excluir "${receita.nome}"?`)) return

    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', receita.id)

      if (error) throw error

      toast({
        title: "Receita excluída",
        description: `${receita.nome} foi excluída com sucesso.`,
      })

      loadReceitas()
    } catch (error) {
      console.error('Erro ao excluir receita:', error)
      toast({
        title: "Erro ao excluir receita",
        description: "Não foi possível excluir a receita.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateReceita = async (receita: ReceitaListItem) => {
    if (!isPro && receitas.length >= 3) {
      toast({
        title: "Limite do Plano Gratuito",
        description: "Upgrade para PRO para duplicar receitas.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('receitas')
        .insert({
          nome: `${receita.nome} (Cópia)`,
          descricao: receita.descricao,
          tempo_producao: receita.tempo_producao,
          complexidade: receita.complexidade,
          rendimento: receita.rendimento,
          categoria: receita.categoria,
          ativa: true,
          user_id: profile?.id
        })

      if (error) throw error

      toast({
        title: "Receita duplicada! 🍰",
        description: `Cópia de ${receita.nome} criada com sucesso.`,
      })

      loadReceitas()
    } catch (error) {
      console.error('Erro ao duplicar receita:', error)
      toast({
        title: "Erro ao duplicar receita",
        description: "Não foi possível duplicar a receita.",
        variant: "destructive",
      })
    }
  }

  // Filtrar receitas
  const receitasFiltradas = receitas.filter(receita => {
    const matchesSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (receita.descricao && receita.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategoria = !filterCategoria || receita.categoria === filterCategoria
    const matchesComplexidade = !filterComplexidade || receita.complexidade === filterComplexidade
    
    return matchesSearch && matchesCategoria && matchesComplexidade
  })

  const getComplexidadeColor = (complexidade: string) => {
    switch (complexidade) {
      case 'simples': return 'bg-green-100 text-green-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'complexa': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexidadeLabel = (complexidade: string) => {
    switch (complexidade) {
      case 'simples': return 'Simples'
      case 'media': return 'Média'
      case 'complexa': return 'Complexa'
      default: return complexidade
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Minhas Receitas
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Organize suas receitas, calcule custos e gerencie seu catálogo de produtos
          </p>
          
          {!isPro && (
            <div className="mt-4">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                Plano Gratuito - Máximo 3 receitas
              </Badge>
            </div>
          )}
        </div>

        {/* Ações Principais */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowForm(true)}
            variant="doce" 
            size="lg"
            disabled={!isPro && receitas.length >= 3}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Receita
          </Button>
          
          {!isPro && receitas.length >= 3 && (
            <Link href="/dashboard/upgrade">
              <Button variant="outline" size="lg">
                <TrendingUp className="h-5 w-5 mr-2" />
                Upgrade para PRO
              </Button>
            </Link>
          )}
        </div>

        {showForm ? (
          /* Formulário de Receita */
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingReceita ? 'Editar Receita' : 'Nova Receita'}
              </CardTitle>
              <CardDescription>
                {editingReceita ? 'Atualize os dados da receita' : 'Crie uma nova receita para seu catálogo'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Receita</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Brigadeiro Gourmet"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="doces">Doces</option>
                    <option value="bolos">Bolos</option>
                    <option value="tortas">Tortas</option>
                    <option value="salgados">Salgados</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="complexidade">Complexidade</Label>
                  <select
                    id="complexidade"
                    value={formData.complexidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, complexidade: e.target.value as any }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="simples">Simples</option>
                    <option value="media">Média</option>
                    <option value="complexa">Complexa</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tempo">Tempo de Produção (min)</Label>
                  <Input
                    id="tempo"
                    type="number"
                    value={formData.tempo_producao}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempo_producao: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="rendimento">Rendimento (unidades)</Label>
                  <Input
                    id="rendimento"
                    type="number"
                    value={formData.rendimento}
                    onChange={(e) => setFormData(prev => ({ ...prev, rendimento: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição (Opcional)</Label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva sua receita, ingredientes especiais, dicas..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>

              {/* Gestão de Ingredientes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Ingredientes da Receita</Label>
                  <Button 
                    type="button"
                    onClick={() => setShowIngredientSelector(true)}
                    variant="outline" 
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Ingrediente
                  </Button>
                </div>

                {ingredientesReceita.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Nenhum ingrediente adicionado ainda. Clique em "Adicionar Ingrediente" para começar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ingredientesReceita.map((ingredienteReceita) => (
                      <div 
                        key={ingredienteReceita.ingrediente_id} 
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{ingredienteReceita.ingrediente.nome}</p>
                          <p className="text-sm text-gray-500">
                            {formatarMoeda(ingredienteReceita.ingrediente.preco_kg)}/kg · {ingredienteReceita.ingrediente.unidade}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={ingredienteReceita.quantidade}
                            onChange={(e) => atualizarQuantidadeIngrediente(
                              ingredienteReceita.ingrediente_id, 
                              Number(e.target.value)
                            )}
                            min="0"
                            step="0.1"
                            className="w-20 h-8 text-sm"
                          />
                          <span className="text-sm text-gray-500 min-w-8">
                            {ingredienteReceita.ingrediente.unidade}
                          </span>
                          <Button
                            type="button"
                            onClick={() => removerIngredienteReceita(ingredienteReceita.ingrediente_id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal de seleção de ingredientes */}
                {showIngredientSelector && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full m-4 max-h-96">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Selecionar Ingrediente</h3>
                          <Button
                            type="button"
                            onClick={() => setShowIngredientSelector(false)}
                            variant="ghost"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 max-h-64 overflow-y-auto">
                        {ingredientesDisponiveis.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum ingrediente disponível
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {ingredientesDisponiveis
                              .filter(ing => !ingredientesReceita.some(ir => ir.ingrediente_id === ing.id))
                              .map((ingrediente) => (
                                <button
                                  key={ingrediente.id}
                                  type="button"
                                  onClick={() => adicionarIngredienteReceita(ingrediente.id)}
                                  className="w-full text-left p-2 rounded hover:bg-gray-50 border"
                                >
                                  <div className="font-medium">{ingrediente.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    {formatarMoeda(ingrediente.preco_kg)}/kg · {ingrediente.unidade}
                                  </div>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativa"
                  checked={formData.ativa}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativa: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="ativa" className="text-sm">
                  Receita ativa (visível no catálogo)
                </Label>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveReceita} variant="doce">
                  {editingReceita ? 'Atualizar Receita' : 'Criar Receita'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowForm(false)
                    setEditingReceita(null)
                    setIngredientesReceita([])
                    setFormData({
                      nome: '',
                      descricao: '',
                      tempo_producao: 60,
                      complexidade: 'simples',
                      rendimento: 1,
                      categoria: 'doces',
                      ativa: true
                    })
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filtros e Pesquisa */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Pesquisar receitas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={filterCategoria}
                      onChange={(e) => setFilterCategoria(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Todas categorias</option>
                      <option value="doces">Doces</option>
                      <option value="bolos">Bolos</option>
                      <option value="tortas">Tortas</option>
                      <option value="salgados">Salgados</option>
                      <option value="bebidas">Bebidas</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={filterComplexidade}
                      onChange={(e) => setFilterComplexidade(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Todas complexidades</option>
                      <option value="simples">Simples</option>
                      <option value="media">Média</option>
                      <option value="complexa">Complexa</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Receitas */}
            {receitas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhuma receita encontrada
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comece criando sua primeira receita para organizar seus produtos.
                  </p>
                  <Button onClick={() => setShowForm(true)} variant="doce">
                    <Plus className="h-5 w-5 mr-2" />
                    Criar Primeira Receita
                  </Button>
                </CardContent>
              </Card>
            ) : receitasFiltradas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou termo de pesquisa.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receitasFiltradas.map((receita) => (
                  <Card key={receita.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{receita.nome}</CardTitle>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge 
                              variant="secondary"
                              className={getComplexidadeColor(receita.complexidade)}
                            >
                              {getComplexidadeLabel(receita.complexidade)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {receita.categoria}
                            </Badge>
                          </div>
                        </div>
                        {!receita.ativa && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            Inativa
                          </Badge>
                        )}
                      </div>
                      
                      {receita.descricao && (
                        <CardDescription className="text-sm line-clamp-2">
                          {receita.descricao}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{receita.tempo_producao} min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{receita.rendimento} un</span>
                        </div>
                      </div>

                      {receita.custo_calculado && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-800 font-medium">Custo calculado:</span>
                            <span className="text-green-900 font-bold">
                              {formatarMoeda(receita.custo_calculado)}
                            </span>
                          </div>
                          {receita.preco_sugerido && (
                            <div className="flex justify-between items-center text-sm mt-1">
                              <span className="text-green-800 font-medium">Preço sugerido:</span>
                              <span className="text-green-900 font-bold">
                                {formatarMoeda(receita.preco_sugerido)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="doce"
                          onClick={() => carregarDetalhesReceita(receita)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Link href={`/dashboard/calculadora?receita=${receita.id}`}>
                          <Button size="sm" variant="outline">
                            <Calculator className="h-4 w-4 mr-1" />
                            Calcular
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditReceita(receita)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDuplicateReceita(receita)}
                          disabled={!isPro && receitas.length >= 3}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteReceita(receita)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Modal de Vista Detalhada */}
        {showDetalheModal && receitaDetalhada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{receitaDetalhada.nome}</h2>
                  <Button
                    onClick={() => {
                      setShowDetalheModal(false)
                      setReceitaDetalhada(null)
                      setIngredientesDetalhada([])
                      setCustoCalculadoDetalhado(null)
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informações Gerais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium">{receitaDetalhada.categoria}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Complexidade:</span>
                        <Badge className={getComplexidadeColor(receitaDetalhada.complexidade)}>
                          {getComplexidadeLabel(receitaDetalhada.complexidade)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tempo de produção:</span>
                        <span className="font-medium">{receitaDetalhada.tempo_producao} minutos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rendimento:</span>
                        <span className="font-medium">{receitaDetalhada.rendimento} unidades</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={receitaDetalhada.ativa ? "default" : "outline"}>
                          {receitaDetalhada.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Custos e Preços</h3>
                    <div className="space-y-2 text-sm">
                      {custoCalculadoDetalhado && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Custo calculado:</span>
                          <span className="font-bold text-green-600">
                            {formatarMoeda(custoCalculadoDetalhado)}
                          </span>
                        </div>
                      )}
                      {receitaDetalhada.custo_calculado && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Custo salvo:</span>
                          <span className="font-medium">
                            {formatarMoeda(receitaDetalhada.custo_calculado)}
                          </span>
                        </div>
                      )}
                      {receitaDetalhada.preco_sugerido && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço sugerido:</span>
                          <span className="font-medium">
                            {formatarMoeda(receitaDetalhada.preco_sugerido)}
                          </span>
                        </div>
                      )}
                      {custoCalculadoDetalhado && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Custo por unidade:</span>
                          <span className="font-medium">
                            {formatarMoeda(custoCalculadoDetalhado / receitaDetalhada.rendimento)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Descrição */}
                {receitaDetalhada.descricao && (
                  <div>
                    <h3 className="font-semibold mb-3">Descrição</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {receitaDetalhada.descricao}
                    </p>
                  </div>
                )}
                
                {/* Ingredientes */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ingredientes ({ingredientesDetalhada.length})
                  </h3>
                  {loadingIngredientes ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : ingredientesDetalhada.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Nenhum ingrediente cadastrado</p>
                      <p className="text-sm text-gray-400">Edite a receita para adicionar ingredientes</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ingredientesDetalhada.map((ingredienteReceita) => {
                        const custoIngrediente = (ingredienteReceita.quantidade / 1000) * ingredienteReceita.ingrediente.preco_kg
                        return (
                          <div 
                            key={ingredienteReceita.ingrediente_id} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{ingredienteReceita.ingrediente.nome}</div>
                              <div className="text-sm text-gray-500">
                                {formatarQuantidade(ingredienteReceita.quantidade, ingredienteReceita.ingrediente.unidade)} · 
                                {formatarMoeda(ingredienteReceita.ingrediente.preco_kg)}/kg
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatarMoeda(custoIngrediente)}</div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {custoCalculadoDetalhado && (
                        <div className="border-t pt-3 mt-4">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total dos ingredientes:</span>
                            <span className="text-lg">
                              {formatarMoeda(
                                ingredientesDetalhada.reduce((acc, ir) => 
                                  acc + ((ir.quantidade / 1000) * ir.ingrediente.preco_kg), 0
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t">
                  <Link href={`/dashboard/calculadora?receita=${receitaDetalhada.id}`}>
                    <Button variant="doce">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcular Preços
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowDetalheModal(false)
                      handleEditReceita(receitaDetalhada)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Receita
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDuplicateReceita(receitaDetalhada)}
                    disabled={!isPro && receitas.length >= 3}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}