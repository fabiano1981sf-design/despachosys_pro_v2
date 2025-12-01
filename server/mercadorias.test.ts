import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Mercadorias Router", () => {
  it("deve listar mercadorias", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mercadorias.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("deve criar uma mercadoria", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mercadorias.create({
      nome: "Produto Teste",
      sku: "TEST-001",
      precoCusto: 1000, // R$ 10,00
      precoVenda: 2000, // R$ 20,00
      quantidadeEstoque: 100,
      unidade: "UN",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("deve validar preço de venda obrigatório", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.mercadorias.create({
        nome: "Produto Sem Preço",
        sku: "TEST-002",
        precoCusto: 1000,
        precoVenda: -1, // Preço inválido
        quantidadeEstoque: 100,
        unidade: "UN",
        ativo: true,
      });
      expect.fail("Deveria ter lançado erro de validação");
    } catch (error: any) {
      expect(error.message).toContain("positivo");
    }
  });

  it("deve atualizar estoque de mercadoria", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar mercadoria
    await caller.mercadorias.create({
      nome: "Produto para Atualizar",
      sku: "TEST-003",
      precoCusto: 1000,
      precoVenda: 2000,
      quantidadeEstoque: 50,
      unidade: "UN",
      ativo: true,
    });

    const mercadorias = await caller.mercadorias.list();
    const mercadoria = mercadorias[mercadorias.length - 1];

    if (mercadoria) {
      const result = await caller.mercadorias.update({
        id: mercadoria.id,
        quantidadeEstoque: 100,
      });

      expect(result.success).toBe(true);
    }
  });
});
