# DespachoSys Pro v2.0 - Guia Completo de Configuração de Variáveis de Ambiente

## Introdução

Este guia descreve como configurar corretamente todas as variáveis de ambiente necessárias para executar o DespachoSys Pro localmente ou em um servidor.

---

## Passo 1: Criar o Arquivo .env

Na raiz do projeto (onde está o arquivo `package.json`), crie um arquivo chamado `.env`:

```bash
# No Linux/Mac
touch .env

# No Windows (PowerShell)
New-Item -Path .env -ItemType File
```

Ou simplesmente crie um arquivo de texto vazio e renomeie para `.env`.

---

## Passo 2: Configurar as Variáveis

Abra o arquivo `.env` em um editor de texto (VS Code, Notepad++, etc.) e adicione as seguintes variáveis:

### 2.1 Configuração do Banco de Dados

```env
DATABASE_URL=mysql://despachosys:sua_senha@localhost:3306/despachosys_pro
```

**Explicação:**
- `mysql://` - Tipo de banco de dados
- `despachosys` - Usuário do MySQL (criado no passo 3 do manual)
- `sua_senha` - Senha do usuário (que você definiu ao criar o usuário)
- `localhost` - Host onde MySQL está rodando (localhost = seu computador)
- `3306` - Porta padrão do MySQL
- `despachosys_pro` - Nome do banco de dados

**Exemplos:**
```env
# Servidor local com senha "minhasenha123"
DATABASE_URL=mysql://despachosys:minhasenha123@localhost:3306/despachosys_pro

# Servidor remoto
DATABASE_URL=mysql://despachosys:minhasenha123@seu-servidor.com.br:3306/despachosys_pro

# Servidor remoto com porta customizada
DATABASE_URL=mysql://despachosys:minhasenha123@seu-servidor.com.br:3307/despachosys_pro
```

### 2.2 Chave JWT para Autenticação

```env
JWT_SECRET=sua_chave_jwt_super_segura_aqui_minimo_32_caracteres
```

**Como gerar uma chave segura:**

**No Linux/Mac:**
```bash
openssl rand -base64 32
```

**No Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

**Ou use um gerador online:**
https://generate-random.org/encryption-key-generator

**Exemplo:**
```env
JWT_SECRET=x7kL9mP2qW5vN8bY3jH6gF1tR4sZ0cX9dE2wQ5uI8oL1pK4mJ7nV
```

### 2.3 Configuração OAuth Manus

Se você está usando a plataforma Manus para autenticação:

```env
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

**Para desenvolvimento local sem Manus:**
```env
VITE_APP_ID=local-dev
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 2.4 Informações do Proprietário

```env
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id
```

**Explicação:**
- `OWNER_NAME` - Seu nome completo
- `OWNER_OPEN_ID` - ID único (pode ser qualquer valor único, ex: seu email ou um UUID)

**Exemplos:**
```env
OWNER_NAME=João Silva
OWNER_OPEN_ID=joao.silva@empresa.com.br
```

### 2.5 APIs Internas (Manus)

```env
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
```

**Se não está usando Manus, use valores padrão:**
```env
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=test-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=test-key
```

### 2.6 Configuração do Frontend

```env
VITE_APP_TITLE=DespachoSys Pro
VITE_APP_LOGO=/logo.svg
```

**Explicação:**
- `VITE_APP_TITLE` - Título que aparece na aba do navegador
- `VITE_APP_LOGO` - Caminho da logo (relativo a `client/public/`)

### 2.7 Analytics (Opcional)

```env
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

Se não usar analytics, deixe em branco:
```env
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

---

## Arquivo .env Completo - Exemplo Pronto para Copiar

Copie e cole este conteúdo no seu arquivo `.env` e preencha com seus valores:

```env
# ============================================================================
# BANCO DE DADOS
# ============================================================================
DATABASE_URL=mysql://despachosys:sua_senha_aqui@localhost:3306/despachosys_pro

# ============================================================================
# AUTENTICAÇÃO
# ============================================================================
JWT_SECRET=sua_chave_jwt_super_segura_aqui_minimo_32_caracteres

# ============================================================================
# OAUTH MANUS
# ============================================================================
VITE_APP_ID=local-dev
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# ============================================================================
# PROPRIETÁRIO
# ============================================================================
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_email@empresa.com.br

# ============================================================================
# APIs INTERNAS
# ============================================================================
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=test-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=test-key

# ============================================================================
# FRONTEND
# ============================================================================
VITE_APP_TITLE=DespachoSys Pro
VITE_APP_LOGO=/logo.svg

# ============================================================================
# ANALYTICS (Opcional)
# ============================================================================
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

---

## Passo 3: Validar a Configuração

Após criar o arquivo `.env`, verifique se está correto:

```bash
# Listar conteúdo do arquivo (Linux/Mac)
cat .env

# Ou no Windows (PowerShell)
Get-Content .env
```

Você deve ver algo como:
```
DATABASE_URL=mysql://despachosys:minhasenha@localhost:3306/despachosys_pro
JWT_SECRET=x7kL9mP2qW5vN8bY3jH6gF1tR4sZ0cX9dE2wQ5uI8oL1pK4mJ7nV
VITE_APP_ID=local-dev
...
```

---

## Passo 4: Testar a Conexão com o Banco de Dados

Antes de prosseguir, teste se a conexão está funcionando:

```bash
# Instale as dependências primeiro (se não fez ainda)
pnpm install

# Tente conectar ao banco
pnpm db:push
```

**Se der erro de conexão:**

1. **Erro: "Access denied for user"**
   - Verifique o usuário e senha no DATABASE_URL
   - Certifique-se de que o usuário foi criado corretamente

2. **Erro: "Can't connect to MySQL server"**
   - Verifique se MySQL está rodando
   - Verifique se o host está correto (localhost vs 127.0.0.1)
   - Verifique a porta (padrão é 3306)

3. **Erro: "Unknown database"**
   - O banco de dados não foi criado
   - Execute: `mysql -u root -p < database_schema.sql`

---

## Passo 5: Iniciar o Servidor

Após configurar o `.env` e validar a conexão:

```bash
# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor iniciará em: **http://localhost:3000**

---

## Troubleshooting

### Problema: "Error: ENOENT: no such file or directory, open '.env'"

**Solução:** O arquivo `.env` não foi criado. Crie-o manualmente na raiz do projeto.

### Problema: "DATABASE_URL is not set"

**Solução:** A variável `DATABASE_URL` não está no arquivo `.env`. Verifique se está digitada corretamente (sem espaços extras).

### Problema: "Cannot find module 'dotenv'"

**Solução:** Execute `pnpm install` para instalar as dependências.

### Problema: "Connection refused"

**Solução:** MySQL não está rodando. Inicie o MySQL:
```bash
# Linux
sudo systemctl start mysql

# Mac
brew services start mysql

# Windows
net start MySQL80
```

### Problema: "Access denied for user 'despachosys'@'localhost'"

**Solução:** Verifique a senha no DATABASE_URL. Deve corresponder à senha que você definiu ao criar o usuário.

---

## Próximos Passos

Após configurar o `.env`:

1. Execute `pnpm db:push` para criar as tabelas
2. Execute `pnpm dev` para iniciar o servidor
3. Acesse http://localhost:3000 no navegador
4. Faça login com suas credenciais

---

## Dúvidas Frequentes

**P: Posso usar um banco de dados remoto?**
R: Sim! Basta alterar o `DATABASE_URL` para apontar para seu servidor remoto:
```env
DATABASE_URL=mysql://usuario:senha@seu-servidor.com.br:3306/despachosys_pro
```

**P: Preciso de todas essas variáveis?**
R: Sim, todas são necessárias. Se não usar Manus OAuth, use valores padrão como mostrado no exemplo.

**P: Posso compartilhar o arquivo .env?**
R: **NÃO!** O arquivo `.env` contém senhas e chaves secretas. Nunca o compartilhe ou faça commit no Git.

**P: Como gero uma chave JWT segura?**
R: Use um gerador online (https://generate-random.org/) ou execute:
```bash
openssl rand -base64 32
```

---

## Resumo Rápido

1. Crie arquivo `.env` na raiz do projeto
2. Copie as variáveis do exemplo acima
3. Preencha com seus valores (banco de dados, senhas, etc.)
4. Execute `pnpm db:push`
5. Execute `pnpm dev`
6. Acesse http://localhost:3000

Pronto! O sistema está configurado e pronto para uso.

---

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Desenvolvido por:** DespachoSys Team
