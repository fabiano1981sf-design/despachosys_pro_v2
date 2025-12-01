# despachosys_pro_v2

DespachoSys Pro v2.0 - FSISTEMAS

Bem-vindo ao DespachoSys Pro! Este pacote contém o sistema ERP/CRM completo pronto para instalação.

CONTEÚDO DO PACOTE:
- client/                    Frontend React com interface completa
- server/                    Backend Express com API tRPC
- drizzle/                   Schema e migrações do banco de dados
- package.json               Dependências do projeto
- MANUAL_INSTALACAO.pdf      Guia completo de instalação
- MANUAL_USO.pdf             Guia de uso do sistema
- database_schema.sql        Schema SQL do banco de dados
- LEIA-ME.txt                Este arquivo

INÍCIO RÁPIDO:

1. Pré-requisitos:
   - Node.js 18+ (https://nodejs.org/)
   - MySQL 5.7+ (https://www.mysql.com/)
   - pnpm (instale com: npm install -g pnpm)

2. Instalação Básica:
   a) Extrair o pacote
   b) Instalar dependências: pnpm install
   c) Configurar banco de dados com suas credenciais
   d) Criar tabelas: pnpm db:push
   e) Iniciar servidor: pnpm dev

O sistema estará disponível em: http://localhost:3000

DOCUMENTAÇÃO:
- MANUAL_INSTALACAO.pdf - Instruções detalhadas de instalação
- MANUAL_USO.pdf - Guia completo de funcionalidades

FUNCIONALIDADES PRINCIPAIS:

WMS & Logística:
✓ Gestão de Mercadorias
✓ Controle de Estoque
✓ Despachos com Rastreamento
✓ Transportadoras

CRM & Vendas:
✓ Gestão de Clientes
✓ Pipeline de Oportunidades
✓ Pedidos de Venda
✓ Rastreamento Público

Financeiro:
✓ Plano de Contas
✓ Contas a Pagar
✓ Contas a Receber
✓ Controle de Vencimentos

Administração:
✓ Gestão de Usuários
✓ Configurações do Sistema
✓ Dashboard Executivo

SEGURANÇA:
- Autenticação OAuth integrada
- Criptografia de dados
- Logs de auditoria
- Controle de permissões por função

TECNOLOGIAS:
- Frontend: React 19, Tailwind CSS 4, shadcn/ui
- Backend: Express 4, tRPC 11, Drizzle ORM
- Banco de Dados: MySQL 8
- Autenticação: OAuth
- Build: Vite, esbuild

DICAS IMPORTANTES:
1. Faça backups frequentes do banco de dados
2. Mantenha as dependências atualizadas
3. Use HTTPS em produção
4. Configure um reverse proxy (Nginx/Apache)

SUPORTE:
- Consulte os manuais PDF inclusos
- Contato: fabiano1981.fs@gmail.com

Versão: 2.0.0
Data: Dezembro 2025
Desenvolvido por: Fabiano silva

Pronto para começar? Siga o MANUAL_INSTALACAO.pdf para instruções detalhadas!
