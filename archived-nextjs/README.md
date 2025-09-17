# Arquivos Next.js Removidos

Esta pasta contém todos os arquivos do projeto Next.js original que foram removidos durante a migração para Vite.

## Conteúdo Arquivado:
- **app/**: Páginas e APIs do Next.js App Router
- **components/**: Componentes UI e providers de auth complexos
- **server/**: Configurações de banco PostgreSQL
- **sql/**: Scripts SQL e schemas de banco
- **lib/**: Utilitários, auth, e configurações de DB

## Dependências Removidas:
- Next.js framework
- Stripe para pagamentos
- Supabase para auth/database
- Drizzle ORM para PostgreSQL
- bcryptjs para hash de senhas
- WebSocket (ws)

## Como Reativar:
Para voltar a usar essas funcionalidades:

1. **Banco de dados**: Instalar Supabase ou Firebase
2. **Pagamentos**: Reinstalar Stripe
3. **Auth**: Configurar Supabase Auth ou similar
4. **API Routes**: Migrar para backend separado ou Next.js

## Nota:
O projeto atual usa localStorage e dados mock para demonstração.
Para produção, implemente auth e DB adequados.