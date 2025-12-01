import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const categoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
});

const mercadoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().optional(),
  categoriaId: z.number().optional(),
  descricao: z.string().optional(),
  precoCusto: z.number().min(0, "Preço de custo deve ser positivo"),
  precoVenda: z.number().min(0, "Preço de venda deve ser positivo"),
  quantidadeEstoque: z.number().min(0, "Quantidade deve ser positiva"),
  unidade: z.string().default("UN"),
  ativo: z.boolean().default(true),
});

const transportadoraSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  ativo: z.boolean().default(true),
});

const despachoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  mercadoriaId: z.number().min(1, "Mercadoria é obrigatória"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  codigoRastreio: z.string().optional(),
  transportadoraId: z.number().optional(),
  status: z.enum(["pendente", "em_transito", "entregue", "cancelado"]).default("pendente"),
  observacao: z.string().optional(),
  dataDespacho: z.date().optional(),
  dataEntrega: z.date().optional(),
});

const estoqueMovimentacaoSchema = z.object({
  mercadoriaId: z.number().min(1, "Mercadoria é obrigatória"),
  tipo: z.enum(["entrada", "saida"]),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  motivo: z.string().optional(),
  observacao: z.string().optional(),
});

const clienteSchema = z.object({
  tipo: z.enum(["PF", "PJ"]).default("PF"),
  nome: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  potencial: z.enum(["Baixo", "Medio", "Alto"]).default("Medio"),
  ativo: z.boolean().default(true),
  observacao: z.string().optional(),
});

const oportunidadeSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  valorEstimado: z.number().min(0, "Valor deve ser positivo"),
  status: z.enum(["prospeccao", "qualificacao", "proposta", "negociacao", "ganho", "perdido"]).default("prospeccao"),
  probabilidade: z.number().min(0).max(100).default(0),
  dataFechamentoEstimada: z.date().optional(),
  dataFechamento: z.date().optional(),
});

const pedidoVendaSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  status: z.enum(["rascunho", "aprovado", "faturado", "cancelado"]).default("rascunho"),
  valorTotal: z.number().min(0, "Valor deve ser positivo"),
  desconto: z.number().min(0, "Desconto deve ser positivo").default(0),
  observacao: z.string().optional(),
  dataEmissao: z.date().optional(),
  dataAprovacao: z.date().optional(),
  itens: z.array(z.object({
    mercadoriaId: z.number().min(1),
    quantidade: z.number().min(1),
    precoUnitario: z.number().min(0),
    desconto: z.number().min(0).default(0),
  })),
});

const planoContaSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["receita", "despesa"]),
  parentId: z.number().optional(),
  ativo: z.boolean().default(true),
});

const contaAPagarSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().min(0, "Valor deve ser positivo"),
  dataVencimento: z.date(),
  dataPagamento: z.date().optional(),
  status: z.enum(["aberto", "pago", "vencido", "cancelado"]).default("aberto"),
  fornecedorNome: z.string().optional(),
  planoContaId: z.number().optional(),
  observacao: z.string().optional(),
});

const contaAReceberSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().min(0, "Valor deve ser positivo"),
  dataVencimento: z.date(),
  dataRecebimento: z.date().optional(),
  status: z.enum(["aberto", "recebido", "vencido", "cancelado"]).default("aberto"),
  clienteId: z.number().optional(),
  planoContaId: z.number().optional(),
  observacao: z.string().optional(),
});

// ============================================
// ROUTERS
// ============================================

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // DASHBOARD
  // ============================================
  
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return await db.getDashboardStats();
    }),
  }),

  // ============================================
  // CATEGORIAS
  // ============================================
  
  categorias: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllCategorias();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoriaById(input.id);
      }),
    
    create: protectedProcedure
      .input(categoriaSchema)
      .mutation(async ({ input }) => {
        await db.createCategoria(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(categoriaSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCategoria(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCategoria(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // MERCADORIAS
  // ============================================
  
  mercadorias: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllMercadorias();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMercadoriaById(input.id);
      }),
    
    create: protectedProcedure
      .input(mercadoriaSchema)
      .mutation(async ({ input }) => {
        await db.createMercadoria(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(mercadoriaSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMercadoria(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMercadoria(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // TRANSPORTADORAS
  // ============================================
  
  transportadoras: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllTransportadoras();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTransportadoraById(input.id);
      }),
    
    create: protectedProcedure
      .input(transportadoraSchema)
      .mutation(async ({ input }) => {
        await db.createTransportadora(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(transportadoraSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTransportadora(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTransportadora(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // DESPACHOS
  // ============================================
  
  despachos: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDespachos();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getDespachoById(input.id);
      }),
    
    rastrear: publicProcedure
      .input(z.object({ codigo: z.string() }))
      .query(async ({ input }) => {
        return await db.getDespachoByRastreio(input.codigo);
      }),
    
    create: protectedProcedure
      .input(despachoSchema)
      .mutation(async ({ input, ctx }) => {
        // Verificar estoque disponível
        const mercadoria = await db.getMercadoriaById(input.mercadoriaId);
        if (!mercadoria) {
          throw new Error("Mercadoria não encontrada");
        }
        if (mercadoria.quantidadeEstoque < input.quantidade) {
          throw new Error("Estoque insuficiente");
        }
        
        // Criar despacho
        await db.createDespacho({
          ...input,
          userId: ctx.user.id,
        });
        
        // Atualizar estoque
        await db.updateEstoqueMercadoria(
          input.mercadoriaId,
          mercadoria.quantidadeEstoque - input.quantidade
        );
        
        // Registrar movimentação
        await db.createEstoqueMovimentacao({
          mercadoriaId: input.mercadoriaId,
          tipo: "saida",
          quantidade: input.quantidade,
          motivo: "Despacho",
          userId: ctx.user.id,
        });
        
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(despachoSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDespacho(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDespacho(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // MOVIMENTAÇÃO DE ESTOQUE
  // ============================================
  
  estoque: router({
    movimentacoes: protectedProcedure.query(async () => {
      return await db.getAllEstoqueMovimentacao();
    }),
    
    registrar: protectedProcedure
      .input(estoqueMovimentacaoSchema)
      .mutation(async ({ input, ctx }) => {
        const mercadoria = await db.getMercadoriaById(input.mercadoriaId);
        if (!mercadoria) {
          throw new Error("Mercadoria não encontrada");
        }
        
        // Calcular novo estoque
        let novoEstoque = mercadoria.quantidadeEstoque;
        if (input.tipo === "entrada") {
          novoEstoque += input.quantidade;
        } else {
          novoEstoque -= input.quantidade;
          if (novoEstoque < 0) {
            throw new Error("Estoque insuficiente");
          }
        }
        
        // Registrar movimentação
        await db.createEstoqueMovimentacao({
          ...input,
          userId: ctx.user.id,
        });
        
        // Atualizar estoque
        await db.updateEstoqueMercadoria(input.mercadoriaId, novoEstoque);
        
        return { success: true };
      }),
  }),

  // ============================================
  // CLIENTES
  // ============================================
  
  clientes: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllClientes();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getClienteById(input.id);
      }),
    
    create: protectedProcedure
      .input(clienteSchema)
      .mutation(async ({ input }) => {
        await db.createCliente(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(clienteSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCliente(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCliente(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // OPORTUNIDADES
  // ============================================
  
  oportunidades: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllOportunidades();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOportunidadeById(input.id);
      }),
    
    create: protectedProcedure
      .input(oportunidadeSchema)
      .mutation(async ({ input, ctx }) => {
        await db.createOportunidade({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(oportunidadeSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateOportunidade(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteOportunidade(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // PEDIDOS DE VENDA
  // ============================================
  
  pedidosVenda: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllPedidosVenda();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const pedido = await db.getPedidoVendaById(input.id);
        if (!pedido) return null;
        const itens = await db.getPedidoVendaItens(input.id);
        return { ...pedido, itens };
      }),
    
    create: protectedProcedure
      .input(pedidoVendaSchema)
      .mutation(async ({ input, ctx }) => {
        const { itens, ...pedidoData } = input;
        
        // Criar pedido
        const result = await db.createPedidoVenda({
          ...pedidoData,
          userId: ctx.user.id,
        });
        
        const pedidoId = Number(result[0].insertId);
        
        // Criar itens
        for (const item of itens) {
          const total = (item.precoUnitario * item.quantidade) - item.desconto;
          await db.createPedidoVendaItem({
            pedidoVendaId: pedidoId,
            ...item,
            total,
          });
        }
        
        return { success: true, id: pedidoId };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(pedidoVendaSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, itens, ...data } = input;
        
        // Atualizar pedido
        await db.updatePedidoVenda(id, data);
        
        // Se houver itens, recriar todos
        if (itens) {
          await db.deletePedidoVendaItens(id);
          for (const item of itens) {
            const total = (item.precoUnitario * item.quantidade) - item.desconto;
            await db.createPedidoVendaItem({
              pedidoVendaId: id,
              ...item,
              total,
            });
          }
        }
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePedidoVendaItens(input.id);
        await db.deletePedidoVenda(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // PLANO DE CONTAS
  // ============================================
  
  planoContas: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllPlanoContas();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPlanoContaById(input.id);
      }),
    
    create: protectedProcedure
      .input(planoContaSchema)
      .mutation(async ({ input }) => {
        await db.createPlanoConta(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(planoContaSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePlanoConta(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePlanoConta(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // CONTAS A PAGAR
  // ============================================
  
  contasAPagar: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllContasAPagar();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContaAPagarById(input.id);
      }),
    
    create: protectedProcedure
      .input(contaAPagarSchema)
      .mutation(async ({ input, ctx }) => {
        await db.createContaAPagar({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(contaAPagarSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateContaAPagar(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContaAPagar(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // CONTAS A RECEBER
  // ============================================
  
  contasAReceber: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllContasAReceber();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContaAReceberById(input.id);
      }),
    
    create: protectedProcedure
      .input(contaAReceberSchema)
      .mutation(async ({ input, ctx }) => {
        await db.createContaAReceber({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number() }).merge(contaAReceberSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateContaAReceber(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContaAReceber(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // USUÁRIOS (ADMIN)
  // ============================================
  
  usuarios: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    updateRole: protectedProcedure
      .input(z.object({ 
        id: z.number(), 
        role: z.enum(["user", "admin", "despachante", "visualizador"]) 
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas admin pode alterar roles
        if (ctx.user.role !== "admin") {
          throw new Error("Sem permissão");
        }
        await db.updateUserRole(input.id, input.role);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
