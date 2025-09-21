import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ThumbsUp, MessageSquare, Users, Calendar, TrendingUp, Search, Send, Heart, Bookmark, Share2, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ReceitaCompartilhada, ComentarioReceita, Receita } from '../types'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'

interface Comentario {
  id: string
  autor: string
  conteudo: string
  data: string
}

interface Post {
  id: string
  autor: string
  titulo: string
  conteudo: string
  categoria: 'dica' | 'pergunta' | 'receita' | 'negocio'
  curtidas: number
  comentarios: Comentario[]
  data: string
  jaInteragiu: boolean
}

export default function ComunidadePage() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [termoPesquisa, setTermoPesquisa] = useState<string>('')
  const [novoPost, setNovoPost] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'dica' as const
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [comentariosVisiveis, setComentariosVisiveis] = useState<{[key: string]: boolean}>({})
  const [novoComentario, setNovoComentario] = useState<{[key: string]: string}>({})
  
  // FASE 6: Estados para receitas compartilhadas
  const [receitasCompartilhadas, setReceitasCompartilhadas] = useState<ReceitaCompartilhada[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [visualizacao, setVisualizacao] = useState<'posts' | 'receitas'>('posts')

  // Carregar dados
  useEffect(() => {
    // Carregar receitas compartilhadas
    const savedReceitasCompartilhadas = getFromLocalStorage<ReceitaCompartilhada[]>('receitas_compartilhadas', [])
    const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
    setReceitasCompartilhadas(savedReceitasCompartilhadas.filter(rc => rc.ativo))
    setReceitas(savedReceitas)

    // Dados mock para demonstração dos posts
    const postsMock: Post[] = [
      {
        id: '1',
        autor: 'Maria Silva',
        titulo: 'Dica: Como calcular o preço ideal para brigadeiros gourmet',
        conteudo: 'Pessoal, descobri uma técnica incrível para precificar brigadeiros gourmet! Sempre multiplico o custo dos ingredientes por 3.5 e adiciono R$ 0,50 por unidade de mão de obra. Tem funcionado super bem!',
        categoria: 'dica',
        curtidas: 15,
        comentarios: [
          {
            id: '1-1',
            autor: 'Pedro Santos',
            conteudo: 'Ótima dica! Vou testar na minha confeitaria.',
            data: '2025-09-18'
          },
          {
            id: '1-2',
            autor: 'Ana Costa',
            conteudo: 'Funcionou comigo também! Obrigada por compartilhar.',
            data: '2025-09-18'
          }
        ],
        data: '2025-09-18',
        jaInteragiu: false
      },
      {
        id: '2',
        autor: 'Ana Costa',
        titulo: 'Ajuda: Massa de bolo murcha depois de assada',
        conteudo: 'Gente, preciso de ajuda! Minha massa de bolo fica linda no forno, mas depois murcha. Já tentei várias receitas e sempre acontece isso. Alguém tem alguma dica?',
        categoria: 'pergunta',
        curtidas: 3,
        comentarios: [
          {
            id: '2-1',
            autor: 'João',
            conteudo: 'Pode ser excesso de fermento ou abertura do forno antes da hora. Deixa assar uns 40min sem abrir!',
            data: '2025-09-17'
          }
        ],
        data: '2025-09-17',
        jaInteragiu: false
      },
      {
        id: '3',
        autor: 'João Santos',
        titulo: 'Receita: Brownie que nunca falha',
        conteudo: 'Compartilhando com vocês minha receita secreta de brownie! 200g chocolate meio amargo, 100g manteiga, 2 ovos, 100g açúcar cristal, 50g farinha. Assa 180°C por 25min. Sucesso garantido!',
        categoria: 'receita',
        curtidas: 28,
        comentarios: [],
        data: '2025-09-16',
        jaInteragiu: true
      },
      {
        id: '4',
        autor: 'Carla Lima',
        titulo: 'Negócio: Como aumentei minhas vendas em 300%',
        conteudo: 'Pessoal, quero compartilhar minha estratégia que triplicou minhas vendas em 6 meses: focar em nichos específicos (casamentos), criar pacotes, usar redes sociais estrategicamente e sempre entregar mais que o esperado!',
        categoria: 'negocio',
        curtidas: 42,
        comentarios: [],
        data: '2025-09-15',
        jaInteragiu: false
      }
    ]
    setPosts(postsMock)
  }, [])

  const curtirPost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            curtidas: post.jaInteragiu ? post.curtidas - 1 : post.curtidas + 1,
            jaInteragiu: !post.jaInteragiu 
          }
        : post
    ))
  }

  const criarPost = () => {
    if (!novoPost.titulo.trim() || !novoPost.conteudo.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      autor: profile?.nome || 'Usuário',
      titulo: novoPost.titulo,
      conteudo: novoPost.conteudo,
      categoria: novoPost.categoria,
      curtidas: 0,
      comentarios: [],
      data: new Date().toISOString().split('T')[0],
      jaInteragiu: false
    }

    setPosts([post, ...posts])
    setNovoPost({ titulo: '', conteudo: '', categoria: 'dica' })
    setMostrarFormulario(false)
  }

  const adicionarComentario = (postId: string) => {
    const comentarioTexto = novoComentario[postId]?.trim()
    if (!comentarioTexto || !user) return

    const primeiroNome = profile?.nome?.split(' ')[0] || 'Usuário'
    
    const comentario: Comentario = {
      id: Date.now().toString(),
      autor: primeiroNome,
      conteudo: comentarioTexto,
      data: new Date().toISOString().split('T')[0]
    }

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comentarios: [...post.comentarios, comentario] }
        : post
    ))

    setNovoComentario({ ...novoComentario, [postId]: '' })
  }

  const toggleComentarios = (postId: string) => {
    setComentariosVisiveis({
      ...comentariosVisiveis,
      [postId]: !comentariosVisiveis[postId]
    })
  }

  // FASE 6: Funções para receitas compartilhadas
  const curtirReceita = (receitaId: string) => {
    if (!user) return

    const updatedReceitas = receitasCompartilhadas.map(receita => 
      receita.id === receitaId 
        ? { ...receita, curtidas: receita.curtidas + 1 }
        : receita
    )
    setReceitasCompartilhadas(updatedReceitas)
    saveToLocalStorage('receitas_compartilhadas', updatedReceitas)
  }

  const salvarReceita = (receitaCompartilhada: ReceitaCompartilhada) => {
    if (!user) return
    
    // Encontrar a receita original
    const receitaOriginal = receitas.find(r => r.id === receitaCompartilhada.receita_id)
    if (!receitaOriginal) return

    // Criar cópia da receita para o usuário atual
    const novaReceita: Receita = {
      ...receitaOriginal,
      id: Date.now().toString(),
      usuario_id: user.id,
      nome: `${receitaOriginal.nome} (da comunidade)`,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }

    // Salvar receita no localStorage do usuário
    const todasReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
    saveToLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, [...todasReceitas, novaReceita])

    // Atualizar salvamentos da receita compartilhada
    const updatedReceitas = receitasCompartilhadas.map(receita => 
      receita.id === receitaCompartilhada.id 
        ? { ...receita, salvamentos: receita.salvamentos + 1 }
        : receita
    )
    setReceitasCompartilhadas(updatedReceitas)
    saveToLocalStorage('receitas_compartilhadas', updatedReceitas)

    alert('✅ Receita adicionada às suas receitas!')
  }

  const comentarReceita = (receitaId: string, comentario: string) => {
    if (!user || !comentario.trim()) return

    const novoComentario: ComentarioReceita = {
      id: Date.now().toString(),
      receita_compartilhada_id: receitaId,
      usuario_id: user.id,
      autor_nome: profile?.nome || user.email?.split('@')[0] || 'Confeiteiro',
      conteudo: comentario.trim(),
      data: new Date().toISOString(),
      curtidas: 0
    }

    const updatedReceitas = receitasCompartilhadas.map(receita => 
      receita.id === receitaId 
        ? { ...receita, comentarios: [...receita.comentarios, novoComentario] }
        : receita
    )
    setReceitasCompartilhadas(updatedReceitas)
    saveToLocalStorage('receitas_compartilhadas', updatedReceitas)
  }

  const getReceitaOriginal = (receitaId: string): Receita | undefined => {
    return receitas.find(r => r.id === receitaId)
  }

  // Filtrar posts por categoria e termo de pesquisa
  let postsFiltrados = posts
  
  if (filtroCategoria !== 'todos') {
    postsFiltrados = postsFiltrados.filter(post => post.categoria === filtroCategoria)
  }
  
  if (termoPesquisa.trim()) {
    postsFiltrados = postsFiltrados.filter(post => 
      post.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      post.conteudo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      post.autor.toLowerCase().includes(termoPesquisa.toLowerCase())
    )
  }

  const categoriasInfo = {
    dica: { nome: 'Dicas', cor: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    pergunta: { nome: 'Perguntas', cor: 'bg-yellow-100 text-yellow-800', icon: MessageSquare },
    receita: { nome: 'Receitas', cor: 'bg-green-100 text-green-800', icon: MessageCircle },
    negocio: { nome: 'Negócio', cor: 'bg-purple-100 text-purple-800', icon: Users }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 lg:mb-2">
                Comunidade DoceCalc 👥
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Conecte-se com outros confeiteiros, compartilhe experiências e aprenda juntos!
              </p>
            </div>
          </div>
        </div>

        {/* FASE 6: Navegação - Posts vs Receitas Compartilhadas */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => setVisualizacao('posts')}
                className={`flex-1 py-3 px-6 rounded-md transition-colors text-sm font-medium ${
                  visualizacao === 'posts'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                💬 Posts da Comunidade
              </button>
              <button
                onClick={() => setVisualizacao('receitas')}
                className={`flex-1 py-3 px-6 rounded-md transition-colors text-sm font-medium ${
                  visualizacao === 'receitas'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                🍰 Receitas Compartilhadas ({receitasCompartilhadas.length})
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-blue-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 filter blur-sm select-none">1.234</h3>
                <p className="text-gray-600">Confeiteiros ativos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-10 w-10 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 filter blur-sm select-none">567</h3>
                <p className="text-gray-600">Posts este mês</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <ThumbsUp className="h-10 w-10 text-pink-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 filter blur-sm select-none">2.891</h3>
                <p className="text-gray-600">Interações hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-6 lg:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 lg:h-5 lg:w-5" />
            <input
              type="text"
              placeholder="Pesquisar posts, autores ou conteúdo..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="w-full pl-10 pr-4 py-2 lg:py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filtros e Novo Post */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFiltroCategoria('todos')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filtroCategoria === 'todos' ? 'bg-pink-100 text-pink-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Todos os posts
                </button>
                {Object.entries(categoriasInfo).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setFiltroCategoria(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filtroCategoria === key ? 'bg-pink-100 text-pink-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    {info.nome}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              + Criar Novo Post
            </button>
          </div>

          {/* Posts */}
          <div className="lg:col-span-3">
            {/* Formulário de Novo Post */}
            {mostrarFormulario && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Novo Post</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={novoPost.categoria}
                      onChange={(e) => setNovoPost({...novoPost, categoria: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="dica">Dica</option>
                      <option value="pergunta">Pergunta</option>
                      <option value="receita">Receita</option>
                      <option value="negocio">Negócio</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={novoPost.titulo}
                      onChange={(e) => setNovoPost({...novoPost, titulo: e.target.value})}
                      placeholder="Digite o título do seu post..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={novoPost.conteudo}
                      onChange={(e) => setNovoPost({...novoPost, conteudo: e.target.value})}
                      placeholder="Compartilhe seu conhecimento com a comunidade..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={criarPost}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() => setMostrarFormulario(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FASE 6: Conteúdo Condicional - Posts ou Receitas */}
            {visualizacao === 'posts' ? (
              /* Lista de Posts */
              <div className="space-y-6">
                {postsFiltrados.map((post) => {
                const categoriaInfo = categoriasInfo[post.categoria]
                const IconeCategoria = categoriaInfo.icon
                
                return (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-600 font-semibold">
                            {post.autor.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{post.autor}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${categoriaInfo.cor}`}>
                              {categoriaInfo.nome}
                            </span>
                            <span className="text-gray-500 text-sm">{post.data}</span>
                          </div>
                        </div>
                      </div>
                      <IconeCategoria className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.titulo}</h3>
                    <p className="text-gray-700 mb-4">{post.conteudo}</p>
                    
                    <div className="flex items-center space-x-6 text-gray-500 border-t pt-4">
                      <button
                        onClick={() => curtirPost(post.id)}
                        className={`flex items-center space-x-2 hover:text-pink-500 transition-colors ${
                          post.jaInteragiu ? 'text-pink-500' : ''
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.curtidas}</span>
                      </button>
                      
                      <button
                        onClick={() => toggleComentarios(post.id)}
                        className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comentarios.length} respostas</span>
                      </button>
                    </div>

                    {/* Comentários */}
                    {comentariosVisiveis[post.id] && (
                      <div className="mt-4 border-t pt-4">
                        {/* Lista de comentários */}
                        {post.comentarios.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {post.comentarios.map((comentario) => (
                              <div key={comentario.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                                    <span className="text-pink-600 font-semibold text-xs">
                                      {comentario.autor.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-900 text-sm">{comentario.autor}</span>
                                  <span className="text-gray-500 text-xs">{comentario.data}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comentario.conteudo}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formulário para novo comentário */}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 font-semibold text-sm">
                              {profile?.nome ? profile.nome.split(' ')[0].charAt(0) : 'U'}
                            </span>
                          </div>
                          <div className="flex-1 flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Escreva uma resposta..."
                              value={novoComentario[post.id] || ''}
                              onChange={(e) => setNovoComentario({
                                ...novoComentario,
                                [post.id]: e.target.value
                              })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  adicionarComentario(post.id)
                                }
                              }}
                            />
                            <button
                              onClick={() => adicionarComentario(post.id)}
                              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-md transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            ) : (
              /* FASE 6: Feed de Receitas Compartilhadas - Estilo Instagram */
              <div className="space-y-6">
                {receitasCompartilhadas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍰</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma receita compartilhada ainda</h3>
                    <p className="text-gray-500 mb-4">Seja o primeiro a compartilhar uma receita com a comunidade!</p>
                    <p className="text-sm text-gray-400">Vá em "Receitas" → clique no ícone de compartilhar ao lado de suas receitas</p>
                  </div>
                ) : (
                  receitasCompartilhadas.map((receitaCompartilhada) => {
                    const receitaOriginal = getReceitaOriginal(receitaCompartilhada.receita_id)
                    if (!receitaOriginal) return null

                    return (
                      <div key={receitaCompartilhada.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Header do Post */}
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {receitaCompartilhada.autor_nome.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{receitaCompartilhada.autor_nome}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(receitaCompartilhada.data_compartilhamento).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-pink-500">
                            <Share2 className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Imagem da Receita */}
                        <div className="h-80 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center relative">
                          {receitaOriginal.foto_principal ? (
                            <img 
                              src={receitaOriginal.foto_principal} 
                              alt={receitaOriginal.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-8xl mb-4">🍰</div>
                              <p className="text-gray-600 text-lg font-medium">{receitaOriginal.nome}</p>
                            </div>
                          )}
                          
                          {/* Overlay com info da receita */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="text-xl font-bold mb-1">{receitaOriginal.nome}</h3>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{receitaOriginal.tempo_preparo_mins}min</span>
                              </div>
                              <span>•</span>
                              <span>{receitaOriginal.rendimento}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => curtirReceita(receitaCompartilhada.id)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors"
                              >
                                <Heart className="h-6 w-6" />
                                <span className="font-medium">{receitaCompartilhada.curtidas}</span>
                              </button>
                              
                              <button
                                onClick={() => toggleComentarios(`receita-${receitaCompartilhada.id}`)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="h-6 w-6" />
                                <span className="font-medium">{receitaCompartilhada.comentarios.length}</span>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => salvarReceita(receitaCompartilhada)}
                              className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                            >
                              <Bookmark className="h-4 w-4" />
                              <span className="text-sm font-medium">Salvar Receita</span>
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">{receitaCompartilhada.curtidas} curtidas</span>
                            {receitaCompartilhada.salvamentos > 0 && (
                              <span className="ml-2">{receitaCompartilhada.salvamentos} salvamentos</span>
                            )}
                          </div>

                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{receitaCompartilhada.autor_nome}</span>
                            <span className="ml-2">{receitaOriginal.descricao || "Receita deliciosa compartilhada pela comunidade!"}</span>
                          </div>

                          {/* Tags */}
                          {receitaOriginal.tags && receitaOriginal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {receitaOriginal.tags.slice(0, 5).map(tag => (
                                <span key={tag} className="text-blue-600 text-sm">#{tag}</span>
                              ))}
                            </div>
                          )}

                          {/* Seção de Comentários */}
                          {comentariosVisiveis[`receita-${receitaCompartilhada.id}`] && (
                            <div className="border-t mt-4 pt-4">
                              {receitaCompartilhada.comentarios.length > 0 && (
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                  {receitaCompartilhada.comentarios.map((comentario) => (
                                    <div key={comentario.id} className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-xs">
                                          {comentario.autor_nome.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-sm">{comentario.autor_nome}</span>
                                          <span className="text-gray-500 text-xs">
                                            {new Date(comentario.data).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">{comentario.conteudo}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Adicionar comentário */}
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">
                                    {profile?.nome?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="flex-1 flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Adicione um comentário..."
                                    value={novoComentario[`receita-${receitaCompartilhada.id}`] || ''}
                                    onChange={(e) => setNovoComentario({
                                      ...novoComentario,
                                      [`receita-${receitaCompartilhada.id}`]: e.target.value
                                    })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        comentarReceita(receitaCompartilhada.id, novoComentario[`receita-${receitaCompartilhada.id}`])
                                        setNovoComentario({...novoComentario, [`receita-${receitaCompartilhada.id}`]: ''})
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      comentarReceita(receitaCompartilhada.id, novoComentario[`receita-${receitaCompartilhada.id}`])
                                      setNovoComentario({...novoComentario, [`receita-${receitaCompartilhada.id}`]: ''})
                                    }}
                                    className="text-pink-500 hover:text-pink-600 transition-colors"
                                  >
                                    <Send className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}