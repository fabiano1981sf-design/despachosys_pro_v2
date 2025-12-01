import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Categorias Router", () => {
  it("deve listar categorias", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categorias.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("deve criar uma categoria", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categorias.create({
      nome: "Categoria Teste",
      descricao: "Descrição de teste",
    });

    expect(result.success).toBe(true);
  });

  it("deve atualizar uma categoria", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar categoria primeiro
    await caller.categorias.create({
      nome: "Categoria Original",
      descricao: "Descrição original",
    });

    const categorias = await caller.categorias.list();
    const categoria = categorias[categorias.length - 1];

    if (categoria) {
      const result = await caller.categorias.update({
        id: categoria.id,
        nome: "Categoria Atualizada",
      });

      expect(result.success).toBe(true);
    }
  });

  it("deve excluir uma categoria", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar categoria primeiro
    await caller.categorias.create({
      nome: "Categoria para Excluir",
    });

    const categorias = await caller.categorias.list();
    const categoria = categorias[categorias.length - 1];

    if (categoria) {
      const result = await caller.categorias.delete({ id: categoria.id });
      expect(result.success).toBe(true);
    }
  });
});
