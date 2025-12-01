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

describe("Dashboard Router", () => {
  it("deve retornar estatísticas do dashboard", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats();

    expect(stats).toHaveProperty("totalMercadorias");
    expect(stats).toHaveProperty("totalEstoque");
    expect(stats).toHaveProperty("totalClientes");
    expect(stats).toHaveProperty("totalDespachos");
    expect(stats).toHaveProperty("totalPedidosVenda");
    expect(stats).toHaveProperty("totalOportunidades");
    expect(stats).toHaveProperty("contasAPagarVencidas");
    expect(stats).toHaveProperty("contasAReceberVencidas");

    expect(typeof stats.totalMercadorias).toBe("number");
    expect(typeof stats.totalEstoque).toBe("number");
    expect(typeof stats.totalClientes).toBe("number");
  });

  it("deve retornar valores numéricos válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats();

    expect(stats.totalMercadorias).toBeGreaterThanOrEqual(0);
    expect(stats.totalEstoque).toBeGreaterThanOrEqual(0);
    expect(stats.totalClientes).toBeGreaterThanOrEqual(0);
    expect(stats.totalDespachos).toBeGreaterThanOrEqual(0);
    expect(stats.contasAPagarVencidas).toBeGreaterThanOrEqual(0);
    expect(stats.contasAReceberVencidas).toBeGreaterThanOrEqual(0);
  });
});
