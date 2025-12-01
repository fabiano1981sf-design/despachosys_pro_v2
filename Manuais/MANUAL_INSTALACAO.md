# DespachoSys Pro v2.0 - Manual de Instalação

## Visão Geral

O **DespachoSys Pro** é um sistema ERP/CRM completo desenvolvido com tecnologias modernas para gerenciar despachos, estoque, vendas e finanças. Este manual descreve os procedimentos necessários para instalar e configurar o sistema em seu ambiente.

---

## Requisitos do Sistema

Antes de instalar o DespachoSys Pro, certifique-se de que seu servidor atende aos seguintes requisitos:

| Componente | Versão Mínima | Versão Recomendada |
|-----------|---------------|-------------------|
| Node.js | 18.0.0 | 22.13.0 ou superior |
| npm/pnpm | 9.0.0 | 10.4.1 ou superior |
| MySQL | 5.7 | 8.0 ou superior |
| Espaço em Disco | 500 MB | 2 GB |
| RAM | 2 GB | 4 GB ou superior |

O sistema foi desenvolvido com **React 19**, **Express 4**, **tRPC 11** e **Drizzle ORM**, garantindo performance e segurança.

---

## Instalação Passo a Passo

### 1. Preparar o Ambiente

Comece instalando as dependências globais necessárias:

```bash
# Instalar Node.js (se ainda não instalado)
# Visite https://nodejs.org/ e baixe a versão LTS

# Verificar instalação
node --version
npm --version
```

### 2. Clonar ou Extrair o Projeto

Se você recebeu o projeto compactado, extraia-o em um diretório de sua escolha:

```bash
# Extrair arquivo
unzip despachosys_pro_v2.zip
cd despachosys_pro_v2
```

### 3. Instalar Dependências do Projeto

Com o projeto extraído, instale todas as dependências necessárias:

```bash
# Instalar dependências usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install
```

### 4. Configurar Banco de Dados

O DespachoSys Pro utiliza MySQL como banco de dados. Siga os passos abaixo:

#### 4.1 Criar Banco de Dados

Acesse seu servidor MySQL e execute:

```sql
CREATE DATABASE despachosys_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'despachosys'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON despachosys_pro.* TO 'despachosys'@'localhost';
FLUSH PRIVILEGES;
```

#### 4.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://despachosys:sua_senha_segura@localhost:3306/despachosys_pro

# Autenticação
JWT_SECRET=sua_chave_jwt_segura_aqui_minimo_32_caracteres

# OAuth Manus (obtenha em https://manus.im)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Informações do Proprietário
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id

# APIs Internas
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api

# Frontend
VITE_APP_TITLE=DespachoSys Pro
VITE_APP_LOGO=/logo.svg
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
```

### 5. Executar Migrações do Banco de Dados

Crie as tabelas e estrutura do banco de dados:

```bash
# Gerar e executar migrações
pnpm db:push
```

Este comando criará automaticamente todas as tabelas necessárias no banco de dados.

### 6. Iniciar o Servidor de Desenvolvimento

Para testar a instalação, inicie o servidor de desenvolvimento:

```bash
# Iniciar servidor
pnpm dev

# O servidor estará disponível em http://localhost:3000
```

---

## Compilação para Produção

Quando estiver pronto para colocar o sistema em produção, siga estes passos:

### 1. Compilar o Projeto

```bash
# Compilar frontend e backend
pnpm build
```

### 2. Iniciar em Produção

```bash
# Iniciar servidor em modo produção
NODE_ENV=production pnpm start
```

### 3. Usar Reverse Proxy (Recomendado)

Configure um reverse proxy como Nginx para melhor performance:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
despachosys_pro_v2/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas do sistema
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente principal
│   └── public/            # Arquivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de procedimentos tRPC
│   ├── db.ts              # Helpers de banco de dados
│   └── _core/             # Configurações internas
├── drizzle/               # Migrações e schema
│   └── schema.ts          # Definição de tabelas
├── shared/                # Código compartilhado
└── package.json           # Dependências do projeto
```

---

## Troubleshooting

### Erro de Conexão com Banco de Dados

Se receber erro ao conectar com MySQL:

1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Certifique-se de que o banco de dados foi criado

```bash
# Testar conexão
mysql -u despachosys -p -h localhost
```

### Porta 3000 Já em Uso

Se a porta 3000 estiver em uso, altere a porta no arquivo de configuração ou mate o processo:

```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro de Permissões

Se encontrar erros de permissão ao instalar dependências:

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules
pnpm install
```

---

## Configuração de Segurança

Para garantir a segurança do seu sistema em produção:

1. **Altere a senha padrão** do usuário administrador após a primeira login
2. **Use HTTPS** em produção (configure certificado SSL/TLS)
3. **Configure firewall** para permitir apenas portas necessárias
4. **Faça backups regulares** do banco de dados
5. **Mantenha o sistema atualizado** com as últimas versões de dependências

---

## Suporte e Documentação

Para mais informações e suporte:

- **Documentação**: Consulte o arquivo `MANUAL_USO.md`
- **Problemas**: Verifique a seção de Troubleshooting acima
- **Contato**: suporte@despachosys.com.br

---

**Versão do Manual**: 1.0  
**Data de Atualização**: Dezembro 2024  
**Desenvolvido por**: DespachoSys Team
