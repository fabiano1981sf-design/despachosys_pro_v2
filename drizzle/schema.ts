import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, unique } from "drizzle-orm/mysql-core";

/**
 * Schema completo do DespachoSys Pro
 * Sistema ERP/CRM para despachantes com módulos WMS, CRM e Financeiro
 */

// ============================================
// TABELA DE USUÁRIOS (AUTH)
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "despachante", "visualizador"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// MÓDULO WMS & LOGÍSTICA
// ============================================

// Categorias de mercadorias
export const categorias = mysqlTable("categorias", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Categoria = typeof categorias.$inferSelect;
export type InsertCategoria = typeof categorias.$inferInsert;

// Mercadorias/Produtos
export const mercadorias = mysqlTable("mercadorias", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 50 }),
  categoriaId: int("categoriaId"),
  descricao: text("descricao"),
  precoCusto: int("precoCusto").default(0).notNull(), // em centavos
  precoVenda: int("precoVenda").default(0).notNull(), // em centavos
  quantidadeEstoque: int("quantidadeEstoque").default(0).notNull(),
  unidade: varchar("unidade", { length: 10 }).default("UN").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mercadoria = typeof mercadorias.$inferSelect;
export type InsertMercadoria = typeof mercadorias.$inferInsert;

// Transportadoras
export const transportadoras = mysqlTable("transportadoras", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  endereco: text("endereco"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transportadora = typeof transportadoras.$inferSelect;
export type InsertTransportadora = typeof transportadoras.$inferInsert;

// Despachos
export const despachos = mysqlTable("despachos", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").notNull(),
  mercadoriaId: int("mercadoriaId").notNull(),
  quantidade: int("quantidade").notNull(),
  codigoRastreio: varchar("codigoRastreio", { length: 100 }),
  transportadoraId: int("transportadoraId"),
  status: mysqlEnum("status", ["pendente", "em_transito", "entregue", "cancelado"]).default("pendente").notNull(),
  observacao: text("observacao"),
  userId: int("userId").notNull(),
  dataDespacho: timestamp("dataDespacho").defaultNow().notNull(),
  dataEntrega: timestamp("dataEntrega"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Despacho = typeof despachos.$inferSelect;
export type InsertDespacho = typeof despachos.$inferInsert;

// Movimentação de Estoque
export const estoqueMovimentacao = mysqlTable("estoqueMovimentacao", {
  id: int("id").autoincrement().primaryKey(),
  mercadoriaId: int("mercadoriaId").notNull(),
  tipo: mysqlEnum("tipo", ["entrada", "saida"]).notNull(),
  quantidade: int("quantidade").notNull(),
  motivo: varchar("motivo", { length: 255 }),
  observacao: text("observacao"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EstoqueMovimentacao = typeof estoqueMovimentacao.$inferSelect;
export type InsertEstoqueMovimentacao = typeof estoqueMovimentacao.$inferInsert;

// ============================================
// MÓDULO CRM & VENDAS
// ============================================

// Clientes
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["PF", "PJ"]).default("PF").notNull(),
  nome: varchar("nome", { length: 255 }),
  razaoSocial: varchar("razaoSocial", { length: 255 }),
  nomeFantasia: varchar("nomeFantasia", { length: 255 }),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  potencial: mysqlEnum("potencial", ["Baixo", "Medio", "Alto"]).default("Medio").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  observacao: text("observacao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

// Oportunidades de Venda
export const oportunidades = mysqlTable("oportunidades", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  valorEstimado: int("valorEstimado").default(0).notNull(), // em centavos
  status: mysqlEnum("status", ["prospeccao", "qualificacao", "proposta", "negociacao", "ganho", "perdido"]).default("prospeccao").notNull(),
  probabilidade: int("probabilidade").default(0).notNull(), // 0-100
  dataFechamentoEstimada: timestamp("dataFechamentoEstimada"),
  dataFechamento: timestamp("dataFechamento"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Oportunidade = typeof oportunidades.$inferSelect;
export type InsertOportunidade = typeof oportunidades.$inferInsert;

// Pedidos de Venda
export const pedidosVenda = mysqlTable("pedidosVenda", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").notNull(),
  numero: varchar("numero", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["rascunho", "aprovado", "faturado", "cancelado"]).default("rascunho").notNull(),
  valorTotal: int("valorTotal").default(0).notNull(), // em centavos
  desconto: int("desconto").default(0).notNull(), // em centavos
  observacao: text("observacao"),
  userId: int("userId").notNull(),
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  dataAprovacao: timestamp("dataAprovacao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PedidoVenda = typeof pedidosVenda.$inferSelect;
export type InsertPedidoVenda = typeof pedidosVenda.$inferInsert;

// Itens do Pedido de Venda
export const pedidosVendaItens = mysqlTable("pedidosVendaItens", {
  id: int("id").autoincrement().primaryKey(),
  pedidoVendaId: int("pedidoVendaId").notNull(),
  mercadoriaId: int("mercadoriaId").notNull(),
  quantidade: int("quantidade").notNull(),
  precoUnitario: int("precoUnitario").notNull(), // em centavos
  desconto: int("desconto").default(0).notNull(), // em centavos
  total: int("total").notNull(), // em centavos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PedidoVendaItem = typeof pedidosVendaItens.$inferSelect;
export type InsertPedidoVendaItem = typeof pedidosVendaItens.$inferInsert;

// ============================================
// MÓDULO FINANCEIRO
// ============================================

// Plano de Contas
export const planoContas = mysqlTable("planoContas", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  tipo: mysqlEnum("tipo", ["receita", "despesa"]).notNull(),
  parentId: int("parentId"), // para hierarquia
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlanoConta = typeof planoContas.$inferSelect;
export type InsertPlanoConta = typeof planoContas.$inferInsert;

// Contas a Pagar
export const contasAPagar = mysqlTable("contasAPagar", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  status: mysqlEnum("status", ["aberto", "pago", "vencido", "cancelado"]).default("aberto").notNull(),
  fornecedorNome: varchar("fornecedorNome", { length: 255 }),
  planoContaId: int("planoContaId"),
  observacao: text("observacao"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContaAPagar = typeof contasAPagar.$inferSelect;
export type InsertContaAPagar = typeof contasAPagar.$inferInsert;

// Contas a Receber
export const contasAReceber = mysqlTable("contasAReceber", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataRecebimento: timestamp("dataRecebimento"),
  status: mysqlEnum("status", ["aberto", "recebido", "vencido", "cancelado"]).default("aberto").notNull(),
  clienteId: int("clienteId"),
  planoContaId: int("planoContaId"),
  observacao: text("observacao"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContaAReceber = typeof contasAReceber.$inferSelect;
export type InsertContaAReceber = typeof contasAReceber.$inferInsert;

// ============================================
// CONFIGURAÇÕES
// ============================================

export const configuracoes = mysqlTable("configuracoes", {
  chave: varchar("chave", { length: 100 }).primaryKey(),
  valor: text("valor"),
  descricao: text("descricao"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Configuracao = typeof configuracoes.$inferSelect;
export type InsertConfiguracao = typeof configuracoes.$inferInsert;
