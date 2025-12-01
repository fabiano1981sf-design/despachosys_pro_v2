CREATE TABLE `categorias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categorias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('PF','PJ') NOT NULL DEFAULT 'PF',
	`nome` varchar(255),
	`razaoSocial` varchar(255),
	`nomeFantasia` varchar(255),
	`cpfCnpj` varchar(18),
	`email` varchar(255),
	`telefone` varchar(20),
	`celular` varchar(20),
	`endereco` text,
	`cidade` varchar(100),
	`estado` varchar(2),
	`cep` varchar(10),
	`potencial` enum('Baixo','Medio','Alto') NOT NULL DEFAULT 'Medio',
	`ativo` boolean NOT NULL DEFAULT true,
	`observacao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `configuracoes` (
	`chave` varchar(100) NOT NULL,
	`valor` text,
	`descricao` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `configuracoes_chave` PRIMARY KEY(`chave`)
);
--> statement-breakpoint
CREATE TABLE `contasAPagar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` int NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`dataPagamento` timestamp,
	`status` enum('aberto','pago','vencido','cancelado') NOT NULL DEFAULT 'aberto',
	`fornecedorNome` varchar(255),
	`planoContaId` int,
	`observacao` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contasAPagar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contasAReceber` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` int NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`dataRecebimento` timestamp,
	`status` enum('aberto','recebido','vencido','cancelado') NOT NULL DEFAULT 'aberto',
	`clienteId` int,
	`planoContaId` int,
	`observacao` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contasAReceber_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `despachos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int NOT NULL,
	`mercadoriaId` int NOT NULL,
	`quantidade` int NOT NULL,
	`codigoRastreio` varchar(100),
	`transportadoraId` int,
	`status` enum('pendente','em_transito','entregue','cancelado') NOT NULL DEFAULT 'pendente',
	`observacao` text,
	`userId` int NOT NULL,
	`dataDespacho` timestamp NOT NULL DEFAULT (now()),
	`dataEntrega` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `despachos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `estoqueMovimentacao` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mercadoriaId` int NOT NULL,
	`tipo` enum('entrada','saida') NOT NULL,
	`quantidade` int NOT NULL,
	`motivo` varchar(255),
	`observacao` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `estoqueMovimentacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mercadorias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`sku` varchar(50),
	`categoriaId` int,
	`descricao` text,
	`precoCusto` int NOT NULL DEFAULT 0,
	`precoVenda` int NOT NULL DEFAULT 0,
	`quantidadeEstoque` int NOT NULL DEFAULT 0,
	`unidade` varchar(10) NOT NULL DEFAULT 'UN',
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mercadorias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oportunidades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`valorEstimado` int NOT NULL DEFAULT 0,
	`status` enum('prospeccao','qualificacao','proposta','negociacao','ganho','perdido') NOT NULL DEFAULT 'prospeccao',
	`probabilidade` int NOT NULL DEFAULT 0,
	`dataFechamentoEstimada` timestamp,
	`dataFechamento` timestamp,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oportunidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pedidosVenda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int NOT NULL,
	`numero` varchar(50) NOT NULL,
	`status` enum('rascunho','aprovado','faturado','cancelado') NOT NULL DEFAULT 'rascunho',
	`valorTotal` int NOT NULL DEFAULT 0,
	`desconto` int NOT NULL DEFAULT 0,
	`observacao` text,
	`userId` int NOT NULL,
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`dataAprovacao` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pedidosVenda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pedidosVendaItens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pedidoVendaId` int NOT NULL,
	`mercadoriaId` int NOT NULL,
	`quantidade` int NOT NULL,
	`precoUnitario` int NOT NULL,
	`desconto` int NOT NULL DEFAULT 0,
	`total` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pedidosVendaItens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planoContas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`tipo` enum('receita','despesa') NOT NULL,
	`parentId` int,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `planoContas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transportadoras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cnpj` varchar(18),
	`telefone` varchar(20),
	`email` varchar(255),
	`endereco` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transportadoras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','despachante','visualizador') NOT NULL DEFAULT 'user';