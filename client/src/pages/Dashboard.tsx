import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Package, 
  Users, 
  TruckIcon, 
  ShoppingCart, 
  Target, 
  DollarSign,
  AlertTriangle 
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Mercadorias",
      value: stats?.totalMercadorias || 0,
      icon: Package,
      description: "Produtos cadastrados",
    },
    {
      title: "Estoque Total",
      value: stats?.totalEstoque || 0,
      icon: Package,
      description: "Unidades em estoque",
    },
    {
      title: "Clientes",
      value: stats?.totalClientes || 0,
      icon: Users,
      description: "Clientes cadastrados",
    },
    {
      title: "Despachos",
      value: stats?.totalDespachos || 0,
      icon: TruckIcon,
      description: "Total de despachos",
    },
    {
      title: "Pedidos de Venda",
      value: stats?.totalPedidosVenda || 0,
      icon: ShoppingCart,
      description: "Pedidos registrados",
    },
    {
      title: "Oportunidades",
      value: stats?.totalOportunidades || 0,
      icon: Target,
      description: "Oportunidades ativas",
    },
    {
      title: "Contas a Pagar Vencidas",
      value: stats?.contasAPagarVencidas || 0,
      icon: AlertTriangle,
      description: "Contas em atraso",
      alert: (stats?.contasAPagarVencidas || 0) > 0,
    },
    {
      title: "Contas a Receber Vencidas",
      value: stats?.contasAReceberVencidas || 0,
      icon: DollarSign,
      description: "Recebimentos em atraso",
      alert: (stats?.contasAReceberVencidas || 0) > 0,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema DespachoSys Pro</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className={card.alert ? "border-destructive" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.alert ? "text-destructive" : "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.alert ? "text-destructive" : ""}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
