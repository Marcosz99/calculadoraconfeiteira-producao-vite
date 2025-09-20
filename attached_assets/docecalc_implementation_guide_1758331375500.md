# 🎯 DoceCalc - Guia Implementação para Replit AI

## 📋 **INSTRUÇÕES GERAIS PARA A REPLIT AI**

### **CONTEXTO DO PROJETO:**
- DoceCalc é uma calculadora de precificação para confeitarias
- Já existe uma base funcional que precisa ser expandida
- Implementar features uma por vez, testando cada uma antes de avançar
- **SEMPRE usar dados MOCK primeiro para análise e testes**
- **Depois migrar para produção com APIs reais**
- Já temos: Supabase (banco), Stripe (pagamento), Gemini (IA)

### **ORDEM OBRIGATÓRIA DE IMPLEMENTAÇÃO:**
Execute exatamente nesta sequência. Não pule etapas.

---

## 🚀 **FASE 1: SISTEMA DE CRÉDITOS IA**

### **PARA A REPLIT AI:**

**PASSO 1 - Estrutura de Dados:**
```
⚠️ IMPORTANTE: Por enquanto MOCK - salvar no localStorage para testes

Crie uma nova interface TypeScript chamada 'UserPlan' com:
- planType: pode ser 'gratuito', 'profissional' ou 'premium'
- creditsIA: número inteiro para controlar uso da IA
- creditsUsedThisMonth: contador de créditos gastos
- resetDate: data do próximo reset mensal

Atualize a interface User existente para incluir um campo 'plan' do tipo UserPlan.

Configure no localStorage as funções para:
- Salvar/carregar dados do plano
- Decrementar créditos quando IA é usada
- Verificar se ainda tem créditos disponíveis
- Reset automático no primeiro dia do mês

🔄 PRODUÇÃO: Posteriormente migrar para Supabase
```

**PASSO 2 - Sistema de Controle:**
```
⚠️ MOCK: Sistema funcional com dados locais

Implemente um hook personalizado React chamado 'useCredits' que:
- Retorna quantos créditos restam
- Função para gastar 1 crédito
- Função para verificar se pode usar IA
- Estado de loading para operações de crédito

Regras de créditos (MOCK inicial):
- Plano Gratuito: 10 consultas/mês
- Plano Profissional: 100 consultas/mês  
- Plano Premium: consultas ilimitadas (9999)
```

**PASSO 3 - Interface Visual:**
```
⚠️ MOCK: Interface completa funcionando

Crie um componente 'CreditsDisplay' que mostra:
- Barra de progresso visual dos créditos
- Texto: "8/10 consultas restantes"
- Cores: verde (>50%), amarelo (20-50%), vermelho (<20%)
- Link "Upgrade" quando créditos baixos

Adicione este componente no header principal da aplicação.
```

**PASSO 4 - Modal de Upgrade:**
```
⚠️ MOCK: Simular upgrade para testes

Crie um modal 'UpgradePlanModal' que aparece quando:
- Créditos zerados
- Usuário tenta usar IA sem créditos
- Clica no botão "Upgrade"

O modal deve mostrar:
- Comparação dos 3 planos
- Benefícios de cada um
- Preços: Gratuito (R$ 0), Profissional (R$ 47/mês), Premium (R$ 97/mês)
- Botão "Escolher Plano" (MOCK - simula upgrade localmente)

🔄 PRODUÇÃO: Integrar com Stripe posteriormente
```

**TESTE OBRIGATÓRIO:**
- Criar usuário novo (deve vir com 10 créditos)
- Usar 10 créditos e verificar se bloqueia
- Simular upgrade e verificar se libera
- Testar reset mensal (mock)

---

## 🤖 **FASE 2: AI ASSISTANT - DOCEBOT PRO**

### **PASSO 1 - Base de Conhecimento Mock:**
```
⚠️ MOCK: Base de conhecimento local para testes

Crie um arquivo 'knowledge-base.ts' com pelo menos 200 pares pergunta-resposta sobre:

CATEGORIA PRECIFICAÇÃO (50 exemplos):
- "Como calcular preço de brigadeiro?"
- "Qual margem ideal para doces?"
- "Preço por peso ou unidade?"
- "Como precificar bolo de festa?"

CATEGORIA TÉCNICAS (50 exemplos):
- "Por que massa de bolo murcha?"
- "Como fazer chantilly perfeito?"
- "Chocolate derreteu, e agora?"
- "Bolo ressecou, como evitar?"

CATEGORIA INGREDIENTES (50 exemplos):
- "Posso substituir manteiga por margarina?"
- "Como conservar chocolate?"
- "Leite condensado caseiro vs industrializado?"

CATEGORIA MARKETING (50 exemplos):
- "Como fotografar doces?"
- "Onde divulgar minha confeitaria?"
- "Como precificar para delivery?"

Cada resposta deve ter:
- Texto da resposta (150-300 palavras)
- Tags para busca
- Categoria
- Nível de dificuldade
- Palavras-chave relacionadas

🔄 PRODUÇÃO: Substituir por Gemini API posteriormente
```

**PASSO 2 - Sistema de Busca Mock:**
```
⚠️ MOCK: Busca inteligente local

Implemente função 'findAnswer' que:
- Recebe pergunta do usuário
- Busca por palavras-chave na base local
- Retorna resposta mais próxima
- Se não achar nada, retorna resposta padrão
- Inclui sugestões de perguntas relacionadas

Use algoritmo simples de matching:
- Quebra pergunta em palavras
- Conta matches com palavras-chave
- Retorna resposta com mais matches
- Mínimo 2 matches para ser válida
```

**PASSO 3 - Interface do Chat:**
```
⚠️ MOCK: Interface completa funcionando

Crie página/componente 'AiAssistant' com:
- Sidebar esquerda com categorias de perguntas
- Área central com histórico de chat
- Input inferior para nova pergunta
- Botão "Limpar conversa"
- Contador de créditos restantes no topo

Layout da conversa:
- Mensagem do usuário: balão azul à direita
- Resposta da IA: balão cinza à esquerda com avatar
- Timestamp em cada mensagem
- Loading com "DoceBot está pensando..."
```

**PASSO 4 - Simulação de IA:**
```
⚠️ MOCK: Simulação completa da experiência

Crie função 'simulateAI' que:
- Recebe pergunta do usuário
- Simula delay de 1-3 segundos (loading)
- Usa função findAnswer da base de conhecimento
- Personaliza resposta com nome do usuário
- Decrementa 1 crédito após resposta
- Salva conversa no histórico local

Adicione personalização:
- "Olá [NOME], essa é uma ótima pergunta!"
- Referencia receitas do usuário quando possível
- Adapta linguagem ao nível de experiência

🔄 PRODUÇÃO: Integrar Gemini API posteriormente
```

**TESTE OBRIGATÓRIO:**
- Fazer 3 perguntas diferentes por categoria
- Verificar se decrementa créditos
- Testar bloqueio quando créditos zerados
- Verificar se salva histórico corretamente

---

## 🛒 **FASE 3: MARKETPLACE E-BOOKS**

### **PASSO 1 - Estrutura de Dados Mock:**
```
⚠️ MOCK: Dados simulados para análise

Crie interface 'Ebook' com:
- id: string único
- titulo: string
- categoria: 'natal' | 'pascoa' | 'festa-junina' | 'verao' | 'geral'
- preco: number
- descricao: string longa (500+ chars)
- numeroReceitas: number
- imagemCapa: URL string (usar placeholders)
- dataLancamento: Date
- tags: array de strings
- avaliacoes: number (sempre 4.8-5.0 para mock)
- vendas: number (mock para "mais vendidos")
- nivel: 'iniciante' | 'intermediario' | 'avancado'
- tempoEstimado: string ("2-3 horas")

Crie array com 15-20 e-books diversos para popular loja.

🔄 PRODUÇÃO: Migrar dados para Supabase
```

**PASSO 2 - Catálogo Mock Completo:**
```
⚠️ MOCK: Loja completa para testes

Povoe a loja com ebooks variados:

NATAL (4 ebooks):
- "Natal Lucrativo 2024" (R$ 97)
- "Sobremesas Natalinas Premium" (R$ 67)
- "Panetones Artesanais" (R$ 47)
- "Doces de Natal Tradicionais" (R$ 37)

PÁSCOA (3 ebooks):
- "Páscoa Dourada" (R$ 127)
- "Ovos de Colher Gourmet" (R$ 67)
- "Chocolates Especiais" (R$ 47)

FESTA JUNINA (3 ebooks):
- "Festa Junina Rentável" (R$ 57)
- "Doces Caipiras" (R$ 37)
- "Bebidas Juninas" (R$ 27)

GERAL (8 ebooks):
- "Bolos de Festa Premium" (R$ 97)
- "Docinhos Finos" (R$ 77)
- "Sobremesas no Pote" (R$ 47)
- E mais 5 variados...

Para cada ebook, crie:
- Descrição detalhada
- Lista de receitas incluídas (mock)
- 3-4 reviews positivos simulados
- Preview de 2 receitas
```

**PASSO 3 - Interface da Loja:**
```
⚠️ MOCK: Loja funcional para testes

Crie página 'EbookStore' com:
- Grid de cards dos ebooks
- Sistema de filtros: categoria, preço, nível
- Busca por título
- Ordenação: mais vendidos, preço, lançamentos
- Paginação (10 itens por página)

Card do ebook deve mostrar:
- Imagem da capa
- Título e categoria
- Preço destacado
- Número de receitas
- Avaliação (estrelas)
- Botão "Ver Detalhes"
```

**PASSO 4 - Sistema de Compra Mock:**
```
⚠️ MOCK: Fluxo completo simulado

Implemente fluxo completo:

Carrinho de Compras:
- Adicionar/remover ebooks
- Cálculo de desconto progressivo
- 1 ebook: preço normal
- 2 ebooks: 10% desconto
- 3+ ebooks: 20% desconto

Checkout Mock:
- Formulário com dados do usuário (nome, email, telefone)
- Seleção de pagamento: PIX ou Cartão (visual apenas)
- Termos de uso checkbox
- Botão "Finalizar Compra"

Simulação de Pagamento:
- Loading de 3-5 segundos com mensagens motivacionais
- Página de sucesso com "Pagamento Aprovado!"
- Botão "Acessar Meus E-books"
- Simular envio de email de confirmação

🔄 PRODUÇÃO: Integrar Stripe posteriormente
```

**PASSO 5 - Integração com App:**
```
⚠️ MOCK: Integração simulada completa

Após "pagamento aprovado":
- Marcar ebook como comprado no perfil do usuário
- Criar seção "Meus E-books" no menu
- Adicionar badge "COMPRADO" no ebook na loja
- Mostrar botão "Download PDF" (gera PDF mock)
- Adicionar 3-5 receitas do ebook na calculadora do usuário
- Mostrar notificação: "5 receitas adicionadas ao seu app!"
```

**TESTE OBRIGATÓRIO:**
- Navegar pela loja, filtrar e buscar
- Adicionar ebook ao carrinho
- Completar processo de compra mock
- Verificar se ebook aparece como comprado
- Testar se receitas foram adicionadas

---

## 🧮 **FASE 4: CALCULADORA AVANÇADA**

### **PASSO 1 - Estrutura Expandida:**
```
⚠️ MOCK: Funcionalidade expandida da calculadora

Expanda a calculadora atual adicionando abas:
- "Cálculo Simples" (calculadora atual)
- "Cálculo Avançado" (nova funcionalidade)
- "Análise de Cenários" (nova funcionalidade)
- "Relatórios" (nova funcionalidade)

Mantenha a funcionalidade atual intacta na primeira aba.
```

**PASSO 2 - Cálculo Avançado Mock:**
```
⚠️ MOCK: Cálculos complexos simulados

Nova aba com campos adicionais:
- Custos fixos mensais (aluguel, energia, água)
- Horas trabalhadas por mês
- Meta de lucro mensal desejada
- Percentual para marketing (5-15%)
- Reserva para equipamentos (5-10%)
- Custos de embalagem detalhados
- Frete/entrega (se aplicável)

Cálculo deve considerar:
- Custo por hora de trabalho
- Rateio dos custos fixos
- Margem real vs margem desejada
- Break-even point
```

**PASSO 3 - Análise de Cenários Mock:**
```
⚠️ MOCK: Simulação de cenários

Implemente simulação de 3 cenários automáticos:
- Pessimista: margem 20% menor que calculada
- Realista: margem calculada
- Otimista: margem 30% maior que calculada

Para cada cenário, mostre:
- Preço de venda sugerido
- Lucro por unidade
- Número de vendas necessárias para meta mensal
- Faturamento mensal estimado

Apresente em cards visuais lado a lado com cores:
- Pessimista: vermelho claro
- Realista: azul
- Otimista: verde claro
```

**PASSO 4 - Análise de Ingredientes por Foto Mock:**
```
⚠️ MOCK: Reconhecimento simulado

Adicione botão "Fotografar Ingredientes" que:
- Abre interface de upload de imagem
- Simula análise por 3-5 segundos
- Retorna lista de 3-7 ingredientes "detectados"
- Ingredientes baseados em lista pré-definida de 30+ itens comuns
- Cada ingrediente com % de confiança (85-95%)
- Usuário pode confirmar/editar lista
- Ingredientes confirmados vão automaticamente para calculadora

Lista de ingredientes para detecção mock:
- Açúcar cristal, farinha de trigo, ovos, manteiga
- Chocolate em pó, leite condensado, creme de leite
- Açúcar refinado, fermento, baunilha
- E mais 20+ ingredientes comuns

🔄 PRODUÇÃO: Usar Google Vision API ou similar
```

**PASSO 5 - Sistema de Relatórios Mock:**
```
⚠️ MOCK: Relatórios com dados simulados

Crie aba "Relatórios" com:
- Histórico de todos os cálculos feitos
- Filtros por data, receita, categoria
- Gráfico de evolução de custos ao longo do tempo
- Lista de ingredientes que mais encarecem
- Top 5 receitas mais calculadas
- Margem média por categoria de receita
- Botão "Exportar para Excel" (gera CSV)
- Botão "Compartilhar por Link" (gera link compartilhável)
```

**TESTE OBRIGATÓRIO:**
- Fazer cálculo simples e avançado da mesma receita
- Testar análise de cenários
- Upload de foto e simulação de detecção
- Gerar relatório e exportar
- Verificar se insights fazem sentido

---

## 🎨 **FASE 5: CATÁLOGO PERSONALIZADO**

### **PASSO 1 - Sistema de Branding Mock:**
```
⚠️ MOCK: Personalizador visual

Crie página "Minha Marca" com configurador:
- Upload de logo (ou usar placeholder)
- Seletor de cor primária (color picker)
- Seleção de cor secundária (automaticamente complementar)
- Escolha de fonte: "Moderna", "Clássica", "Divertida"
- Preview em tempo real de como fica aplicado

Salve configurações no localStorage como:
- logoUrl: string
- corPrimaria: hex
- corSecundaria: hex
- fonte: string
- nomeConfeitaria: string
- slogan: string

🔄 PRODUÇÃO: Salvar no Supabase
```

**PASSO 2 - Biblioteca de Templates Mock:**
```
⚠️ MOCK: Templates funcionais

Crie 20+ templates categorizados:

POSTS INSTAGRAM (8 templates):
- Template feed quadrado
- Template stories
- Template carrossel
- Template promoção

CARDÁPIOS (4 templates):
- Cardápio clássico
- Cardápio moderno
- Menu delivery
- Lista de preços

ETIQUETAS (4 templates):
- Etiqueta redonda
- Etiqueta retangular
- Tag para embalagem
- Adesivo promocional

BANNERS (4 templates):
- Banner Facebook
- Banner WhatsApp Status
- Capa para redes sociais
- Flyer promocional

Cada template deve ser SVG editável com áreas marcadas para:
- Logo da marca
- Nome do produto
- Preço
- Imagem do produto
- Informações de contato
```

**PASSO 3 - Editor Simples Mock:**
```
⚠️ MOCK: Editor funcional básico

Implemente editor básico:
- Área de preview do template selecionado
- Sidebar com elementos editáveis
- Campos de texto para nome produto, preço, descrição
- Upload de imagem do produto
- Aplicação automática das cores da marca
- Botão "Aplicar" para ver mudanças
- Zoom in/out para visualização

Não precisa ser complexo - foque na funcionalidade básica.
```

**PASSO 4 - Geração Automática Mock:**
```
⚠️ MOCK: Geração em lote

Crie funcionalidade "Gerar em Lote":
- Usuário seleciona template
- Sistema pega todas as receitas salvas
- Gera automaticamente um post/card para cada receita
- Aplica branding consistente
- Preenche nome, preço (da calculadora), imagem placeholder
- Usuário pode editar individualmente se quiser
- Download de todos em ZIP
```

**TESTE OBRIGATÓRIO:**
- Configurar marca personalizada
- Criar template customizado
- Gerar posts em lote
- Exportar e verificar qualidade
- Testar em diferentes dispositivos

---

## 📦 **FASE 6: EXPORT DELIVERY**

### **PASSO 1 - Seleção de Produtos Mock:**
```
⚠️ MOCK: Manager de delivery simulado

Crie página "Delivery Manager" com:
- Lista de todas as receitas do usuário
- Checkbox para ativar no delivery
- Campos específicos para delivery:
  - Tempo de preparo (15-120 minutos)
  - Descrição para delivery (máx 200 chars)
  - Categoria delivery (Bolos, Doces, Sobremesas, etc)
  - Disponibilidade (todos dias, fins de semana, sob encomenda)
  - Quantidade mínima
  - Zona de entrega (bairros)
```

**PASSO 2 - Otimizador de Preços Mock:**
```
⚠️ MOCK: Cálculo automático de preços

Para cada produto ativado, calcule automaticamente:
- Preço base (da calculadora)
- + Taxa delivery configurável (R$ 3-8)
- + Comissão plataforma (iFood 12-27%, Uber 18-35%)
- + Margem adicional delivery (10-20%)
- Preço final sugerido para cada plataforma

Mostre comparativo visual:
- Preço loja física: R$ X
- Preço iFood: R$ Y
- Preço Uber Eats: R$ Z
- Lucro por plataforma
```

**PASSO 3 - Gerador Multi-Plataforma Mock:**
```
⚠️ MOCK: Exportação para plataformas

Crie exportação específica para cada plataforma:

IFOOD (CSV):
- Colunas: nome, descrição, preço, categoria, tempo_preparo
- Limite descrição 200 caracteres
- Categorias padronizadas iFood
- Tratamento de caracteres especiais

UBER EATS (CSV):
- Formato específico Uber
- Campos obrigatórios diferentes
- Limite descrição 140 caracteres

RAPPI (CSV):
- Template Rappi
- Categorização própria

CARDÁPIO PRÓPRIO (PDF/HTML):
- Layout bonito para impressão
- QR Code para pedidos via WhatsApp
- Informações de contato e entrega
```

**PASSO 4 - Templates de WhatsApp Mock:**
```
⚠️ MOCK: Links e mensagens automáticas (SEM API)

Gere automaticamente:
- Link wa.me com catálogo formatado
- Mensagem padrão: "Olá! Vi seu cardápio e gostaria de..."
- QR Code para o link do WhatsApp
- Templates de mensagens de resposta
- Catálogo formatado para compartilhar

Exemplo de mensagem gerada:
"🍰 *DOCES DA MARIA* 🍰
📋 Cardálogo Delivery:

🧁 Brigadeiro Gourmet - R$ 3,50
🍰 Bolo de Chocolate - R$ 45,00
🍮 Pudim Tradicional - R$ 25,00

📞 Faça seu pedido: [LINK]
🛵 Entregamos em 60min
📍 Região Centro/Sul"

NOTA: Não usar WhatsApp Business API - apenas links manuais
```

**PASSO 5 - Dashboard Mock:**
```
⚠️ MOCK: Métricas simuladas

Simule métricas de delivery:
- Produtos mais pedidos (dados fake)
- Faturamento por plataforma
- Horários de pico
- Ticket médio
- Taxa de conversão simulada
- Gráficos de tendência

Use dados aleatórios realistas baseados no perfil do usuário.
```

**TESTE OBRIGATÓRIO:**
- Ativar 5+ produtos no delivery
- Gerar CSV para iFood e Uber
- Criar cardápio PDF próprio
- Testar links WhatsApp
- Verificar cálculos de preço



---

## ✅ **RESUMO FINAL PARA REPLIT AI**

### **IMPORTANTE:**
- **TUDO MOCK PRIMEIRO** para análise e testes
- Migração para produção posterior com Supabase + Stripe + Gemini
- Visual moderno e feminino para o público-alvo
- Funcionalidades completas mesmo em versão mock
- Landing page para demonstração visual
- Testes obrigatórios em cada fase

### **TECNOLOGIAS:**
- **Mock:** localStorage, dados estáticos, simulações
- **Produção:** Supabase (dados), Stripe (pagamento), Gemini (IA)
- **Sem WhatsApp API** - apenas links manuais
- **Visual:** Design system completo para confeiteiras

### **ENTREGÁVEIS:**
1. App funcional com todas as features em mock
2. Documentação para migração para produção