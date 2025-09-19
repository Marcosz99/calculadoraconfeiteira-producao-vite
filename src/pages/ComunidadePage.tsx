import React, { useState, useEffect } from 'react'
import { MessageCircle, ThumbsUp, MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface Post {
  id: string
  autor: string
  titulo: string
  conteudo: string
  categoria: 'dica' | 'pergunta' | 'receita' | 'negocio'
  curtidas: number
  comentarios: number
  data: string
  jaInteragiu: boolean
}

export default function ComunidadePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [novoPost, setNovoPost] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'dica' as const
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Dados mock para demonstração
  useEffect(() => {
    const postsMock: Post[] = [
      {
        id: '1',
        autor: 'Maria Silva',
        titulo: 'Dica: Como calcular o preço ideal para brigadeiros gourmet',
        conteudo: 'Pessoal, descobri uma técnica incrível para precificar brigadeiros gourmet! Sempre multiplico o custo dos ingredientes por 3.5 e adiciono R$ 0,50 por unidade de mão de obra. Tem funcionado super bem!',
        categoria: 'dica',
        curtidas: 15,
        comentarios: 8,
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
        comentarios: 12,
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
        comentarios: 15,
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
        comentarios: 23,
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
      autor: user?.nome || 'Usuário',
      titulo: novoPost.titulo,
      conteudo: novoPost.conteudo,
      categoria: novoPost.categoria,
      curtidas: 0,
      comentarios: 0,
      data: new Date().toISOString().split('T')[0],
      jaInteragiu: false
    }

    setPosts([post, ...posts])
    setNovoPost({ titulo: '', conteudo: '', categoria: 'dica' })
    setMostrarFormulario(false)
  }

  const postsFiltrados = filtroCategoria === 'todos' 
    ? posts 
    : posts.filter(post => post.categoria === filtroCategoria)

  const categoriasInfo = {
    dica: { nome: 'Dicas', cor: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    pergunta: { nome: 'Perguntas', cor: 'bg-yellow-100 text-yellow-800', icon: MessageSquare },
    receita: { nome: 'Receitas', cor: 'bg-green-100 text-green-800', icon: MessageCircle },
    negocio: { nome: 'Negócio', cor: 'bg-purple-100 text-purple-800', icon: Users }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Comunidade DoceCalc 👥
          </h1>
          <p className="text-gray-600">
            Conecte-se com outros confeiteiros, compartilhe experiências e aprenda juntos!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-blue-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">1.234</h3>
                <p className="text-gray-600">Confeiteiros ativos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-10 w-10 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">567</h3>
                <p className="text-gray-600">Posts este mês</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <ThumbsUp className="h-10 w-10 text-pink-500" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2.891</h3>
                <p className="text-gray-600">Interações hoje</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

            {/* Lista de Posts */}
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
                    
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button
                        onClick={() => curtirPost(post.id)}
                        className={`flex items-center space-x-2 hover:text-pink-500 transition-colors ${
                          post.jaInteragiu ? 'text-pink-500' : ''
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.curtidas}</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comentarios}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}