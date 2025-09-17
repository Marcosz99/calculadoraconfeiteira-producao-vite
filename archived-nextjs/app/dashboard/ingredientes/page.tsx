'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Scale,
  Eye,
  EyeOff,
  Filter,
  X,
  Save,
  Palette,
  ChefHat
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase-client'
import { formatarMoeda } from '@/lib/calculations-lib'

type Categoria = {
  id: string
  user_id: string
  nome: string
  cor: string
  icone: string
  created_at: string
}

type Ingrediente = {
  id: string
  user_id: string
  nome: string
  categoria_id: string | null
  preco_kg: number
  unidade: 'g' | 'ml' | 'unidades'
  densidade: number
  ativo: boolean
  created_at: string
  updated_at: string
  categoria?: Categoria
}

export default function IngredientesPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  
  // Estados principais
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  
  // Estados do formulário
  const [showForm, setShowForm] = useState(false)
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null)
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    nome: '',
    categoria_id: '',
    preco_kg: 0,
    unidade: 'g' as 'g' | 'ml' | 'unidades',
    densidade: 1,
    ativo: true
  })

  const [categoriaFormData, setCategoriaFormData] = useState({
    nome: '',
    cor: '#3b82f6',
    icone: 'Package'
  })

  const isPro = profile?.plano === 'pro'

  useEffect(() => {
    if (profile?.id) {
      loadCategorias()
      loadIngredientes()
    }
  }, [profile?.id])

  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias_ingredientes')
        .select('*')
        .eq('user_id', profile?.id)
        .order('nome')

      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias de ingredientes.",
        variant: "destructive",
      })
    }
  }

  const loadIngredientes = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .select(`
          *,
          categoria:categorias_ingredientes(*)
        `)
        .eq('user_id', profile?.id)
        .order('nome')

      if (error) throw error

      const ingredientesFormatados = (data || []).map(item => ({
        ...item,
        categoria: item.categoria
      }))

      setIngredientes(ingredientesFormatados)
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error)
      toast({
        title: "Erro ao carregar ingredientes",
        description: "Não foi possível carregar os ingredientes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveIngrediente = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do ingrediente é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (formData.preco_kg <= 0) {
      toast({
        title: "Preço inválido",
        description: "O preço deve ser maior que zero.",
        variant: "destructive",
      })
      return
    }

    // Validar se categoria pertence ao usuário (se categoria foi selecionada)
    if (formData.categoria_id) {
      const categoriaValida = categorias.find(cat => cat.id === formData.categoria_id)
      if (!categoriaValida) {
        toast({
          title: "Categoria inválida",
          description: "A categoria selecionada não existe ou não pertence a você.",
          variant: "destructive",
        })
        return
      }
    }

    try {
      const ingredienteData = {
        ...formData,
        user_id: profile?.id,
        categoria_id: formData.categoria_id || null,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingIngrediente) {
        result = await supabase
          .from('ingredientes')
          .update(ingredienteData)
          .eq('id', editingIngrediente.id)
          .eq('user_id', profile?.id) // Garantir que só pode editar seus próprios ingredientes
          .select()
          .single()
      } else {
        result = await supabase
          .from('ingredientes')
          .insert(ingredienteData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: editingIngrediente ? "Ingrediente atualizado!" : "Ingrediente criado! 🥄",
        description: `${formData.nome} foi ${editingIngrediente ? 'atualizado' : 'criado'} com sucesso.`,
      })

      // Reset form
      setFormData({
        nome: '',
        categoria_id: '',
        preco_kg: 0,
        unidade: 'g',
        densidade: 1,
        ativo: true
      })
      setShowForm(false)
      setEditingIngrediente(null)
      
      // Reload ingredients
      loadIngredientes()

    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error)
      toast({
        title: "Erro ao salvar ingrediente",
        description: "Não foi possível salvar o ingrediente.",
        variant: "destructive",
      })
    }
  }

  const handleSaveCategoria = async () => {
    if (!categoriaFormData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      })
      return
    }

    try {
      const categoriaData = {
        ...categoriaFormData,
        user_id: profile?.id
      }

      let result
      if (editingCategoria) {
        result = await supabase
          .from('categorias_ingredientes')
          .update(categoriaData)
          .eq('id', editingCategoria.id)
          .eq('user_id', profile?.id) // Garantir que só pode editar suas próprias categorias
          .select()
          .single()
      } else {
        result = await supabase
          .from('categorias_ingredientes')
          .insert(categoriaData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: editingCategoria ? "Categoria atualizada!" : "Categoria criada! 🏷️",
        description: `${categoriaFormData.nome} foi ${editingCategoria ? 'atualizada' : 'criada'} com sucesso.`,
      })

      // Reset form
      setCategoriaFormData({
        nome: '',
        cor: '#3b82f6',
        icone: 'Package'
      })
      setShowCategoriaForm(false)
      setEditingCategoria(null)
      
      // Reload categories
      loadCategorias()

    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      toast({
        title: "Erro ao salvar categoria",
        description: "Não foi possível salvar a categoria.",
        variant: "destructive",
      })
    }
  }

  const handleEditIngrediente = (ingrediente: Ingrediente) => {
    setFormData({
      nome: ingrediente.nome,
      categoria_id: ingrediente.categoria_id || '',
      preco_kg: ingrediente.preco_kg,
      unidade: ingrediente.unidade,
      densidade: ingrediente.densidade,
      ativo: ingrediente.ativo
    })
    setEditingIngrediente(ingrediente)
    setShowForm(true)
  }

  const handleEditCategoria = (categoria: Categoria) => {
    setCategoriaFormData({
      nome: categoria.nome,
      cor: categoria.cor,
      icone: categoria.icone
    })
    setEditingCategoria(categoria)
    setShowCategoriaForm(true)
  }

  const handleDeleteIngrediente = async (ingrediente: Ingrediente) => {
    if (!confirm(`Tem certeza que deseja excluir "${ingrediente.nome}"?`)) return

    try {
      // Verificar se o ingrediente está sendo usado em alguma receita
      const { data: receitasUsando, error: checkError } = await supabase
        .from('receita_ingredientes')
        .select(`
          id,
          receita_id,
          receitas!inner(nome, user_id)
        `)
        .eq('ingrediente_id', ingrediente.id)
        .eq('receitas.user_id', profile?.id) // Só verificar receitas do usuário logado
        .limit(1)

      if (checkError) throw checkError

      if (receitasUsando && receitasUsando.length > 0) {
        const nomeReceita = (receitasUsando[0] as any).receitas?.nome
        toast({
          title: "Não é possível excluir",
          description: `Este ingrediente está sendo usado na receita "${nomeReceita}" e outras. Remova-o das receitas primeiro.`,
          variant: "destructive",
        })
        return
      }

      // Se não está sendo usado, pode excluir
      const { error } = await supabase
        .from('ingredientes')
        .delete()
        .eq('id', ingrediente.id)
        .eq('user_id', profile?.id) // Garantir que só pode excluir seus próprios ingredientes

      if (error) throw error

      toast({
        title: "Ingrediente excluído",
        description: `${ingrediente.nome} foi excluído com sucesso.`,
      })

      loadIngredientes()
    } catch (error) {
      console.error('Erro ao excluir ingrediente:', error)
      toast({
        title: "Erro ao excluir ingrediente",
        description: "Não foi possível excluir o ingrediente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleAtivo = async (ingrediente: Ingrediente) => {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .update({ 
          ativo: !ingrediente.ativo,
          updated_at: new Date().toISOString()
        })
        .eq('id', ingrediente.id)
        .eq('user_id', profile?.id) // Garantir que só pode alterar seus próprios ingredientes

      if (error) throw error

      toast({
        title: ingrediente.ativo ? "Ingrediente desativado" : "Ingrediente ativado",
        description: `${ingrediente.nome} foi ${ingrediente.ativo ? 'desativado' : 'ativado'}.`,
      })

      loadIngredientes()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do ingrediente.",
        variant: "destructive",
      })
    }
  }

  // Filter ingredients
  const ingredientesFiltrados = ingredientes.filter(ingrediente => {
    const matchesSearch = ingrediente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = !filterCategoria || ingrediente.categoria_id === filterCategoria
    const matchesActive = showInactive || ingrediente.ativo
    
    return matchesSearch && matchesCategoria && matchesActive
  })

  const getUnidadeLabel = (unidade: string) => {
    switch (unidade) {
      case 'g': return 'Gramas (g)'
      case 'ml': return 'Mililitros (ml)'
      case 'unidades': return 'Unidades'
      default: return unidade
    }
  }

  const getIconForCategoria = (icone: string) => {
    const icons: { [key: string]: any } = {
      Package,
      Tag,
      ChefHat,
      Scale
    }
    const IconComponent = icons[icone] || Package
    return <IconComponent className="h-4 w-4" />
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
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Banco de Ingredientes
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gerencie seus ingredientes, categorias e preços para cálculos precisos
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowForm(true)}
            variant="doce" 
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Ingrediente
          </Button>
          
          <Button 
            onClick={() => setShowCategoriaForm(true)}
            variant="outline" 
            size="lg"
          >
            <Tag className="h-5 w-5 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {/* Formulário de Ingrediente */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingIngrediente ? 'Editar Ingrediente' : 'Novo Ingrediente'}
                  </CardTitle>
                  <CardDescription>
                    {editingIngrediente ? 'Atualize os dados do ingrediente' : 'Adicione um novo ingrediente ao banco de dados'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    setEditingIngrediente(null)
                    setFormData({
                      nome: '',
                      categoria_id: '',
                      preco_kg: 0,
                      unidade: 'g',
                      densidade: 1,
                      ativo: true
                    })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Ingrediente</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Açúcar Cristal"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={formData.categoria_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria_id: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sem categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="preco">Preço por Kg/L (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={formData.preco_kg}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco_kg: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="unidade">Unidade de Medida</Label>
                  <select
                    id="unidade"
                    value={formData.unidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value as any }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="g">Gramas (g)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="unidades">Unidades</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="densidade">Densidade</Label>
                  <Input
                    id="densidade"
                    type="number"
                    value={formData.densidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, densidade: Number(e.target.value) }))}
                    min="0.1"
                    step="0.1"
                    placeholder="1.0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para conversões entre peso e volume (padrão: 1.0)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="ativo" className="text-sm">
                  Ingrediente ativo (disponível para uso)
                </Label>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveIngrediente} variant="doce">
                  <Save className="h-4 w-4 mr-2" />
                  {editingIngrediente ? 'Atualizar Ingrediente' : 'Criar Ingrediente'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowForm(false)
                    setEditingIngrediente(null)
                    setFormData({
                      nome: '',
                      categoria_id: '',
                      preco_kg: 0,
                      unidade: 'g',
                      densidade: 1,
                      ativo: true
                    })
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Categoria */}
        {showCategoriaForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                  </CardTitle>
                  <CardDescription>
                    {editingCategoria ? 'Atualize os dados da categoria' : 'Crie uma nova categoria para organizar ingredientes'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowCategoriaForm(false)
                    setEditingCategoria(null)
                    setCategoriaFormData({
                      nome: '',
                      cor: '#3b82f6',
                      icone: 'Package'
                    })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nomeCategoria">Nome da Categoria</Label>
                  <Input
                    id="nomeCategoria"
                    value={categoriaFormData.nome}
                    onChange={(e) => setCategoriaFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Açúcares"
                  />
                </div>
                <div>
                  <Label htmlFor="cor">Cor</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="cor"
                      value={categoriaFormData.cor}
                      onChange={(e) => setCategoriaFormData(prev => ({ ...prev, cor: e.target.value }))}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={categoriaFormData.cor}
                      onChange={(e) => setCategoriaFormData(prev => ({ ...prev, cor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="icone">Ícone</Label>
                  <select
                    id="icone"
                    value={categoriaFormData.icone}
                    onChange={(e) => setCategoriaFormData(prev => ({ ...prev, icone: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Package">Pacote</option>
                    <option value="Tag">Etiqueta</option>
                    <option value="ChefHat">Chef</option>
                    <option value="Scale">Balança</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveCategoria} variant="doce">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCategoria ? 'Atualizar Categoria' : 'Criar Categoria'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowCategoriaForm(false)
                    setEditingCategoria(null)
                    setCategoriaFormData({
                      nome: '',
                      cor: '#3b82f6',
                      icone: 'Package'
                    })
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar ingredientes..."
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
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showInactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="showInactive" className="text-sm">
                  Mostrar inativos
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ingredientes */}
        {ingredientes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum ingrediente encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando seus primeiros ingredientes para usar nas receitas.
              </p>
              <Button onClick={() => setShowForm(true)} variant="doce">
                <Plus className="h-5 w-5 mr-2" />
                Criar Primeiro Ingrediente
              </Button>
            </CardContent>
          </Card>
        ) : ingredientesFiltrados.length === 0 ? (
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
            {ingredientesFiltrados.map((ingrediente) => (
              <Card key={ingrediente.id} className={`hover:shadow-lg transition-shadow ${!ingrediente.ativo ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center space-x-2">
                        <span>{ingrediente.nome}</span>
                        {!ingrediente.ativo && (
                          <Badge variant="outline" className="text-xs text-red-600">
                            Inativo
                          </Badge>
                        )}
                      </CardTitle>
                      
                      {ingrediente.categoria && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{ backgroundColor: ingrediente.categoria.cor }}
                          >
                            {getIconForCategoria(ingrediente.categoria.icone)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {ingrediente.categoria.nome}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-medium">{formatarMoeda(ingrediente.preco_kg)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unidade:</span>
                      <span className="font-medium">{getUnidadeLabel(ingrediente.unidade)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Densidade:</span>
                      <span className="font-medium">{ingrediente.densidade}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditIngrediente(ingrediente)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleAtivo(ingrediente)}
                    >
                      {ingrediente.ativo ? (
                        <EyeOff className="h-4 w-4 mr-1" />
                      ) : (
                        <Eye className="h-4 w-4 mr-1" />
                      )}
                      {ingrediente.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteIngrediente(ingrediente)}
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
      </div>
    </div>
  )
}