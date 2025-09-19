import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Store, Settings, Share2, QrCode, Eye, Plus, Image, Save, ArrowLeft, ExternalLink } from 'lucide-react'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { Receita, ProdutoCatalogo, DadosConfeitaria } from '../types'
import QRCodeGenerator from '../components/QRCodeGenerator'

export default function MeuCatalogoPage() {
  const { user, profile, updatePerfil } = useAuth()
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [produtosCatalogo, setProdutosCatalogo] = useState<ProdutoCatalogo[]>([])
  const [dadosConfeitaria, setDadosConfeitaria] = useState<DadosConfeitaria>({
    nomeFantasia: '',
    whatsapp: '',
    instagram: '',
    endereco: '',
    descricao: ''
  })
  const [catalogoAtivo, setCatalogoAtivo] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [loading, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      // Carrega receitas usando a chave correta do localStorage
      const receitasData = getFromLocalStorage<Receita[]>('doce_receitas', [])
        .filter(r => r.usuario_id === user.id && r.ativo)
      
      const produtosData = getFromLocalStorage<ProdutoCatalogo[]>(`produtos_catalogo_${user.id}`, [])
      const confeitariaData = getFromLocalStorage<DadosConfeitaria>(`dados_confeitaria_${user.id}`, {
        nomeFantasia: profile?.nome || '',
        whatsapp: '',
        instagram: '',
        endereco: '',
        descricao: ''
      })
      
      setReceitas(receitasData)
      setProdutosCatalogo(produtosData)
      setDadosConfeitaria(confeitariaData)
      setCatalogoAtivo(false)
    }
  }, [user])

  const handleToggleReceita = (receita: Receita) => {
    const produtoExiste = produtosCatalogo.find(p => p.receita_id === receita.id)
    
    if (produtoExiste) {
      // Remove do catálogo
      const novosProdutos = produtosCatalogo.filter(p => p.receita_id !== receita.id)
      setProdutosCatalogo(novosProdutos)
    } else {
      // Adiciona ao catálogo
      const novoProduto: ProdutoCatalogo = {
        id: `produto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        receita_id: receita.id,
        nome: receita.nome,
        preco_publico: receita.preco_sugerido || 0,
        descricao_publica: receita.descricao,
        categoria: receita.categoria_id,
        serve: receita.rendimento,
        prazo_entrega: '24 horas',
        ativo: true,
        personalizavel: false,
        criado_em: new Date().toISOString()
      }
      setProdutosCatalogo([...produtosCatalogo, novoProduto])
    }
  }

  const handleUpdateProduto = (produtoId: string, campo: string, valor: any) => {
    const produtosAtualizados = produtosCatalogo.map(p => 
      p.id === produtoId ? { ...p, [campo]: valor } : p
    )
    setProdutosCatalogo(produtosAtualizados)
  }

  const salvarCatalogo = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      // Salva dados no localStorage
      saveToLocalStorage(`produtos_catalogo_${user.id}`, produtosCatalogo)
      saveToLocalStorage(`dados_confeitaria_${user.id}`, dadosConfeitaria)
      
      // Atualiza dados do usuário no localStorage
      const urlCatalogo = `${window.location.origin}/catalogo/${user.id}`
      const userAtualizado = {
        ...user,
        catalogo_ativo: catalogoAtivo,
        url_catalogo: urlCatalogo,
        dados_confeitaria: dadosConfeitaria
      }
      saveToLocalStorage(`user_${user.id}`, userAtualizado)
      
      alert('Catálogo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar catálogo:', error)
      alert('Erro ao salvar catálogo')
    } finally {
      setSaving(false)
    }
  }

  const copiarLink = () => {
    const link = `${window.location.origin}/catalogo/${user?.id}`
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  const produtosNoCatalogo = produtosCatalogo.filter(p => p.ativo)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Store className="h-8 w-8 text-blue-600" />
                  <span>Meu Catálogo</span>
                </h1>
                <p className="text-gray-600 mt-2">Configure seu catálogo público para receber encomendas online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={copiarLink}
                className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Copiar Link</span>
              </button>
              
              <button
                onClick={() => setShowQRCode(true)}
                className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </button>
              
              <Link
                to={`/catalogo/${user?.id}`}
                target="_blank"
                className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visualizar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Em Breve */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Store className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catálogo Online</h2>
            <p className="text-xl text-gray-600 mb-2">Em breve!</p>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos preparando uma funcionalidade incrível para você criar e gerenciar seu catálogo online de produtos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}