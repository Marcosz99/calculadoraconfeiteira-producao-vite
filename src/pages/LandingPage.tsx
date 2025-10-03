import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PixelService } from '../services/pixelService'
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Cake,
  PieChart,
  FileText,
  Zap,
  Star,
  Users,
  Play,
  Check,
  Menu,
  X,
  AlertTriangle,
  Shield,
  Target,
  Crown,
  Sparkles,
  Bot,
  Store,
  BookOpen,
  BarChart3,
  Lightbulb,
  Heart,
  Download,
  Gift
} from 'lucide-react'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const depoimentos = [
    {
      nome: "Maria Silva",
      cidade: "São Paulo - SP",
      foto: "👩",
      depoimento: "Comecei fazendo bolo de pote em casa. Com as receitas do ebook já faturei R$ 980 no primeiro mês só vendendo pros vizinhos!",
      resultado: "R$ 980 no primeiro mês"
    },
    {
      nome: "Juliana Costa",
      cidade: "Rio de Janeiro - RJ", 
      foto: "👩‍🦰",
      depoimento: "Achei que ia ser difícil, mas as receitas são simples demais! Fiz o de Ninho e já vendi 45 potes. Minha renda extra chegou!",
      resultado: "45 potes vendidos"
    },
    {
      nome: "Ana Paula",
      cidade: "Belo Horizonte - MG",
      foto: "👩‍🦱",
      depoimento: "O bolo de Ferrero Rocher é meu favorito. Cobro R$ 15 cada e sempre falta. Consegui pagar minhas contas com a renda extra!",
      resultado: "R$ 1.200/mês de renda extra"
    }
  ]

  useEffect(() => {
    PixelService.trackViewContent()
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % depoimentos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleComprarClick = () => {
    PixelService.trackLead()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Cake className="h-8 w-8 text-pink-500" />
              <Heart className="h-4 w-4 text-red-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#receitas" className="text-gray-600 hover:text-pink-500 transition-colors">
              Receitas
            </a>
            <a href="#depoimentos" className="text-gray-600 hover:text-pink-500 transition-colors">
              Depoimentos
            </a>
            <a href="#garantia" className="text-gray-600 hover:text-pink-500 transition-colors">
              Garantia
            </a>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center">
            <a
              href="https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"
              onClick={handleComprarClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold"
            >
              QUERO AS RECEITAS
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#receitas" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Receitas
              </a>
              <a 
                href="#depoimentos" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Depoimentos
              </a>
              <a 
                href="#garantia" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Garantia
              </a>
              <div className="border-t pt-4">
                <a
                  href="https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"
                  className="block text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  QUERO AS RECEITAS
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20"></div>
        <div className="container mx-auto text-center max-w-5xl relative">
          
          <div className="mb-6">
            <div className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-black animate-pulse">
              🔥 OFERTA POR TEMPO LIMITADO
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Aprenda a Fazer Bolos de Pote
            <span className="block text-transparent bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text"> Que Vendem Só Pela Imagem</span>
          </h1>
          
          <p className="text-2xl sm:text-3xl text-gray-800 mb-4 font-bold">
            E Ganhe de R$ 800 a R$ 1.500 Extras Por Mês
          </p>

          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-pink-600">15 receitas completas</strong> de bolos de pote irresistíveis.
            <strong className="text-purple-600"> Poucos ingredientes, sem complicação, lucro garantido</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"
              onClick={handleComprarClick}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-lg text-xl font-black hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Download className="h-6 w-6" />
              <span>QUERO RECEBER MINHAS RECEITAS</span>
              <ArrowRight className="h-6 w-6" />
            </a>
          </div>

          <div className="flex justify-center items-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-black text-green-600">R$ 29</div>
              <div className="text-sm text-gray-600">Pagamento único</div>
            </div>
            <div className="text-2xl text-gray-400">•</div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">Acesso imediato</div>
              <div className="text-sm text-gray-600">Receba em 2 minutos</div>
            </div>
          </div>

          {/* Preview do que vem no Ebook */}
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border-4 border-pink-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">O Que Você Vai Receber Hoje:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border-2 border-pink-200">
                <div className="text-5xl mb-3">🍫</div>
                <h4 className="font-black text-gray-900 mb-2">5 Clássicos</h4>
                <p className="text-sm text-gray-700">Chocolate, Ninho, Prestígio, Morango, Limão</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                <div className="text-5xl mb-3">👑</div>
                <h4 className="font-black text-gray-900 mb-2">5 Gourmet</h4>
                <p className="text-sm text-gray-700">Ferrero, Oreo, Kinder, Bis, Nutella</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                <div className="text-5xl mb-3">🎉</div>
                <h4 className="font-black text-gray-900 mb-2">5 Especiais</h4>
                <p className="text-sm text-gray-700">Páscoa, Natal, Festas e mais</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border-2 border-yellow-300">
              <h4 className="font-black text-gray-900 mb-4 text-xl">🎁 BÔNUS EXCLUSIVOS:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-gray-800">Calculadora de preços em PDF</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-gray-800">Tabela de compra de ingredientes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-gray-800">Guia de validade e conservação</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-gray-800">Acesso à comunidade exclusiva</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Que Funciona */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Por Que Bolo de Pote Vende Tanto?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Imagina essa colher entrando no potinho... é por isso que todo mundo quer!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center border-2 border-pink-200 hover:scale-105 transition-all">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Vende Pela Imagem</h3>
              <p className="text-gray-700">Só de olhar a foto, seus clientes já vão querer 2, 3, 4 potes</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 text-center border-2 border-purple-200 hover:scale-105 transition-all">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Lucro Alto</h3>
              <p className="text-gray-700">Venda cada pote por R$ 12-18. Custo baixo, margem boa</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 text-center border-2 border-orange-200 hover:scale-105 transition-all">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Fácil de Fazer</h3>
              <p className="text-gray-700">Receitas simples. Mesmo iniciante consegue fazer e vender</p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-black mb-4">💵 FAÇA AS CONTAS:</h3>
            <div className="bg-white/20 rounded-lg p-6 mb-4">
              <p className="text-xl font-bold mb-2">Se você vender apenas 10 potes por semana a R$ 15:</p>
              <p className="text-3xl font-black text-yellow-300">R$ 600/mês de renda extra</p>
            </div>
            <p className="text-lg">E isso é só o começo. Muitas clientes fazem o dobro ou triplo!</p>
          </div>
        </div>
      </section>

      {/* Receitas Detalhadas */}
      <section id="receitas" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              15 Receitas Completas
              <span className="block text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                Passo a Passo, Sem Segredos
              </span>
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Clássicos */}
            <div className="mb-12">
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">🍫 5 CLÁSSICOS QUE SEMPRE VENDEM</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Chocolate', 'Ninho', 'Prestígio', 'Morango', 'Limão'].map((receita, index) => (
                  <div key={index} className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border-2 border-pink-200 text-center">
                    <div className="text-4xl mb-3">🍰</div>
                    <h4 className="font-black text-gray-900">{receita}</h4>
                    <p className="text-xs text-gray-600 mt-2">Venda: R$ 12-15</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gourmet */}
            <div className="mb-12">
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">👑 5 GOURMET DE ALTA MARGEM</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Ferrero Rocher', 'Oreo', 'Kinder', 'Bis', 'Nutella'].map((receita, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200 text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <h4 className="font-black text-gray-900 text-sm">{receita}</h4>
                    <p className="text-xs text-gray-600 mt-2">Venda: R$ 15-18</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Especiais */}
            <div className="mb-12">
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">🎉 5 ESPECIAIS PARA DATAS</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Páscoa', 'Natal', 'Dia das Mães', 'Festas', 'Casamentos'].map((receita, index) => (
                  <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200 text-center">
                    <div className="text-4xl mb-3">🎊</div>
                    <h4 className="font-black text-gray-900 text-sm">{receita}</h4>
                    <p className="text-xs text-gray-600 mt-2">Venda: R$ 18-22</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-8 border-4 border-yellow-300">
              <h3 className="text-2xl font-black text-center text-gray-900 mb-4">✅ CADA RECEITA INCLUI:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-800">Passo a passo detalhado com fotos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-800">Lista completa de ingredientes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-800">Cálculo de custo e preço sugerido</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-800">Dicas de montagem e apresentação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Mulheres Como Você
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Já Estão Ganhando Renda Extra
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative">
              <div className="text-6xl mb-4">{depoimentos[currentTestimonial].foto}</div>
              
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{depoimentos[currentTestimonial].depoimento}"
              </blockquote>
              
              <div className="mb-4">
                <h4 className="text-lg font-black text-gray-900">{depoimentos[currentTestimonial].nome}</h4>
                <p className="text-gray-600">{depoimentos[currentTestimonial].cidade}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-green-700 font-black">
                  💰 {depoimentos[currentTestimonial].resultado}
                </p>
              </div>
              
              <div className="flex justify-center space-x-2 mt-8">
                {depoimentos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial 
                        ? 'bg-purple-500 w-8' 
                        : 'bg-gray-300 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full text-sm font-black animate-pulse mb-6">
                ⚡ OFERTA ESPECIAL DE LANÇAMENTO
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-black mb-6">
                Comece Hoje Mesmo
                <span className="block text-yellow-300">Por Apenas R$ 29</span>
              </h2>

              <p className="text-2xl mb-8 opacity-90">
                Valor real: <span className="line-through">R$ 147</span>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-black mb-6">🎁 VOCÊ RECEBE TUDO ISSO:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">15 receitas completas de bolo de pote</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">Calculadora de preços em PDF</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">Tabela de compra de ingredientes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">Guia de validade e conservação</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">Acesso à comunidade exclusiva</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-semibold">Suporte para tirar dúvidas</span>
                </div>
              </div>

              <div className="bg-green-500 text-white p-6 rounded-xl">
                <p className="text-2xl font-black mb-2">💰 POTENCIAL DE GANHO:</p>
                <p className="text-3xl font-black">R$ 800 a R$ 1.500/mês</p>
              </div>
            </div>

            <a
              href="https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"
              onClick={handleComprarClick}
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover:scale-105 transition-all duration-200 mb-6"
            >
              <Download className="h-8 w-8" />
              <span>QUERO MINHAS RECEITAS AGORA</span>
              <ArrowRight className="h-8 w-8" />
            </a>

            <div className="text-lg space-y-2 opacity-90">
              <p>✓ Acesso imediato após o pagamento</p>
              <p>✓ Receba tudo por email em até 2 minutos</p>
              <p>✓ Garantia de 7 dias - risco zero</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section id="garantia" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
                <Shield className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                Garantia Incondicional de 7 Dias
              </h2>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Você tem <strong className="text-green-600">7 dias completos</strong> para testar todas as receitas. 
                Se você não gostar por QUALQUER motivo, devolvemos 100% do seu dinheiro. 
                <strong> Sem perguntas, sem burocracia.</strong>
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Como Funciona:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                    <span className="text-3xl font-black text-green-600">1</span>
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">Compre Agora</h4>
                  <p className="text-gray-700 text-sm">Acesso imediato a todas as 15 receitas + bônus</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                    <span className="text-3xl font-black text-blue-600">2</span>
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">Teste 7 Dias</h4>
                  <p className="text-gray-700 text-sm">Faça as receitas, venda, veja os resultados</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                    <span className="text-3xl font-black text-purple-600">3</span>
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">Satisfação Total</h4>
                  <p className="text-gray-700 text-sm">Não gostou? Email para nós e devolvemos tudo</p>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-xl p-6 border-2 border-green-300">
                <p className="text-lg text-gray-800">
                  <strong className="text-green-600">O risco é todo nosso.</strong> Você só ganha: 
                  ou fatura sua renda extra, ou recebe seu dinheiro de volta. Simples assim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-center text-gray-900 mb-12">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>🤔 Nunca fiz bolo de pote. Vou conseguir?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  <strong>SIM!</strong> As receitas são feitas para iniciantes. Tudo é explicado passo a passo, com fotos e medidas exatas. 
                  Se você consegue fazer um bolo comum, vai conseguir fazer bolo de pote. É até mais fácil!
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>⏰ Quanto tempo leva para começar a vender?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Você pode fazer sua primeira receita <strong>hoje mesmo</strong> e vender amanhã. 
                  Os ingredientes são simples e você encontra em qualquer supermercado. Muitas clientes fazem e vendem no mesmo dia!
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>💰 Vou realmente ganhar R$ 800-1.500/mês?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Depende de você! Se vender 10 potes por semana a R$ 15, são R$ 600/mês. 
                  Se vender 20 potes, são R$ 1.200/mês. <strong>O potencial está nas suas mãos.</strong> 
                  As receitas vendem sozinhas - você só precisa fazer e divulgar.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>📱 Como vou receber o ebook?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Após o pagamento, você recebe <strong>tudo por email em até 2 minutos</strong>. 
                  Pode abrir no celular, computador ou tablet. É um PDF completo que você pode imprimir se quiser!
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>🎂 Preciso de equipamentos caros?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  <strong>NÃO!</strong> Você só precisa: tigelas, colheres, batedeira (ou batedor manual), 
                  forma para assar e os potinhos. Nada de equipamento profissional. 
                  Muitas meninas começam com o que já têm em casa!
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                <summary className="font-black text-lg text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>🏠 Posso fazer em casa mesmo? É legalizado?</span>
                  <ArrowRight className="h-5 w-5" />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Sim! Você pode começar vendendo para amigos, familiares e vizinhos sem problemas. 
                  Conforme crescer, pode regularizar. <strong>Comece pequeno e vá evoluindo!</strong>
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              Sua Renda Extra Está
              <span className="block text-yellow-300">A 1 Clique de Distância</span>
            </h2>

            <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
              Enquanto você hesita, outras mulheres estão fazendo, vendendo e ganhando. 
              <strong className="block mt-2">Não deixe essa oportunidade passar.</strong>
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-yellow-300 mb-2">15</div>
                  <p className="text-sm opacity-90">Receitas Completas</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-yellow-300 mb-2">R$ 29</div>
                  <p className="text-sm opacity-90">Investimento Único</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-yellow-300 mb-2">7</div>
                  <p className="text-sm opacity-90">Dias de Garantia</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6">
                <p className="text-2xl font-black mb-2">🎁 BÔNUS ESPECIAL HOJE:</p>
                <p className="text-lg">Guia "Como Vender pelo WhatsApp" + Modelos de Posts Prontos</p>
                <p className="text-sm mt-2 opacity-90">(Valor R$ 47 - GRÁTIS hoje)</p>
              </div>
            </div>

            <a
              href="https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"
              onClick={handleComprarClick}
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover:scale-105 transition-all duration-200 mb-6"
            >
              <Sparkles className="h-8 w-8" />
              <span>SIM, QUERO COMEÇAR AGORA</span>
              <ArrowRight className="h-8 w-8" />
            </a>

            <div className="space-y-2 text-sm opacity-90">
              <p>✓ Pagamento 100% seguro</p>
              <p>✓ Acesso imediato por email</p>
              <p>✓ Garantia de 7 dias ou seu dinheiro de volta</p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-lg italic opacity-80">
                "O melhor momento para começar foi ontem. O segundo melhor momento é agora."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Cake className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold">DoceCalc</span>
            </div>

            <p className="text-gray-400 mb-6">
              Transformando sonhos em bolos de pote, e bolos de pote em renda extra.
            </p>

            <div className="flex justify-center space-x-8 mb-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contato
              </a>
            </div>

            <div className="text-sm text-gray-500">
              <p>© 2024 DoceCalc. Todos os direitos reservados.</p>
              <p className="mt-2">Este produto não garante resultados. Os ganhos dependem do seu esforço e dedicação.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}