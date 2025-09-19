import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, Package, Users, FileText, BarChart3, MessageCircle, Store, ShoppingBag, ChevronDown, ChevronRight, Play, BookOpen, Lightbulb, Target, Star } from 'lucide-react'

interface GuiaFerramenta {
  id: string
  nome: string
  icone: React.ReactNode
  cor: string
  resumo: string
  oQueE: string
  paraque: string
  comoFunciona: string[]
  dicasImportantes: string[]
  exemplo: string
  videoUrl?: string
}

export default function ComoUsarPage() {
  const [ferramentaExpandida, setFerramentaExpandida] = useState<string | null>(null)

  const toggleExpansao = (id: string) => {
    setFerramentaExpandida(ferramentaExpandida === id ? null : id)
  }

  const ferramentas: GuiaFerramenta[] = [
    {
      id: 'calculadora',
      nome: 'Calculadora de Custos',
      icone: <Calculator className="h-6 w-6" />,
      cor: 'bg-blue-500',
      resumo: 'Calcula o preço real dos seus produtos considerando todos os custos',
      oQueE: 'A calculadora é a ferramenta mais importante do DoceCalc. Ela calcula automaticamente quanto você deve cobrar por cada produto, considerando ingredientes, mão de obra e margem de lucro.',
      paraque: 'Para você nunca mais vender no prejuízo! Muitas confeiteiras cobram baseado no "achismo", mas a calculadora mostra o preço científico baseado nos seus custos reais.',
      comoFunciona: [
        '1. Crie uma nova receita clicando em "Nova Receita"',
        '2. Adicione todos os ingredientes com quantidades exatas',
        '3. Defina o tempo de preparo (sua mão de obra)',
        '4. Escolha a margem de lucro desejada (recomendamos 30-50%)',
        '5. O sistema calcula automaticamente o preço sugerido'
      ],
      dicasImportantes: [
        '⚠️ Sempre inclua TODOS os ingredientes, até os menores (açúcar, sal, fermento)',
        '💡 O tempo de preparo inclui misturar, assar, esfriar e decorar',
        '🎯 Margem de 30% é mínima, 50% é ideal para crescer',
        '📊 Atualize os preços dos ingredientes mensalmente'
      ],
      exemplo: 'Exemplo: Brigadeiro gourmet → Chocolate (R$8), Leite condensado (R$4), Manteiga (R$2), Tempo (30min = R$12,50) = Custo R$26,50. Com margem 40% = Preço final: R$37,10 (6 brigadeiros = R$6,18 cada)'
    },
    {
      id: 'ingredientes',
      nome: 'Gestão de Ingredientes',
      icone: <Package className="h-6 w-6" />,
      cor: 'bg-purple-500',
      resumo: 'Controla estoque e preços dos seus ingredientes',
      oQueE: 'Um sistema para cadastrar todos os ingredientes que você usa, com preços atualizados e controle de estoque.',
      paraque: 'Para ter controle total dos seus custos e nunca ficar sem ingredientes na hora de produzir.',
      comoFunciona: [
        '1. Vá em "Ingredientes" no menu',
        '2. Clique em "Adicionar Ingrediente"',
        '3. Preencha nome, categoria, unidade e preço atual',
        '4. Atualize o estoque quando comprar/usar ingredientes',
        '5. O sistema avisa quando o estoque está baixo'
      ],
      dicasImportantes: [
        '💰 Sempre cadastre o preço por unidade (kg, litro, unidade)',
        '📦 Atualize o estoque regularmente para não faltar ingredientes',
        '🔄 Revise os preços mensalmente (inflação afeta seus custos)',
        '📋 Use categorias para organizar melhor (Chocolates, Farinhas, etc.)'
      ],
      exemplo: 'Exemplo: Chocolate em pó → Categoria: Chocolates, Unidade: kg, Preço: R$25,00/kg, Estoque: 2kg. Quando usar 500g numa receita, atualiza para 1,5kg automaticamente.'
    },
    {
      id: 'receitas',
      nome: 'Receitas e Produtos',
      icone: <BookOpen className="h-6 w-6" />,
      cor: 'bg-green-500',
      resumo: 'Armazena suas receitas com custos calculados automaticamente',
      oQueE: 'Aqui você guarda todas as suas receitas com ingredientes, quantidades e instruções. O sistema calcula automaticamente o custo de cada receita.',
      paraque: 'Para ter todas suas receitas organizadas e saber exatamente quanto custa fazer cada produto.',
      comoFunciona: [
        '1. Clique em "Receitas" no menu',
        '2. Clique em "Nova Receita"',
        '3. Dê nome, descrição e escolha categoria',
        '4. Adicione ingredientes um por um com quantidades',
        '5. Adicione modo de preparo e tempo',
        '6. O custo é calculado automaticamente'
      ],
      dicasImportantes: [
        '📝 Escreva instruções claras para não esquecer os passos',
        '⚖️ Use quantidades exatas (500g, não "meio pacote")',
        '⏱️ Inclua tempo real: preparo + forno + decoração',
        '🏷️ Use categorias para organizar (Bolos, Doces, Salgados)'
      ],
      exemplo: 'Exemplo: Bolo de chocolate → Farinha (500g), Açúcar (300g), Chocolate (200g), Ovos (3 unidades). Tempo total: 2h. Custo calculado: R$18,50 + mão de obra.'
    },
    {
      id: 'clientes',
      nome: 'Gestão de Clientes',
      icone: <Users className="h-6 w-6" />,
      cor: 'bg-indigo-500',
      resumo: 'Cadastra e organiza informações dos seus clientes',
      oQueE: 'Sistema para guardar dados dos seus clientes: nome, telefone, preferências e histórico de pedidos.',
      paraque: 'Para ter controle de quem são seus clientes, facilitar contato e oferecer atendimento personalizado.',
      comoFunciona: [
        '1. Vá em "Clientes" no menu',
        '2. Clique em "Novo Cliente"',
        '3. Preencha nome, telefone, WhatsApp',
        '4. Adicione endereço se faz entrega',
        '5. Anote observações importantes (alergias, preferências)',
        '6. Consulte quando precisar fazer orçamento'
      ],
      dicasImportantes: [
        '📱 Sempre cadastre WhatsApp para facilitar contato',
        '📍 Endereço completo se faz entregas',
        '🎂 Anote datas importantes (aniversários, casamentos)',
        '⚠️ Registre alergias e restrições alimentares'
      ],
      exemplo: 'Exemplo: Maria Silva → Tel: (11) 99999-9999, Endereço: Rua das Flores 123, Obs: "Alérgica a amendoim, gosta de chocolate 70%, aniversário do filho em dezembro"'
    },
    {
      id: 'orcamentos',
      nome: 'Orçamentos',
      icone: <FileText className="h-6 w-6" />,
      cor: 'bg-pink-500',
      resumo: 'Cria orçamentos profissionais para seus clientes',
      oQueE: 'Ferramenta para criar orçamentos organizados com múltiplos produtos, quantidades e valores totais.',
      paraque: 'Para enviar orçamentos profissionais aos clientes e acompanhar quais foram aprovados.',
      comoFunciona: [
        '1. Vá em "Orçamentos" no menu',
        '2. Clique em "Novo Orçamento"',
        '3. Escolha o cliente ou cadastre um novo',
        '4. Adicione produtos do seu catálogo de receitas',
        '5. Defina quantidades para cada item',
        '6. O total é calculado automaticamente',
        '7. Envie por WhatsApp ou imprima'
      ],
      dicasImportantes: [
        '⏰ Sempre defina prazo de validade do orçamento',
        '📅 Inclua prazo de entrega dos produtos',
        '💳 Especifique formas de pagamento aceitas',
        '📋 Detalhe bem cada item para evitar confusões'
      ],
      exemplo: 'Exemplo: Festa infantil → 50 brigadeiros (R$185), 30 beijinhos (R$120), 1 bolo decorado (R$85) = Total: R$390. Prazo entrega: 3 dias.'
    },
    {
      id: 'relatorios',
      nome: 'Relatórios',
      icone: <BarChart3 className="h-6 w-6" />,
      cor: 'bg-orange-500',
      resumo: 'Mostra gráficos e dados do seu negócio (Plano Professional)',
      oQueE: 'Dashboard com gráficos mostrando vendas, produtos mais vendidos, clientes e evolução do negócio.',
      paraque: 'Para entender como seu negócio está indo e tomar decisões baseadas em dados reais.',
      comoFunciona: [
        '1. Vá em "Relatórios" (precisa do plano Professional)',
        '2. Veja gráficos de vendas por período',
        '3. Analise quais produtos vendem mais',
        '4. Identifique seus melhores clientes',
        '5. Acompanhe evolução mensal/anual',
        '6. Use os dados para planejar seu crescimento'
      ],
      dicasImportantes: [
        '📊 Produtos mais vendidos merecem promoção especial',
        '🎯 Clientes VIP merecem atendimento diferenciado',
        '📈 Meses fracos precisam de campanhas de marketing',
        '💡 Use dados para criar novos produtos'
      ],
      exemplo: 'Exemplo: "Brigadeiro gourmet é 40% das vendas", "Dezembro vende 3x mais", "Cliente Maria já gastou R$2.500 este ano" - Use essas informações!'
    },
    {
      id: 'comunidade',
      nome: 'Comunidade',
      icone: <MessageCircle className="h-6 w-6" />,
      cor: 'bg-cyan-500',
      resumo: 'Converse com outros confeiteiros e compartilhe experiências',
      oQueE: 'Rede social interna onde confeiteiros compartilham dicas, receitas, fazem perguntas e ajudam uns aos outros.',
      paraque: 'Para aprender com quem já tem experiência, tirar dúvidas e fazer networking no ramo.',
      comoFunciona: [
        '1. Vá em "Comunidade" no menu',
        '2. Leia posts de outros confeiteiros',
        '3. Curta e comente posts que achar interessantes',
        '4. Crie seus próprios posts com dicas ou perguntas',
        '5. Use categorias: Dicas, Perguntas, Receitas, Negócio',
        '6. Pesquise por temas específicos'
      ],
      dicasImportantes: [
        '🤝 Seja respeitoso e prestativo com outros usuários',
        '❓ Faça perguntas específicas para obter melhores respostas',
        '💡 Compartilhe suas descobertas para ajudar outros',
        '🔍 Use a busca para ver se sua dúvida já foi respondida'
      ],
      exemplo: 'Exemplo: Poste "Dica: Descobri que conservar brigadeiro na geladeira por 1h antes de enrolar facilita muito!" ou pergunte "Como evitar que o merengue murche?"'
    },
    {
      id: 'catalogo',
      nome: 'Catálogo Online',
      icone: <Store className="h-6 w-6" />,
      cor: 'bg-purple-600',
      resumo: 'Crie seu site de vendas online (Em breve)',
      oQueE: 'Funcionalidade em desenvolvimento para criar uma loja online onde clientes podem ver seus produtos e fazer pedidos.',
      paraque: 'Para vender 24 horas por dia através de um site próprio, sem depender só de WhatsApp.',
      comoFunciona: [
        '🚧 Esta funcionalidade está em desenvolvimento',
        'Em breve você poderá:',
        '• Criar um catálogo online bonito',
        '• Receber pedidos automaticamente',
        '• Compartilhar link do seu site',
        '• Integrar com WhatsApp'
      ],
      dicasImportantes: [
        '⏳ Aguarde o lançamento desta funcionalidade',
        '📸 Vá tirando fotos bonitas dos seus produtos',
        '📝 Prepare descrições atrativas',
        '💳 Pense nas formas de pagamento que vai aceitar'
      ],
      exemplo: 'Em breve: www.docecalc.com/loja/seunome - seus clientes poderão ver todos seus produtos e fazer pedidos diretamente online!'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Como Usar o DoceCalc 📚
            </h1>
            <p className="text-gray-600">
              Guia completo para dominar todas as ferramentas e vender mais
            </p>
          </div>
        </div>

        {/* Introdução */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Bem-vinda ao DoceCalc!</h2>
          </div>
          <p className="text-lg mb-4">
            Este guia vai te ensinar a usar cada ferramenta do jeito certo. Mesmo que você nunca tenha usado um sistema assim, vai conseguir dominar tudo!
          </p>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🎯 Dica Importante:</h3>
            <p>Comece pela <strong>Calculadora</strong> e <strong>Ingredientes</strong>. Elas são a base de tudo! Depois use as outras ferramentas conforme sua necessidade.</p>
          </div>
        </div>

        {/* Lista de Ferramentas */}
        <div className="space-y-4">
          {ferramentas.map((ferramenta) => (
            <div key={ferramenta.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header da Ferramenta */}
              <button
                onClick={() => toggleExpansao(ferramenta.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${ferramenta.cor} p-3 rounded-lg text-white`}>
                    {ferramenta.icone}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">{ferramenta.nome}</h3>
                    <p className="text-gray-600">{ferramenta.resumo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/${ferramenta.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    Usar Agora
                  </Link>
                  {ferramentaExpandida === ferramenta.id ? 
                    <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  }
                </div>
              </button>

              {/* Conteúdo Expandido */}
              {ferramentaExpandida === ferramenta.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Lado Esquerdo - O que é e Para que serve */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span>O que é?</span>
                        </h4>
                        <p className="text-gray-700">{ferramenta.oQueE}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Para que serve?</span>
                        </h4>
                        <p className="text-gray-700">{ferramenta.paraque}</p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-yellow-800 mb-2">💡 Dicas Importantes:</h5>
                        <ul className="space-y-2 text-sm text-yellow-700">
                          {ferramenta.dicasImportantes.map((dica, index) => (
                            <li key={index}>{dica}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Lado Direito - Como funciona e Exemplo */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Play className="h-4 w-4 text-green-500" />
                          <span>Como usar (passo a passo):</span>
                        </h4>
                        <ol className="space-y-2">
                          {ferramenta.comoFunciona.map((passo, index) => (
                            <li key={index} className="text-gray-700 text-sm">
                              {passo}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">📝 Exemplo Prático:</h5>
                        <p className="text-sm text-blue-700">{ferramenta.exemplo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer com dicas extras */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Dicas para Começar Bem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Primeira semana:</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Cadastre todos seus ingredientes com preços atuais</li>
                <li>• Crie 3-5 receitas principais</li>
                <li>• Faça seu primeiro orçamento</li>
                <li>• Cadastre seus clientes frequentes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Depois de um mês:</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Use os relatórios para análises</li>
                <li>• Participe da comunidade</li>
                <li>• Atualize preços mensalmente</li>
                <li>• Configure seu catálogo online</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">💚 Precisa de ajuda?</h4>
            <p className="text-green-700 text-sm">
              Se tiver dúvidas, acesse a <Link to="/comunidade" className="underline hover:no-underline">Comunidade</Link> e pergunte! 
              Outros confeiteiros e nossa equipe estão sempre prontos para ajudar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}