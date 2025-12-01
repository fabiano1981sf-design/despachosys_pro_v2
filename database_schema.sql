-- DespachoSys Pro v2.0 - Database Schema
-- Criado em: Dezembro 2024

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS despachosys_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE despachosys_pro;

-- Tabela: users (Usuários)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_openId (openId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: mercadorias
CREATE TABLE IF NOT EXISTS mercadorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  descricao TEXT,
  categoriaId INT,
  quantidadeEstoque INT DEFAULT 0,
  precoCusto INT,
  precoVenda INT,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (categoriaId) REFERENCES categorias(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_sku (sku),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('fisica', 'juridica') NOT NULL,
  nome VARCHAR(255),
  cpf VARCHAR(20),
  razaoSocial VARCHAR(255),
  nomeFantasia VARCHAR(255),
  cnpj VARCHAR(20),
  email VARCHAR(320),
  telefone VARCHAR(20),
  endereco TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_nome (nome),
  INDEX idx_cpf (cpf),
  INDEX idx_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: transportadoras
CREATE TABLE IF NOT EXISTS transportadoras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(320),
  endereco TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: despachos
CREATE TABLE IF NOT EXISTS despachos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT NOT NULL,
  mercadoriaId INT NOT NULL,
  quantidade INT NOT NULL,
  codigoRastreio VARCHAR(100),
  transportadoraId INT,
  status ENUM('pendente', 'em_transito', 'entregue', 'cancelado') DEFAULT 'pendente',
  observacao TEXT,
  dataDespacho TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (mercadoriaId) REFERENCES mercadorias(id),
  FOREIGN KEY (transportadoraId) REFERENCES transportadoras(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_codigoRastreio (codigoRastreio),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: estoque_movimentacoes
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mercadoriaId INT NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  quantidade INT NOT NULL,
  motivo TEXT,
  observacao TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (mercadoriaId) REFERENCES mercadorias(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_tipo (tipo),
  INDEX idx_mercadoriaId (mercadoriaId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: oportunidades
CREATE TABLE IF NOT EXISTS oportunidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  valorEstimado INT,
  probabilidade INT DEFAULT 50,
  status ENUM('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'ganho', 'perdido') DEFAULT 'prospeccao',
  dataFechamentoEstimada DATE,
  dataFechamento DATE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_clienteId (clienteId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: pedidos_venda
CREATE TABLE IF NOT EXISTS pedidos_venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT NOT NULL,
  numero VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('rascunho', 'aprovado', 'faturado', 'cancelado') DEFAULT 'rascunho',
  valorTotal INT NOT NULL,
  desconto INT DEFAULT 0,
  observacao TEXT,
  dataEmissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_numero (numero),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: pedidos_venda_itens
CREATE TABLE IF NOT EXISTS pedidos_venda_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedidoId INT NOT NULL,
  mercadoriaId INT NOT NULL,
  quantidade INT NOT NULL,
  precoUnitario INT NOT NULL,
  desconto INT DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedidoId) REFERENCES pedidos_venda(id) ON DELETE CASCADE,
  FOREIGN KEY (mercadoriaId) REFERENCES mercadorias(id),
  INDEX idx_pedidoId (pedidoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: plano_contas
CREATE TABLE IF NOT EXISTS plano_contas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  tipo ENUM('receita', 'despesa') NOT NULL,
  parentId INT,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES plano_contas(id),
  INDEX idx_codigo (codigo),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: contas_pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor INT NOT NULL,
  dataVencimento DATE NOT NULL,
  dataPagamento DATE,
  fornecedor VARCHAR(255),
  planoContasId INT,
  status ENUM('aberto', 'pago', 'vencido', 'cancelado') DEFAULT 'aberto',
  observacao TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (planoContasId) REFERENCES plano_contas(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_dataVencimento (dataVencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: contas_receber
CREATE TABLE IF NOT EXISTS contas_receber (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor INT NOT NULL,
  dataVencimento DATE NOT NULL,
  dataRecebimento DATE,
  clienteId INT,
  planoContasId INT,
  status ENUM('aberto', 'recebido', 'vencido', 'cancelado') DEFAULT 'aberto',
  observacao TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (planoContasId) REFERENCES plano_contas(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_dataVencimento (dataVencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar usuário padrão (opcional)
INSERT IGNORE INTO users (openId, name, email, role) VALUES 
('admin-default', 'Administrador', 'admin@despachosys.com.br', 'admin');

-- Criar plano de contas padrão
INSERT IGNORE INTO plano_contas (codigo, nome, tipo) VALUES 
('1', 'RECEITAS', 'receita'),
('1.1', 'Vendas de Produtos', 'receita'),
('1.2', 'Serviços', 'receita'),
('2', 'DESPESAS', 'despesa'),
('2.1', 'Custos Operacionais', 'despesa'),
('2.2', 'Despesas Administrativas', 'despesa'),
('2.3', 'Impostos e Taxas', 'despesa');

-- Criar categorias padrão
INSERT IGNORE INTO categorias (nome, descricao) VALUES 
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Vestuário', 'Roupas e acessórios'),
('Alimentos', 'Produtos alimentícios'),
('Outros', 'Outros produtos');

