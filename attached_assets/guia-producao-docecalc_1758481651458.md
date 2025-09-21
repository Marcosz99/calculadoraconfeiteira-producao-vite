# 🚀 DoceCalc - Guia de Produção com APIs Reais

## 🎯 **VISÃO GERAL DAS MELHORIAS NECESSÁRIAS**

Baseado na análise das telas atuais e feedback, aqui estão as principais melhorias para produção:

---

## 📱 **FASE 1: CORREÇÕES CRÍTICAS DE UX**

### **1.1 - Campos Monetários (URGENTE)**

**INSTRUÇÃO PARA IA:**
```
CORRIJA todos os campos de valor monetário na aplicação:

PROBLEMAS ATUAIS:
- Campos com "0" fixo que não pode ser apagado
- Sem formatação R$ 
- Inputs que deveriam ser float mas são string
- Falta de validação de valores

IMPLEMENTAR:
1. Componente CurrencyInput personalizado:
   - Placeholder: "R$ 0,00"
   - Formatação automática enquanto digita
   - Permite apagar completamente (fica vazio)
   - Converte para number internamente
   - Máscara: R$ 999.999,99

2. Aplicar em TODOS os lugares:
   - Calculadora (preços, custos)
   - Receitas (preço sugerido)
   - Ingredientes (preço atual)
   - Orçamentos (valores)
   - Clientes (valor total)

3. Hook useFormatCurrency:
   - formatToCurrency(value) → "R$ 123,45"
   - parseCurrency("R$ 123,45") → 123.45
   - Validação de valores válidos
```

### **1.2 - Simplificação do Formulário de Receitas**

**INSTRUÇÃO PARA IA:**
```
SIMPLIFIQUE drasticamente o formulário "Nova Receita":

CAMPOS ESSENCIAIS APENAS:
- Nome da Receita (obrigatório)
- Categoria (dropdown simples: Bolos, Doces, Salgados, Outros)
- Ingredientes (busca + seleção da base de dados)
- Tempo de Preparo (slider: 15min a 4h)
- Rendimento (campo texto livre: "12 porções", "1 bolo grande")
- Modo de Preparo (textarea simples)
- Foto (upload opcional)

REMOVER:
- Dificuldade (calcular automaticamente pelo tempo)
- Tags (gerar automaticamente pela categoria)
- Preço sugerido (calcular na calculadora)
- Descrição separada (usar o modo de preparo)

INGREDIENTES - NOVO SISTEMA:
- Barra de busca inteligente
- Lista dos 50 ingredientes mais usados
- Autocomplete conforme digita
- Botão "+" ao lado de cada ingrediente
- Modal rápido para quantidade e unidade
- Lista final dos ingredientes adicionados
```

### **1.3 - Sistema de Busca de Ingredientes**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTE sistema inteligente de ingredientes:

BASE DE DADOS:
- Usar a lista de 100 ingredientes já definida
- Ordenar por frequência de uso
- Categorizar (Açúcares, Farinhas, Chocolates, etc.)

INTERFACE:
- Input de busca com ícone de lupa
- Dropdown com sugestões conforme digita
- Categorias em abas (Todos, Açúcares, Farinhas, etc.)
- Cards visuais para cada ingrediente
- Botão "Adicionar" em cada card

FUNCIONALIDADES:
- Busca por nome parcial
- Filtro por categoria
- Histórico de ingredientes mais usados pelo usuário
- Sugestões baseadas em receitas similares
```

---

## 🤖 **FASE 2: INTEGRAÇÃO GEMINI API (IA Real)**

### **2.1 - Setup Gemini API**

**INSTRUÇÃO PARA IA:**
```
CONFIGURE Gemini API para produção:

INSTALAÇÃO:
- npm install @google/generative-ai
- Variável de ambiente VITE_GEMINI_API_KEY
- Cliente configurado com tratamento de erro

SERVIÇOS:
Criar services/geminiService.ts com:
- initializeGemini()
- askQuestion(prompt, context)
- analyzeRecipe(recipe)
- suggestPricing(ingredients, costs)
- generateRecipeFromImage(imageFile)

RATE LIMITING:
- Implementar controle de créditos no Supabase
- Cache de respostas por 24h
- Fallback para mock quando API falha
- Logs de uso para monitoramento
```

### **2.2 - IA Contextualizada por Seção**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTE IA especializada em cada área:

CALCULADORA - DoceBot Precificação:
- Contexto: receita atual, ingredientes, custos
- Especialidade: otimização de preços e margens
- Prompts: análise de viabilidade, sugestões de economia

RECEITAS - DoceBot Chef:
- Contexto: receita sendo editada
- Especialidade: técnicas culinárias, substituições
- Prompts: troubleshooting, variações, dicas

GERAL - DoceBot Consultora:
- Contexto: perfil do usuário, histórico
- Especialidade: consultoria de negócios
- Prompts: marketing, gestão, crescimento

IMPLEMENTAR BOTÕES:
- Ícone de IA em cada seção relevante
- Modal de chat contextualizado
- Histórico de conversas por contexto
```

---

## 📄 **FASE 3: OCR PARA RECEITAS (Google Vision)**

### **3.1 - Upload de Foto de Caderno**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTE OCR para digitalizar receitas:

FUNCIONALIDADE:
- Botão "Digitalizar Receita" na página de receitas
- Upload de foto (câmera ou arquivo)
- Processamento com Google Vision API
- Extração de texto da imagem
- IA do Gemini para estruturar dados

FLUXO:
1. Usuário tira foto do caderno
2. Google Vision extrai texto
3. Gemini API organiza dados:
   - Nome da receita
   - Lista de ingredientes com quantidades
   - Modo de preparo estruturado
4. Pré-popula formulário de receita
5. Usuário revisa e salva

API SETUP:
- Google Vision API (1000 requests gratuitos)
- Endpoint: detectText(imageFile)
- Processamento de texto extraído
```

### **3.2 - IA para Estruturação de Dados**

**INSTRUÇÃO PARA IA:**
```
CONFIGURE prompt especializado para estruturar receitas:

PROMPT PARA GEMINI:
"Você é especialista em organizar receitas de confeitaria. 
Analise este texto extraído de uma foto e estruture em formato JSON:

Texto: [TEXTO_OCR]

Retorne JSON com:
- nome: nome da receita
- ingredientes: [{nome, quantidade, unidade}]
- modo_preparo: [passos numerados]
- tempo_estimado: minutos
- rendimento: descrição

Se algo não estiver claro, coloque null e o usuário preencherá."

VALIDAÇÃO:
- Verificar se ingredientes existem na base
- Sugerir correções para ingredientes não reconhecidos
- Validar quantidades e unidades
```

---

## 👤 **FASE 4: PERFIL COMPLETO DO USUÁRIO**

### **4.1 - Dados do Perfil**

**INSTRUÇÃO PARA IA:**
```
CRIAR página de perfil completa:

DADOS PESSOAIS:
- Nome completo
- Foto de perfil (upload)
- Nome da confeitaria
- Logo da confeitaria (upload)
- Telefone/WhatsApp
- Instagram
- Endereço completo
- Data de nascimento

DADOS DO NEGÓCIO:
- Tipo: (Hobby, MEI, Empresa)
- Tempo de experiência
- Especialidades (multi-select)
- Faturamento médio mensal
- Número de funcionários
- Principais produtos

CONFIGURAÇÕES:
- Plano atual
- Créditos de IA restantes
- Preferências de notificação
- Configurações de privacidade

LAYOUT:
- Design moderno com cards
- Upload de foto com preview
- Seções colapsáveis
- Botão "Salvar" fixo
```

### **4.2 - Validações e Dados**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTAR validações e lógica:

VALIDAÇÕES:
- CPF válido (opcional)
- Telefone com máscara
- Email único no sistema
- CEP com busca automática de endereço

DADOS NO SUPABASE:
- Expandir tabela profiles
- Campos para todos os dados acima
- Relacionamento com receitas/clientes
- Histórico de alterações

FUNCIONALIDADES:
- Preview antes de salvar
- Upload de arquivos para Cloudinary
- Integração com dados do negócio
- Export de dados LGPD
```

---

## 📊 **FASE 5: RELATÓRIOS AVANÇADOS**

### **5.1 - Dashboard com Gráficos**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTAR relatórios visuais:

BIBLIOTECA:
- Usar Recharts para gráficos
- npm install recharts

GRÁFICOS ESSENCIAIS:
1. Evolução de Vendas (linha)
   - Últimos 12 meses
   - Comparação com período anterior

2. Receitas Mais Lucrativas (barras)
   - Top 10 por margem
   - Valor absoluto vs percentual

3. Custos por Categoria (pizza)
   - Ingredientes, mão-de-obra, fixos
   - Percentual de cada categoria

4. Sazonalidade (área)
   - Vendas por mês do ano
   - Identificar padrões

FILTROS FUNCIONAIS:
- Período: 7, 30, 90 dias, 1 ano
- Categoria de receita
- Por cliente específico
- Export para PDF/Excel
```

### **5.2 - Métricas de Negócio**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTAR KPIs importantes:

CARDS DE MÉTRICAS:
- Receita Total Período
- Número de Pedidos
- Ticket Médio
- Margem Média
- Crescimento % vs período anterior

MÉTRICAS AVANÇADAS:
- Customer Lifetime Value
- Receita por Receita
- Eficiência de Ingredientes
- Performance por Canal (presencial, delivery)

INSIGHTS AUTOMÁTICOS:
- "Sua margem diminuiu 5% este mês"
- "Brigadeiro é seu produto mais rentável"
- "Dezembro foi 30% melhor que novembro"
- Sugestões de ação baseadas nos dados
```

---

## 🤝 **FASE 6: MELHORIAS NA COMUNIDADE**

### **6.1 - Compartilhamento de Receitas**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTAR sistema de compartilhamento:

BOTÃO COMPARTILHAR:
- Apenas em receitas CRIADAS pelo usuário (não de ebooks)
- Modal de confirmação: "Compartilhar com a comunidade?"
- Opção de tornar pública ou privada depois

RECEITAS NA COMUNIDADE:
- Feed de receitas compartilhadas
- Nome do autor (opcional anônimo)
- Rating e comentários
- Botão "Adicionar às Minhas Receitas"

VALIDAÇÕES:
- Usuário só compartilha receitas próprias
- Não vazar receitas de ebooks pagos
- Opção de remover receita compartilhada
- Moderação básica automática

INTERFACE:
- Feed similar ao Instagram
- Fotos das receitas
- Informações básicas
- Engajamento (likes, salvamentos)
```

---

## 📱 **FASE 7: CADASTRO INTELIGENTE DE CLIENTES**

### **7.1 - Import de Contatos WhatsApp**

**INSTRUÇÃO PARA IA:**
```
FUNCIONALIDADE SMART PARA CLIENTES:

OPÇÃO 1 - QR Code de Cadastro:
- Gerar QR Code único por confeitaria
- Cliente escaneia e preenche dados básicos
- Dados vão direto para CRM da confeitaria
- WhatsApp de confirmação automático

OPÇÃO 2 - IA de Texto:
- Campo textarea: "Cole conversa do WhatsApp"
- IA extrai: nome, telefone, preferências
- Pré-popula formulário de cliente
- Usuário confirma e salva

OPÇÃO 3 - Import de Agenda:
- Upload de arquivo CSV/TXT
- Mapeamento inteligente de campos
- Validação e limpeza de dados
- Import em lote com preview

IMPLEMENTAR:
- Interface simples com 3 botões
- "Cadastro Manual", "QR Code", "Import Inteligente"
- Cada opção em modal específico
```

### **7.2 - Validação e Enriquecimento**

**INSTRUÇÃO PARA IA:**
```
MELHORAR dados dos clientes:

VALIDAÇÕES:
- Telefone no formato correto
- WhatsApp existente (via API pública)
- CEP com endereço automático
- Email válido

ENRIQUECIMENTO:
- Buscar foto de perfil (se autorizado)
- Detectar aniversários próximos
- Histórico de pedidos automático
- Preferências baseadas em comportamento

IA PARA INSIGHTS:
- "Cliente não compra há 30 dias"
- "Gosta mais de chocolate"
- "Frequência: quinzenal"
- "Ticket médio: R$ 45"
```

---

## 🎨 **FASE 8: MELHORIAS NO CATÁLOGO**

### **8.1 - Customização Avançada**

**INSTRUÇÃO PARA IA:**
```
EXPANDIR personalizização do catálogo:

SELETOR DE CORES:
- Além das cores fixas, adicionar:
- Color picker completo (roda de cores)
- Paletas sugeridas baseadas na logo
- Preview em tempo real
- Salvar paletas customizadas

FONTES ADICIONAIS:
- Adicionar mais 5 fontes:
  - "Elegante" (serif)
  - "Moderna" (sans-serif atual)
  - "Divertida" (rounded)
  - "Clássica" (times)
  - "Artesanal" (handwritten)
  - "Clean" (minimal)

ELEMENTOS VISUAIS:
- Bordas decorativas opcionais
- Ícones temáticos (bolos, doces)
- Patterns de fundo sutis
- Separadores personalizados
```

### **8.2 - Catálogo Funcional**

**INSTRUÇÃO PARA IA:**
```
IMPLEMENTAR a aba de PRODUTOS do catálogo:

FUNCIONALIDADE PRINCIPAL:
- Aba "Produtos" ao lado de "Personalização"
- Lista de todas as receitas do usuário
- Toggle ON/OFF para cada receita
- Campos específicos para catálogo:
  - Foto do produto final
  - Descrição para clientes
  - Preço público (pode ser diferente do calculado)
  - Disponibilidade (sempre, sob encomenda)

GERAÇÃO DO CATÁLOGO:
- Apenas receitas ativadas aparecem
- Layout responsivo automático
- QR Code único para o catálogo
- Link compartilhável: app.com/catalogo/{userId}
- Página pública sem necessidade de login

PÁGINA PÚBLICA:
- Header com nome/logo da confeitaria
- Grid de produtos com fotos
- Preços atualizados
- Botão WhatsApp para pedidos
- Design baseado na personalização escolhida
```

---

## 💰 **FASE 9: CONTROLE FINANCEIRO**

### **9.1 - Upload de Comprovantes**

**INSTRUÇÃO PARA IA:**
```
SISTEMA de controle financeiro por upload:

FUNCIONALIDADE:
- Seção "Financeiro" no menu
- Upload de fotos de notas fiscais
- Upload de comprovantes de venda
- OCR para extrair valores automaticamente
- IA para categorizar receitas/despesas

PROCESSAMENTO:
1. Google Vision para ler texto da nota
2. Gemini para extrair dados estruturados
3. Categorização automática
4. Usuário confirma/corrige
5. Salva no sistema financeiro

DADOS EXTRAÍDOS:
- Valor total
- Data da transação
- Categoria (ingredientes, equipamentos, vendas)
- Fornecedor/Cliente
- Método de pagamento

RELATÓRIOS:
- Receitas vs Despesas
- Fluxo de caixa mensal
- Categorização de gastos
- Margem real do negócio
```

### **9.2 - Dashboard Financeiro**

**INSTRUÇÃO PARA IA:**
```
CRIAR visão financeira completa:

CARDS PRINCIPAIS:
- Receita Total Mês
- Despesas Total Mês
- Lucro Líquido
- Margem Real %

GRÁFICOS:
- Evolução de lucro (linha)
- Despesas por categoria (pizza)
- Comparativo mensal (barras)
- Meta vs Realizado

INSIGHTS:
- "Gasto com ingredientes subiu 15%"
- "Margem real: 28% (vs 35% calculada)"
- "Melhor mês dos últimos 6"
```

---

## 🔍 **CONTROLE DE ESTOQUE INTELIGENTE**

### **Sugestão Separada - Não Implementar Agora**

```
IDEIA PARA FUTURO: Controle de estoque por foto

CONCEITO:
- Foto da geladeira/despensa
- IA reconhece ingredientes disponíveis
- Atualiza estoque automaticamente
- Alerta de reposição inteligente

DESAFIO:
- Muito complexo para implementar agora
- Precisaria IA muito avançada
- Margem de erro alta
- Melhor focar no essencial

RECOMENDAÇÃO: 
- Manter controle manual atual
- Talvez futura integração com fornecedores
- Por agora, foco na experiência principal
```

---

## 🚀 **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **SEMANA 1-2: Correções Críticas**
- Campos monetários formatados
- Formulários simplificados
- Sistema de ingredientes

### **SEMANA 3-4: APIs Principais**
- Gemini API integrada
- OCR para receitas
- Perfil completo

### **SEMANA 5-6: Funcionalidades Avançadas**
- Relatórios com gráficos
- Comunidade melhorada
- Catálogo funcional

### **SEMANA 7-8: Inteligências**
- Cadastro inteligente de clientes
- Controle financeiro
- Polish final

---

## 💡 **INSIGHTS PARA COMPETITIVIDADE**

### **DIFERENCIAIS ÚNICOS:**
1. **IA Contextualizada** - Cada seção tem sua especialista
2. **OCR de Receitas** - Digitalizar cadernos antigos
3. **Catálogo Dinâmico** - QR Code que sempre atualiza
4. **Comunidade Ativa** - Troca real entre profissionais
5. **Financeiro por Foto** - Sem planilhas complicadas

### **VANTAGEM COMPETITIVA:**
- Primeiro a usar IA especializada em confeitaria
- Única plataforma com OCR para receitas
- Sistema mais completo do mercado brasileiro
- UX pensada para confeiteiras (não programadores)

**RESULTADO:** Aplicação profissional que resolve TODOS os problemas reais das confeiteiras, muito superior aos concorrentes atuais.
