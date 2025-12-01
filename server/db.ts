import { eq, desc, and, or, like, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  categorias, InsertCategoria,
  mercadorias, InsertMercadoria,
  transportadoras, InsertTransportadora,
  despachos, InsertDespacho,
  estoqueMovimentacao, InsertEstoqueMovimentacao,
  clientes, InsertCliente,
  oportunidades, InsertOportunidade,
  pedidosVenda, InsertPedidoVenda,
  pedidosVendaItens, InsertPedidoVendaItem,
  planoContas, InsertPlanoConta,
  contasAPagar, InsertContaAPagar,
  contasAReceber, InsertContaAReceber,
  configuracoes, InsertConfiguracao
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USUÁRIOS
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(id: number, role: "user" | "admin" | "despachante" | "visualizador") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
}

// ============================================
// CATEGORIAS
// ============================================

export async function getAllCategorias() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categorias).orderBy(categorias.nome);
}

export async function getCategoriaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categorias).where(eq(categorias.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategoria(data: InsertCategoria) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categorias).values(data);
  return result;
}

export async function updateCategoria(id: number, data: Partial<InsertCategoria>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categorias).set(data).where(eq(categorias.id, id));
}

export async function deleteCategoria(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categorias).where(eq(categorias.id, id));
}

// ============================================
// MERCADORIAS
// ============================================

export async function getAllMercadorias() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: mercadorias.id,
      nome: mercadorias.nome,
      sku: mercadorias.sku,
      categoriaId: mercadorias.categoriaId,
      categoriaNome: categorias.nome,
      descricao: mercadorias.descricao,
      precoCusto: mercadorias.precoCusto,
      precoVenda: mercadorias.precoVenda,
      quantidadeEstoque: mercadorias.quantidadeEstoque,
      unidade: mercadorias.unidade,
      ativo: mercadorias.ativo,
      createdAt: mercadorias.createdAt,
      updatedAt: mercadorias.updatedAt,
    })
    .from(mercadorias)
    .leftJoin(categorias, eq(mercadorias.categoriaId, categorias.id))
    .orderBy(mercadorias.nome);
}

export async function getMercadoriaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(mercadorias).where(eq(mercadorias.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMercadoria(data: InsertMercadoria) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mercadorias).values(data);
  return result;
}

export async function updateMercadoria(id: number, data: Partial<InsertMercadoria>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mercadorias).set(data).where(eq(mercadorias.id, id));
}

export async function deleteMercadoria(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mercadorias).where(eq(mercadorias.id, id));
}

export async function updateEstoqueMercadoria(id: number, quantidade: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mercadorias).set({ quantidadeEstoque: quantidade }).where(eq(mercadorias.id, id));
}

// ============================================
// TRANSPORTADORAS
// ============================================

export async function getAllTransportadoras() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(transportadoras).orderBy(transportadoras.nome);
}

export async function getTransportadoraById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transportadoras).where(eq(transportadoras.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTransportadora(data: InsertTransportadora) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transportadoras).values(data);
  return result;
}

export async function updateTransportadora(id: number, data: Partial<InsertTransportadora>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(transportadoras).set(data).where(eq(transportadoras.id, id));
}

export async function deleteTransportadora(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(transportadoras).where(eq(transportadoras.id, id));
}

// ============================================
// DESPACHOS
// ============================================

export async function getAllDespachos() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: despachos.id,
      clienteId: despachos.clienteId,
      clienteNome: sql<string>`COALESCE(${clientes.nome}, ${clientes.razaoSocial}, ${clientes.nomeFantasia}, 'Cliente Desconhecido')`,
      mercadoriaId: despachos.mercadoriaId,
      mercadoriaNome: mercadorias.nome,
      mercadoriaSku: mercadorias.sku,
      quantidade: despachos.quantidade,
      codigoRastreio: despachos.codigoRastreio,
      transportadoraId: despachos.transportadoraId,
      transportadoraNome: transportadoras.nome,
      status: despachos.status,
      observacao: despachos.observacao,
      userId: despachos.userId,
      usuarioNome: users.name,
      dataDespacho: despachos.dataDespacho,
      dataEntrega: despachos.dataEntrega,
      createdAt: despachos.createdAt,
      updatedAt: despachos.updatedAt,
    })
    .from(despachos)
    .leftJoin(clientes, eq(despachos.clienteId, clientes.id))
    .leftJoin(mercadorias, eq(despachos.mercadoriaId, mercadorias.id))
    .leftJoin(transportadoras, eq(despachos.transportadoraId, transportadoras.id))
    .leftJoin(users, eq(despachos.userId, users.id))
    .orderBy(desc(despachos.createdAt));
}

export async function getDespachoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(despachos).where(eq(despachos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDespachoByRastreio(codigo: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      id: despachos.id,
      clienteNome: sql<string>`COALESCE(${clientes.nome}, ${clientes.razaoSocial}, ${clientes.nomeFantasia}, 'Cliente Desconhecido')`,
      mercadoriaNome: mercadorias.nome,
      quantidade: despachos.quantidade,
      codigoRastreio: despachos.codigoRastreio,
      transportadoraNome: transportadoras.nome,
      status: despachos.status,
      dataDespacho: despachos.dataDespacho,
      dataEntrega: despachos.dataEntrega,
    })
    .from(despachos)
    .leftJoin(clientes, eq(despachos.clienteId, clientes.id))
    .leftJoin(mercadorias, eq(despachos.mercadoriaId, mercadorias.id))
    .leftJoin(transportadoras, eq(despachos.transportadoraId, transportadoras.id))
    .where(eq(despachos.codigoRastreio, codigo))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDespacho(data: InsertDespacho) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(despachos).values(data);
  return result;
}

export async function updateDespacho(id: number, data: Partial<InsertDespacho>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(despachos).set(data).where(eq(despachos.id, id));
}

export async function deleteDespacho(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(despachos).where(eq(despachos.id, id));
}

// ============================================
// MOVIMENTAÇÃO DE ESTOQUE
// ============================================

export async function getAllEstoqueMovimentacao() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: estoqueMovimentacao.id,
      mercadoriaId: estoqueMovimentacao.mercadoriaId,
      mercadoriaNome: mercadorias.nome,
      mercadoriaSku: mercadorias.sku,
      tipo: estoqueMovimentacao.tipo,
      quantidade: estoqueMovimentacao.quantidade,
      motivo: estoqueMovimentacao.motivo,
      observacao: estoqueMovimentacao.observacao,
      userId: estoqueMovimentacao.userId,
      usuarioNome: users.name,
      createdAt: estoqueMovimentacao.createdAt,
    })
    .from(estoqueMovimentacao)
    .leftJoin(mercadorias, eq(estoqueMovimentacao.mercadoriaId, mercadorias.id))
    .leftJoin(users, eq(estoqueMovimentacao.userId, users.id))
    .orderBy(desc(estoqueMovimentacao.createdAt));
}

export async function createEstoqueMovimentacao(data: InsertEstoqueMovimentacao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(estoqueMovimentacao).values(data);
  return result;
}

// ============================================
// CLIENTES
// ============================================

export async function getAllClientes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clientes).orderBy(clientes.nome);
}

export async function getClienteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCliente(data: InsertCliente) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clientes).values(data);
  return result;
}

export async function updateCliente(id: number, data: Partial<InsertCliente>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clientes).set(data).where(eq(clientes.id, id));
}

export async function deleteCliente(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(clientes).where(eq(clientes.id, id));
}

// ============================================
// OPORTUNIDADES
// ============================================

export async function getAllOportunidades() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: oportunidades.id,
      clienteId: oportunidades.clienteId,
      clienteNome: sql<string>`COALESCE(${clientes.nome}, ${clientes.razaoSocial}, ${clientes.nomeFantasia}, 'Cliente Desconhecido')`,
      titulo: oportunidades.titulo,
      descricao: oportunidades.descricao,
      valorEstimado: oportunidades.valorEstimado,
      status: oportunidades.status,
      probabilidade: oportunidades.probabilidade,
      dataFechamentoEstimada: oportunidades.dataFechamentoEstimada,
      dataFechamento: oportunidades.dataFechamento,
      userId: oportunidades.userId,
      usuarioNome: users.name,
      createdAt: oportunidades.createdAt,
      updatedAt: oportunidades.updatedAt,
    })
    .from(oportunidades)
    .leftJoin(clientes, eq(oportunidades.clienteId, clientes.id))
    .leftJoin(users, eq(oportunidades.userId, users.id))
    .orderBy(desc(oportunidades.createdAt));
}

export async function getOportunidadeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(oportunidades).where(eq(oportunidades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOportunidade(data: InsertOportunidade) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(oportunidades).values(data);
  return result;
}

export async function updateOportunidade(id: number, data: Partial<InsertOportunidade>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(oportunidades).set(data).where(eq(oportunidades.id, id));
}

export async function deleteOportunidade(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(oportunidades).where(eq(oportunidades.id, id));
}

// ============================================
// PEDIDOS DE VENDA
// ============================================

export async function getAllPedidosVenda() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: pedidosVenda.id,
      clienteId: pedidosVenda.clienteId,
      clienteNome: sql<string>`COALESCE(${clientes.nome}, ${clientes.razaoSocial}, ${clientes.nomeFantasia}, 'Cliente Desconhecido')`,
      numero: pedidosVenda.numero,
      status: pedidosVenda.status,
      valorTotal: pedidosVenda.valorTotal,
      desconto: pedidosVenda.desconto,
      observacao: pedidosVenda.observacao,
      userId: pedidosVenda.userId,
      usuarioNome: users.name,
      dataEmissao: pedidosVenda.dataEmissao,
      dataAprovacao: pedidosVenda.dataAprovacao,
      createdAt: pedidosVenda.createdAt,
      updatedAt: pedidosVenda.updatedAt,
    })
    .from(pedidosVenda)
    .leftJoin(clientes, eq(pedidosVenda.clienteId, clientes.id))
    .leftJoin(users, eq(pedidosVenda.userId, users.id))
    .orderBy(desc(pedidosVenda.createdAt));
}

export async function getPedidoVendaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pedidosVenda).where(eq(pedidosVenda.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPedidoVendaItens(pedidoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: pedidosVendaItens.id,
      pedidoVendaId: pedidosVendaItens.pedidoVendaId,
      mercadoriaId: pedidosVendaItens.mercadoriaId,
      mercadoriaNome: mercadorias.nome,
      quantidade: pedidosVendaItens.quantidade,
      precoUnitario: pedidosVendaItens.precoUnitario,
      desconto: pedidosVendaItens.desconto,
      total: pedidosVendaItens.total,
      createdAt: pedidosVendaItens.createdAt,
    })
    .from(pedidosVendaItens)
    .leftJoin(mercadorias, eq(pedidosVendaItens.mercadoriaId, mercadorias.id))
    .where(eq(pedidosVendaItens.pedidoVendaId, pedidoId));
}

export async function createPedidoVenda(data: InsertPedidoVenda) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pedidosVenda).values(data);
  return result;
}

export async function createPedidoVendaItem(data: InsertPedidoVendaItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pedidosVendaItens).values(data);
  return result;
}

export async function updatePedidoVenda(id: number, data: Partial<InsertPedidoVenda>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pedidosVenda).set(data).where(eq(pedidosVenda.id, id));
}

export async function deletePedidoVenda(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pedidosVenda).where(eq(pedidosVenda.id, id));
}

export async function deletePedidoVendaItens(pedidoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pedidosVendaItens).where(eq(pedidosVendaItens.pedidoVendaId, pedidoId));
}

// ============================================
// PLANO DE CONTAS
// ============================================

export async function getAllPlanoContas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(planoContas).orderBy(planoContas.codigo);
}

export async function getPlanoContaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(planoContas).where(eq(planoContas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPlanoConta(data: InsertPlanoConta) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(planoContas).values(data);
  return result;
}

export async function updatePlanoConta(id: number, data: Partial<InsertPlanoConta>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(planoContas).set(data).where(eq(planoContas.id, id));
}

export async function deletePlanoConta(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(planoContas).where(eq(planoContas.id, id));
}

// ============================================
// CONTAS A PAGAR
// ============================================

export async function getAllContasAPagar() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: contasAPagar.id,
      descricao: contasAPagar.descricao,
      valor: contasAPagar.valor,
      dataVencimento: contasAPagar.dataVencimento,
      dataPagamento: contasAPagar.dataPagamento,
      status: contasAPagar.status,
      fornecedorNome: contasAPagar.fornecedorNome,
      planoContaId: contasAPagar.planoContaId,
      planoContaNome: planoContas.nome,
      observacao: contasAPagar.observacao,
      userId: contasAPagar.userId,
      usuarioNome: users.name,
      createdAt: contasAPagar.createdAt,
      updatedAt: contasAPagar.updatedAt,
    })
    .from(contasAPagar)
    .leftJoin(planoContas, eq(contasAPagar.planoContaId, planoContas.id))
    .leftJoin(users, eq(contasAPagar.userId, users.id))
    .orderBy(desc(contasAPagar.dataVencimento));
}

export async function getContaAPagarById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contasAPagar).where(eq(contasAPagar.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createContaAPagar(data: InsertContaAPagar) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contasAPagar).values(data);
  return result;
}

export async function updateContaAPagar(id: number, data: Partial<InsertContaAPagar>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contasAPagar).set(data).where(eq(contasAPagar.id, id));
}

export async function deleteContaAPagar(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contasAPagar).where(eq(contasAPagar.id, id));
}

// ============================================
// CONTAS A RECEBER
// ============================================

export async function getAllContasAReceber() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: contasAReceber.id,
      descricao: contasAReceber.descricao,
      valor: contasAReceber.valor,
      dataVencimento: contasAReceber.dataVencimento,
      dataRecebimento: contasAReceber.dataRecebimento,
      status: contasAReceber.status,
      clienteId: contasAReceber.clienteId,
      clienteNome: sql<string>`COALESCE(${clientes.nome}, ${clientes.razaoSocial}, ${clientes.nomeFantasia}, 'Cliente Desconhecido')`,
      planoContaId: contasAReceber.planoContaId,
      planoContaNome: planoContas.nome,
      observacao: contasAReceber.observacao,
      userId: contasAReceber.userId,
      usuarioNome: users.name,
      createdAt: contasAReceber.createdAt,
      updatedAt: contasAReceber.updatedAt,
    })
    .from(contasAReceber)
    .leftJoin(clientes, eq(contasAReceber.clienteId, clientes.id))
    .leftJoin(planoContas, eq(contasAReceber.planoContaId, planoContas.id))
    .leftJoin(users, eq(contasAReceber.userId, users.id))
    .orderBy(desc(contasAReceber.dataVencimento));
}

export async function getContaAReceberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contasAReceber).where(eq(contasAReceber.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createContaAReceber(data: InsertContaAReceber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contasAReceber).values(data);
  return result;
}

export async function updateContaAReceber(id: number, data: Partial<InsertContaAReceber>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contasAReceber).set(data).where(eq(contasAReceber.id, id));
}

export async function deleteContaAReceber(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contasAReceber).where(eq(contasAReceber.id, id));
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return {
    totalMercadorias: 0,
    totalEstoque: 0,
    totalClientes: 0,
    totalDespachos: 0,
    totalPedidosVenda: 0,
    totalOportunidades: 0,
    contasAPagarVencidas: 0,
    contasAReceberVencidas: 0,
  };

  const [
    totalMercadorias,
    totalEstoque,
    totalClientes,
    totalDespachos,
    totalPedidosVenda,
    totalOportunidades,
    contasAPagarVencidas,
    contasAReceberVencidas,
  ] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(mercadorias).then(r => Number(r[0]?.count) || 0),
    db.select({ sum: sql<number>`COALESCE(SUM(${mercadorias.quantidadeEstoque}), 0)` }).from(mercadorias).then(r => Number(r[0]?.sum) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(clientes).then(r => Number(r[0]?.count) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(despachos).then(r => Number(r[0]?.count) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(pedidosVenda).then(r => Number(r[0]?.count) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(oportunidades).then(r => Number(r[0]?.count) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(contasAPagar).where(and(eq(contasAPagar.status, "aberto"), lte(contasAPagar.dataVencimento, new Date()))).then(r => Number(r[0]?.count) || 0),
    db.select({ count: sql<number>`COUNT(*)` }).from(contasAReceber).where(and(eq(contasAReceber.status, "aberto"), lte(contasAReceber.dataVencimento, new Date()))).then(r => Number(r[0]?.count) || 0),
  ]);

  return {
    totalMercadorias,
    totalEstoque,
    totalClientes,
    totalDespachos,
    totalPedidosVenda,
    totalOportunidades,
    contasAPagarVencidas,
    contasAReceberVencidas,
  };
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export async function getConfiguracao(chave: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(configuracoes).where(eq(configuracoes.chave, chave)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setConfiguracao(chave: string, valor: string, descricao?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(configuracoes).values({ chave, valor, descricao }).onDuplicateKeyUpdate({ set: { valor, descricao } });
}
