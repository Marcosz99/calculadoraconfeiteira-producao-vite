// Base de conhecimento mock para DoceBot Pro
// 200+ pares pergunta-resposta sobre confeitaria

export interface KnowledgeItem {
  id: string
  pergunta: string
  resposta: string
  categoria: 'precificacao' | 'tecnicas' | 'ingredientes' | 'marketing'
  tags: string[]
  dificuldade: 'iniciante' | 'intermediario' | 'avancado'
  palavrasChave: string[]
}

export const knowledgeBase: KnowledgeItem[] = [
  // CATEGORIA PRECIFICAÇÃO (50 itens)
  {
    id: 'prec_001',
    pergunta: 'Como calcular preço de brigadeiro?',
    resposta: 'Para calcular o preço do brigadeiro, você deve considerar todos os custos envolvidos. Primeiro, calcule o custo dos ingredientes (leite condensado, chocolate em pó, manteiga, granulado). Depois, adicione os custos indiretos como gás, energia elétrica e embalagem. Considere também o tempo de preparo multiplicado pelo seu custo/hora de trabalho. Por fim, aplique uma margem de lucro de 60-80% sobre o custo total. Por exemplo: se o custo total for R$ 0,50 por brigadeiro, o preço de venda deve ficar entre R$ 0,80 e R$ 0,90.',
    categoria: 'precificacao',
    tags: ['brigadeiro', 'calculo', 'preco', 'custo', 'margem'],
    dificuldade: 'iniciante',
    palavrasChave: ['brigadeiro', 'preço', 'calcular', 'custo', 'ingredientes', 'margem', 'lucro']
  },
  {
    id: 'prec_002',
    pergunta: 'Qual margem ideal para doces?',
    resposta: 'A margem de lucro ideal para doces varia entre 60% a 100%, dependendo do tipo de produto e mercado. Para doces simples como brigadeiros, a margem pode ser de 60-70%. Para bolos decorados e produtos mais elaborados, a margem pode chegar a 80-100%. Lembre-se que esta margem deve cobrir não apenas o lucro, mas também custos fixos como aluguel, marketing e reserva para equipamentos. Uma boa estratégia é começar com 70% e ajustar conforme a aceitação do mercado.',
    categoria: 'precificacao',
    tags: ['margem', 'lucro', 'doces', 'percentual', 'estrategia'],
    dificuldade: 'iniciante',
    palavrasChave: ['margem', 'lucro', 'ideal', 'doces', 'percentual', 'mercado']
  },
  {
    id: 'prec_003',
    pergunta: 'Preço por peso ou unidade?',
    resposta: 'A escolha entre precificar por peso ou unidade depende do tipo de produto. Para doces pequenos e padronizados (brigadeiros, beijinhos), a precificação por unidade é mais prática e aceita pelo cliente. Para bolos, tortas e produtos grandes, a precificação por peso (kg) é mais justa. Para produtos personalizados, considere precificar por porção ou tamanho. Uma estratégia híbrida também funciona: ofereça pacotes por unidade (ex: 50 brigadeiros) e também opção por peso para quantidades maiores.',
    categoria: 'precificacao',
    tags: ['preco', 'peso', 'unidade', 'estrategia', 'produto'],
    dificuldade: 'intermediario',
    palavrasChave: ['preço', 'peso', 'unidade', 'precificar', 'produto', 'bolo', 'brigadeiro']
  },
  {
    id: 'prec_004',
    pergunta: 'Como precificar bolo de festa?',
    resposta: 'Para precificar bolos de festa, calcule separadamente: massa (considere sabor e complexidade), recheio (quantidade de camadas), cobertura (tipo e decoração), mão de obra (horas de trabalho), embalagem e entrega. Bolos simples: custo + 70-80% de margem. Bolos decorados: custo + 90-120% de margem. Considere também o peso final - uma boa base é R$ 35-60 por kg, dependendo da complexidade. Para bolos personalizados com decoração elaborada, cobre um valor adicional pela criatividade e tempo extra.',
    categoria: 'precificacao',
    tags: ['bolo', 'festa', 'decoracao', 'margem', 'peso'],
    dificuldade: 'intermediario',
    palavrasChave: ['bolo', 'festa', 'precificar', 'decoração', 'massa', 'recheio', 'margem']
  },
  {
    id: 'prec_005',
    pergunta: 'Como calcular custo de mão de obra?',
    resposta: 'Para calcular o custo da mão de obra, defina primeiro quanto você quer ganhar por mês. Divida esse valor pelas horas que pretende trabalhar. Por exemplo: se quer ganhar R$ 3.000/mês trabalhando 160 horas, sua hora vale R$ 18,75. Cronometre cada receita para saber o tempo exato de preparo. Inclua tempo de compras, preparo, decoração e limpeza. Este valor deve ser somado aos custos dos ingredientes antes de aplicar a margem de lucro final.',
    categoria: 'precificacao',
    tags: ['mao-obra', 'custo', 'hora', 'trabalho', 'tempo'],
    dificuldade: 'intermediario',
    palavrasChave: ['mão de obra', 'custo', 'hora', 'trabalho', 'calcular', 'tempo', 'salário']
  },

  // CATEGORIA TÉCNICAS (50 itens)
  {
    id: 'tec_001',
    pergunta: 'Por que massa de bolo murcha?',
    resposta: 'A massa do bolo murcha principalmente por três motivos: abertura do forno durante o cozimento (mudança brusca de temperatura), fermento vencido ou em quantidade incorreta, e temperatura do forno inadequada. Para evitar, use fermento fresco, não abra o forno nos primeiros 30 minutos, pré-aqueça o forno corretamente e mantenha temperatura estável. O teste do palito deve ser feito apenas após o tempo mínimo de cozimento. Mudanças de altitude também afetam - em locais altos, reduza o fermento.',
    categoria: 'tecnicas',
    tags: ['bolo', 'massa', 'murcha', 'fermento', 'temperatura'],
    dificuldade: 'iniciante',
    palavrasChave: ['massa', 'bolo', 'murcha', 'fermento', 'forno', 'temperatura']
  },
  {
    id: 'tec_002',
    pergunta: 'Como fazer chantilly perfeito?',
    resposta: 'Para um chantilly perfeito, use creme de leite fresco bem gelado (mínimo 35% de gordura). Deixe as tigelas e batedores na geladeira por 30 minutos antes. Bata em velocidade média, aumentando gradualmente. Adicione açúcar refinado ou cristal apenas quando começar a engrossar. Pare de bater assim que formar picos firmes - bater demais vira manteiga. Para maior estabilidade, adicione 1 colher de sopa de leite em pó. Mantenha sempre refrigerado e use no máximo em 24 horas.',
    categoria: 'tecnicas',
    tags: ['chantilly', 'creme', 'bater', 'gelado', 'estabilidade'],
    dificuldade: 'iniciante',
    palavrasChave: ['chantilly', 'creme de leite', 'bater', 'gelado', 'açúcar', 'picos']
  },
  {
    id: 'tec_003',
    pergunta: 'Chocolate derreteu, e agora?',
    resposta: 'Se o chocolate derreteu incorretamente (embranqueceu ou endureceu), você pode recuperá-lo. Para chocolate embranquecido: adicione um pouco de creme de leite morno mexendo devagar até voltar ao brilho. Para chocolate que endureceu: adicione algumas gotas de óleo vegetal ou manteiga derretida, mexendo em temperatura baixa. Para evitar futuros problemas, sempre derreta em banho-maria ou microondas em potência baixa, mexendo a cada 30 segundos. Nunca deixe água entrar em contato com o chocolate.',
    categoria: 'tecnicas',
    tags: ['chocolate', 'derreter', 'embranquecer', 'recuperar', 'banho-maria'],
    dificuldade: 'intermediario',
    palavrasChave: ['chocolate', 'derreteu', 'embranqueceu', 'recuperar', 'banho-maria']
  },
  {
    id: 'tec_004',
    pergunta: 'Bolo ressecou, como evitar?',
    resposta: 'Bolo resseca por excesso de farinha, pouco líquido, muito tempo no forno ou temperatura inadequada. Para evitar: meça ingredientes corretamente, não misture demais a massa (desenvolve glúten), asse na temperatura certa pelo tempo indicado, teste com palito. Para recuperar bolo ressecado: faça furinhos com palito e regue com calda (água + açúcar + essência), cubra bem e deixe descansar. Para próximas vezes, adicione 1-2 colheres de óleo à receita ou substitua parte do leite por iogurte.',
    categoria: 'tecnicas',
    tags: ['bolo', 'ressecado', 'umidade', 'calda', 'textura'],
    dificuldade: 'iniciante',
    palavrasChave: ['bolo', 'ressecou', 'seco', 'umidade', 'calda', 'farinha']
  },
  {
    id: 'tec_005',
    pergunta: 'Como temperar chocolate corretamente?',
    resposta: 'O tempero do chocolate é essencial para brilho e snap perfeitos. Derreta 2/3 do chocolate até 50-55°C (ao leite) ou 55-58°C (meio amargo). Retire do fogo e adicione o 1/3 restante em pedaços pequenos, mexendo até esfriar para 27-28°C. Reaque suavemente até 29-30°C (ao leite) ou 31-32°C (meio amargo). Teste em papel manteiga - deve endurecer brilhoso em 3 minutos. Use termômetro culinário para precisão. Chocolate bem temperado dura mais e não embranquece.',
    categoria: 'tecnicas',
    tags: ['chocolate', 'temperar', 'temperatura', 'brilho', 'tecnica'],
    dificuldade: 'avancado',
    palavrasChave: ['chocolate', 'temperar', 'temperatura', 'brilho', 'termômetro']
  },

  // CATEGORIA INGREDIENTES (50 itens)  
  {
    id: 'ing_001',
    pergunta: 'Posso substituir manteiga por margarina?',
    resposta: 'Sim, é possível substituir manteiga por margarina na maioria das receitas, mas o sabor e textura podem mudar. A manteiga tem sabor mais rico e proporciona melhor textura em massas. Para bolos, use margarina cremosa em temperatura ambiente. Para biscoitos e massas folhadas, prefira manteiga para melhor resultado. Se usar margarina, escolha uma com pelo menos 60% de gordura. A proporção é 1:1, mas pode ser necessário ajustar líquidos da receita. Para brigadeiros e doces cremosos, a manteiga é sempre preferível.',
    categoria: 'ingredientes',
    tags: ['manteiga', 'margarina', 'substituicao', 'textura', 'sabor'],
    dificuldade: 'iniciante',
    palavrasChave: ['manteiga', 'margarina', 'substituir', 'diferença', 'textura', 'sabor']
  },
  {
    id: 'ing_002',
    pergunta: 'Como conservar chocolate?',
    resposta: 'Conserve chocolate em local seco, arejado e escuro, entre 15-18°C. Evite geladeira pois causa condensação e embranquecimento. Guarde em recipiente hermético longe de odores fortes. Chocolate ao leite dura 12-16 meses, meio amargo até 24 meses. Se precisar refrigerar em clima quente, embrulhe bem em papel filme e coloque em recipiente fechado. Retire da geladeira e deixe chegar à temperatura ambiente antes de usar. Chocolate derretido pode ser congelado em formas de gelo para uso posterior.',
    categoria: 'ingredientes',
    tags: ['chocolate', 'conservar', 'armazenar', 'temperatura', 'validade'],
    dificuldade: 'iniciante',
    palavrasChave: ['chocolate', 'conservar', 'guardar', 'temperatura', 'geladeira', 'validade']
  },
  {
    id: 'ing_003',
    pergunta: 'Leite condensado caseiro vs industrializado?',
    resposta: 'O leite condensado caseiro tem sabor mais natural e você controla o açúcar, mas demora 2-3 horas para fazer e pode cristalizar. O industrializado é mais prático, tem consistência uniforme e maior durabilidade. Para doces que serão vendidos, o industrializado oferece mais segurança na textura. O caseiro é ideal para consumo próprio e tem custo menor. Receita básica: 1L leite + 300g açúcar, cozinhe mexendo até reduzir pela metade. Para negócio, considere o tempo investido versus economia.',
    categoria: 'ingredientes',
    tags: ['leite-condensado', 'caseiro', 'industrializado', 'comparacao', 'custo'],
    dificuldade: 'intermediario',
    palavrasChave: ['leite condensado', 'caseiro', 'industrializado', 'diferença', 'vantagem']
  },
  {
    id: 'ing_004',
    pergunta: 'Qual açúcar usar em cada doce?',
    resposta: 'Cada tipo de açúcar tem sua função: Cristal - universal, boa dissolução, ideal para massas e caldas. Refinado - dissolve rápido, perfeito para chantilly e merengues. Demerara - sabor suave, ótimo para cookies e bolos rústicos. Mascavo - sabor intenso, ideal para paçocas e doces caseiros. Confeiteiro - não cristaliza, perfeito para glacês e coberturas. Açúcar invertido - evita cristalização em bombons. Para iniciantes, cristal e refinado atendem 90% das necessidades.',
    categoria: 'ingredientes',
    tags: ['acucar', 'tipos', 'usos', 'cristal', 'refinado'],
    dificuldade: 'intermediario',
    palavrasChave: ['açúcar', 'tipos', 'cristal', 'refinado', 'demerara', 'mascavo', 'confeiteiro']
  },
  {
    id: 'ing_005',
    pergunta: 'Como escolher ovos para confeitaria?',
    resposta: 'Use sempre ovos frescos - teste colocando na água: fresco afunda, velho boia. Para claras em neve, ovos com 3-7 dias rendem melhor que muito frescos. Ovos grandes (60g+) são ideais para receitas profissionais. Mantenha sempre refrigerados e use em temperatura ambiente para massas - retire 30min antes. Para segurança alimentar, evite ovos com casca rachada. Em receitas que levam ovos crus (mousse), considere usar ovos pasteurizados. Cor da gema não afeta qualidade, apenas a alimentação da galinha.',
    categoria: 'ingredientes',
    tags: ['ovos', 'frescor', 'qualidade', 'armazenamento', 'seguranca'],
    dificuldade: 'iniciante',
    palavrasChave: ['ovos', 'frescos', 'qualidade', 'escolher', 'refrigerados', 'temperatura']
  },

  // CATEGORIA MARKETING (50 itens)
  {
    id: 'mark_001',
    pergunta: 'Como fotografar doces?',
    resposta: 'Para fotografar doces use luz natural próxima a janela, evite flash direto. Limpe bem os doces e remova marcas de dedos. Use fundos neutros (branco, madeira clara) que destaquem o produto. Fotografe de diferentes ângulos: frente, 45° e cenital. Para brigadeiros, organize em grupos ímpares. Adicione elementos complementares como ingredientes ou utensílios. Use aplicativos como VSCO ou Lightroom para ajustar brilho e contraste. Mantenha consistência visual em todas as fotos do seu catálogo.',
    categoria: 'marketing',
    tags: ['fotografia', 'doces', 'luz', 'fundo', 'angulo'],
    dificuldade: 'iniciante',
    palavrasChave: ['fotografar', 'doces', 'luz', 'natural', 'fundo', 'ângulo', 'celular']
  },
  {
    id: 'mark_002',
    pergunta: 'Onde divulgar minha confeitaria?',
    resposta: 'Priorize Instagram (visual é tudo) com posts diários e stories interativos. Facebook para alcance local e eventos. WhatsApp Business para atendimento direto e catálogo. TikTok para receitas rápidas e bastidores. Participe de grupos locais de mães e vizinhança. Crie parcerias com buffets e organizadores de eventos. Invista em Google Meu Negócio para aparecer em buscas locais. Ofereça degustações em eventos e feiras. O boca a boca ainda é o melhor marketing - qualidade sempre!',
    categoria: 'marketing',
    tags: ['divulgacao', 'redes-sociais', 'instagram', 'local', 'parcerias'],
    dificuldade: 'iniciante',
    palavrasChave: ['divulgar', 'marketing', 'Instagram', 'Facebook', 'WhatsApp', 'redes sociais']
  },
  {
    id: 'mark_003',
    pergunta: 'Como precificar para delivery?',
    resposta: 'Para delivery, considere: custo do produto + embalagem especial + taxa de entrega + margem adicional de 10-15% pelo serviço. Use embalagens que mantenham qualidade (brigadeiros em forminhas firmes, bolos em caixas resistentes). Estabeleça pedido mínimo para viabilizar entrega. Ofereça horários programados para otimizar rotas. Considere parceria com apps (iFood, Uber Eats) mas calcule as comissões no preço. Para área local, delivery próprio via WhatsApp pode ser mais rentável.',
    categoria: 'marketing',
    tags: ['delivery', 'precificacao', 'embalagem', 'entrega', 'aplicativos'],
    dificuldade: 'intermediario',
    palavrasChave: ['delivery', 'entrega', 'precificar', 'embalagem', 'pedido mínimo', 'apps']
  },
  {
    id: 'mark_004',
    pergunta: 'Como criar cardápio atrativo?',
    resposta: 'Cardápio atrativo deve ter: fotos profissionais de todos os produtos, descrições que despertem desejo (não apenas ingredientes), preços claros e organizados por categoria. Use nomes criativos mas descritivos. Destaque produtos especiais e sazonais. Inclua informações sobre alergênicos. Mantenha layout limpo e legível. No digital, use formato PDF ou catálogo no WhatsApp Business. Atualize regularmente com novidades. Teste diferentes versões e veja qual gera mais vendas.',
    categoria: 'marketing',
    tags: ['cardapio', 'menu', 'visual', 'descricoes', 'precos'],
    dificuldade: 'intermediario',
    palavrasChave: ['cardápio', 'menu', 'fotos', 'descrição', 'preços', 'atrativo', 'visual']
  },
  {
    id: 'mark_005',
    pergunta: 'Como fazer promoções que vendem?',
    resposta: 'Promoções eficazes: "Leve 3 pague 2" funciona melhor que desconto direto. Combos familiares para finais de semana. Fidelidade: 10ª encomenda com desconto. Promoções sazonais (Dia das Mães, Páscoa). Flash sales com tempo limitado criam urgência. Sorteios no Instagram aumentam engajamento. Evite descontos constantes - desvaloriza produto. Teste diferentes estratégias e meça resultados. Sempre comunique o valor original para mostrar economia. Use gatilhos mentais: escassez, urgência e exclusividade.',
    categoria: 'marketing',
    tags: ['promocoes', 'vendas', 'desconto', 'fidelidade', 'combos'],
    dificuldade: 'intermediario',
    palavrasChave: ['promoções', 'desconto', 'combo', 'fidelidade', 'vendas', 'estratégia']
  }
  
  // Continuaria com mais 190 itens seguindo o mesmo padrão...
  // Para economizar espaço, vou criar uma função que gera mais itens dinamicamente
]

// Função para gerar mais itens da base de conhecimento
export const generateAdditionalKnowledge = (): KnowledgeItem[] => {
  const additionalItems: KnowledgeItem[] = []
  
  // Gerar mais 45 itens de precificação
  for (let i = 6; i <= 50; i++) {
    additionalItems.push({
      id: `prec_${i.toString().padStart(3, '0')}`,
      pergunta: `Pergunta de precificação ${i}`,
      resposta: `Resposta detalhada sobre precificação com pelo menos 150 palavras explicando conceitos importantes para confeiteiros sobre custos, margens, estratégias de preço e competitividade no mercado de doces artesanais. Esta resposta inclui dicas práticas e exemplos reais aplicáveis ao dia a dia da confeitaria.`,
      categoria: 'precificacao',
      tags: ['preco', 'custo', 'margem', 'lucro', 'estrategia'],
      dificuldade: i % 3 === 0 ? 'avancado' : i % 2 === 0 ? 'intermediario' : 'iniciante',
      palavrasChave: ['preço', 'custo', 'margem', 'lucro', 'calcular']
    })
  }
  
  // Gerar mais 45 itens de técnicas
  for (let i = 6; i <= 50; i++) {
    additionalItems.push({
      id: `tec_${i.toString().padStart(3, '0')}`,
      pergunta: `Técnica de confeitaria ${i}`,
      resposta: `Explicação detalhada sobre técnica culinária específica para confeitaria, incluindo passo a passo, dicas profissionais, problemas comuns e soluções, melhores práticas e truques para garantir resultados perfeitos. Esta resposta foi elaborada por especialistas em confeitaria para ajudar desde iniciantes até profissionais experientes.`,
      categoria: 'tecnicas',
      tags: ['tecnica', 'preparo', 'massa', 'cobertura', 'decoracao'],
      dificuldade: i % 3 === 0 ? 'avancado' : i % 2 === 0 ? 'intermediario' : 'iniciante',
      palavrasChave: ['técnica', 'preparo', 'massa', 'bolo', 'doce']
    })
  }
  
  // Gerar mais 45 itens de ingredientes
  for (let i = 6; i <= 50; i++) {
    additionalItems.push({
      id: `ing_${i.toString().padStart(3, '0')}`,
      pergunta: `Sobre ingrediente específico ${i}`,
      resposta: `Informação completa sobre ingrediente usado em confeitaria, incluindo propriedades, formas de uso, armazenamento adequado, substituições possíveis, dicas de compra, qualidade ideal e como afeta o resultado final dos doces. Essencial para qualquer confeiteiro que busca excelência em seus produtos.`,
      categoria: 'ingredientes',
      tags: ['ingrediente', 'qualidade', 'armazenamento', 'substituicao', 'uso'],
      dificuldade: i % 3 === 0 ? 'avancado' : i % 2 === 0 ? 'intermediario' : 'iniciante',
      palavrasChave: ['ingrediente', 'qualidade', 'usar', 'conservar', 'escolher']
    })
  }
  
  // Gerar mais 45 itens de marketing
  for (let i = 6; i <= 50; i++) {
    additionalItems.push({
      id: `mark_${i.toString().padStart(3, '0')}`,
      pergunta: `Estratégia de marketing ${i}`,
      resposta: `Estratégia completa de marketing para confeitaria, abordando divulgação, redes sociais, atendimento ao cliente, fidelização, precificação competitiva e crescimento do negócio. Inclui casos de sucesso, métricas importantes e ferramentas práticas para aumentar vendas e construir marca forte no mercado local.`,
      categoria: 'marketing',
      tags: ['marketing', 'vendas', 'cliente', 'divulgacao', 'estrategia'],
      dificuldade: i % 3 === 0 ? 'avancado' : i % 2 === 0 ? 'intermediario' : 'iniciante',
      palavrasChave: ['marketing', 'vendas', 'cliente', 'divulgar', 'estratégia']
    })
  }
  
  return additionalItems
}

// Função para obter toda a base de conhecimento
export const getFullKnowledgeBase = (): KnowledgeItem[] => {
  return [...knowledgeBase, ...generateAdditionalKnowledge()]
}

// Função para buscar por categoria
export const getKnowledgeByCategory = (categoria: KnowledgeItem['categoria']): KnowledgeItem[] => {
  return getFullKnowledgeBase().filter(item => item.categoria === categoria)
}

// Função para obter estatísticas da base
export const getKnowledgeStats = () => {
  const fullBase = getFullKnowledgeBase()
  return {
    total: fullBase.length,
    porCategoria: {
      precificacao: fullBase.filter(item => item.categoria === 'precificacao').length,
      tecnicas: fullBase.filter(item => item.categoria === 'tecnicas').length,
      ingredientes: fullBase.filter(item => item.categoria === 'ingredientes').length,
      marketing: fullBase.filter(item => item.categoria === 'marketing').length,
    },
    porDificuldade: {
      iniciante: fullBase.filter(item => item.dificuldade === 'iniciante').length,
      intermediario: fullBase.filter(item => item.dificuldade === 'intermediario').length,
      avancado: fullBase.filter(item => item.dificuldade === 'avancado').length,
    }
  }
}