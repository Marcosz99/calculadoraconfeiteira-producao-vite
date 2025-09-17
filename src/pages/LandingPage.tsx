import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign, Check, Star, ArrowRight, Play } from 'lucide-react'
import { planos } from '../data/planos'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  
  // Demo calculator
  const [demoIngredientes, setDemoIngredientes] = useState([
    { nome: 'Açúcar', quantidade: 500, preco: 0.006 },
    { nome: 'Farinha', quantidade: 300, preco: 0.004 },
    { nome: 'Ovos', quantidade: 3, preco: 0.65 }
  ])
  const [demoMargem, setDemoMargem] = useState(30)
  const [demoCustoFixo, setDemoCustoFixo] = useState(5)

  const calcularDemo = () => {
    const custoIngredientes = demoIngredientes.reduce((total, ing) => total + (ing.quantidade * ing.preco), 0)
    const custoTotal = custoIngredientes + demoCustoFixo
    return custoTotal * (1 + demoMargem / 100)
  }

  const depoimentos = [
    {
      nome: "Maria Silva",
      confeitaria: "Doces da Maria",
      avatar: "👩‍🍳",
      texto: "O DoceCalc revolucionou meu negócio! Agora sei exatamente quanto cobrar e meu lucro aumentou 40%.",
      estrelas: 5
    },
    {
      nome: "Ana Costa",
      confeitaria: "Bolos & Cia",
      avatar: "👩‍🦰",
      texto: "Antes eu chutava os preços. Com o DoceCalc, tenho controle total dos custos e margem de lucro.",
      estrelas: 5
    },
    {
      nome: "Lucia Santos",
      confeitaria: "Delícias da Lu",
      avatar: "👩‍🦳",
      texto: "Excelente ferramenta! A gestão de ingredientes me ajuda muito no controle de estoque.",
      estrelas: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Calcule o preço certo dos seus
            <span className="text-pink-500"> doces</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pare de chutar preços! Com o DoceCalc você calcula custos precisos, 
            gerencia ingredientes e aumenta seus lucros de forma profissional.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link
              to="/login"
              className="bg-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors flex items-center space-x-2"
            >
              <span>Começar Grátis Agora</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <button
              onClick={() => setShowCalculatorDemo(!showCalculatorDemo)}
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Ver Demo</span>
            </button>
          </div>

          {/* Calculadora Demo */}
          {showCalculatorDemo && (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🧁 Experimente a Calculadora
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Ingredientes</h4>
                  <div className="space-y-3">
                    {demoIngredientes.map((ing, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm w-16">{ing.nome}:</span>
                        <input
                          type="number"
                          value={ing.quantidade}
                          onChange={(e) => {
                            const novos = [...demoIngredientes]
                            novos[index].quantidade = parseFloat(e.target.value) || 0
                            setDemoIngredientes(novos)
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-xs text-gray-500">x R$ {ing.preco.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-24">Margem (%):</span>
                      <input
                        type="number"
                        value={demoMargem}
                        onChange={(e) => setDemoMargem(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-24">Custo Fixo:</span>
                      <input
                        type="number"
                        value={demoCustoFixo}
                        onChange={(e) => setDemoCustoFixo(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-4">Resultado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Custo ingredientes:</span>
                      <span>R$ {demoIngredientes.reduce((total, ing) => total + (ing.quantidade * ing.preco), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo fixo:</span>
                      <span>R$ {demoCustoFixo.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem ({demoMargem}%):</span>
                      <span>R$ {(calcularDemo() - (demoIngredientes.reduce((total, ing) => total + (ing.quantidade * ing.preco), 0) + demoCustoFixo)).toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Preço Final:</span>
                      <span>R$ {calcularDemo().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para vender mais
            </h2>
            <p className="text-xl text-gray-600">
              Ferramentas profissionais para confeiteiras que querem crescer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calculadora Precisa
              </h3>
              <p className="text-gray-600">
                Calcule custos exatos considerando ingredientes, mão de obra e margem de lucro
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão de Receitas
              </h3>
              <p className="text-gray-600">
                Organize suas receitas, controle proporções e multiplique quantidades facilmente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Controle de Estoque
              </h3>
              <p className="text-gray-600">
                Monitore ingredientes, preços e receba alertas quando precisar repor
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Orçamentos Profissionais
              </h3>
              <p className="text-gray-600">
                Crie orçamentos bonitos, gerencie clientes e acompanhe vendas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preços que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e faça upgrade quando quiser
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {planos.map(plano => (
              <div key={plano.id} className={`bg-white rounded-lg shadow-lg p-6 ${plano.popular ? 'ring-2 ring-pink-500 relative' : ''}`}>
                {plano.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plano.nome}
                  </h3>
                  
                  <div className="mb-4">
                    {plano.preco_mensal === 0 ? (
                      <span className="text-3xl font-bold text-gray-900">Grátis</span>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          R$ {plano.preco_mensal.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-gray-600">/mês</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {plano.descricao}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {plano.funcionalidades.slice(0, 5).map((funcionalidade, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{funcionalidade}</span>
                    </div>
                  ))}
                  {plano.funcionalidades.length > 5 && (
                    <div className="text-sm text-gray-500">
                      +{plano.funcionalidades.length - 5} recursos adicionais
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-center block ${
                    plano.popular 
                      ? 'bg-pink-500 text-white hover:bg-pink-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plano.preco_mensal === 0 ? 'Começar Grátis' : 'Teste 7 dias grátis'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossas clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Confeiteiras reais, resultados reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{depoimento.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{depoimento.nome}</h4>
                    <p className="text-gray-600 text-sm">{depoimento.confeitaria}</p>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(depoimento.estrelas)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{depoimento.texto}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronta para aumentar seus lucros?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Junte-se a milhares de confeiteiras que já transformaram seus negócios
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              value={emailDemo}
              onChange={(e) => setEmailDemo(e.target.value)}
              placeholder="Digite seu melhor email"
              className="px-6 py-4 rounded-lg text-gray-900 text-lg w-full sm:w-auto"
            />
            <Link
              to="/login"
              className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
          
          <p className="text-white opacity-75 mt-4 text-sm">
            ✓ Grátis para sempre  ✓ Sem cartão de crédito  ✓ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold">DoceCalc</span>
              </div>
              <p className="text-gray-400 text-sm">
                A calculadora de preços definitiva para confeiteiras que querem vender mais e lucrar melhor.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link to="/login" className="hover:text-white">Preços</Link></li>
                <li><Link to="/login" className="hover:text-white">Teste Grátis</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">WhatsApp</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 DoceCalc. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}