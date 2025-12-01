import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Mercadorias from "./pages/Mercadorias";
import Clientes from "./pages/Clientes";
import Rastrear from "./pages/Rastrear";
import Transportadoras from "./pages/Transportadoras";
import Despachos from "./pages/Despachos";
import MovimentacaoEstoque from "./pages/MovimentacaoEstoque";
import Oportunidades from "./pages/Oportunidades";
import PedidosVenda from "./pages/PedidosVenda";
import PlanoContas from "./pages/PlanoContas";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";

function Router() {
  return (
    <Switch>
      {/* Rota pública de rastreamento */}
      <Route path="/rastrear" component={Rastrear} />
      
      {/* Rotas protegidas com DashboardLayout */}
      <Route path="/">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      
      {/* WMS & Logística */}
      <Route path="/mercadorias">
        <DashboardLayout>
          <Mercadorias />
        </DashboardLayout>
      </Route>
      
      <Route path="/categorias">
        <DashboardLayout>
          <Categorias />
        </DashboardLayout>
      </Route>
      
      <Route path="/transportadoras">
        <DashboardLayout>
          <Transportadoras />
        </DashboardLayout>
      </Route>
      
      <Route path="/despachos">
        <DashboardLayout>
          <Despachos />
        </DashboardLayout>
      </Route>
      
      <Route path="/estoque">
        <DashboardLayout>
          <MovimentacaoEstoque />
        </DashboardLayout>
      </Route>
      
      {/* CRM & Vendas */}
      <Route path="/clientes">
        <DashboardLayout>
          <Clientes />
        </DashboardLayout>
      </Route>
      
      <Route path="/oportunidades">
        <DashboardLayout>
          <Oportunidades />
        </DashboardLayout>
      </Route>
      
      <Route path="/pedidos-venda">
        <DashboardLayout>
          <PedidosVenda />
        </DashboardLayout>
      </Route>
      
      {/* Financeiro */}
      <Route path="/plano-contas">
        <DashboardLayout>
          <PlanoContas />
        </DashboardLayout>
      </Route>
      
      <Route path="/contas-pagar">
        <DashboardLayout>
          <ContasPagar />
        </DashboardLayout>
      </Route>
      
      <Route path="/contas-receber">
        <DashboardLayout>
          <ContasReceber />
        </DashboardLayout>
      </Route>
      
      {/* Administração */}
      <Route path="/usuarios">
        <DashboardLayout>
          <Usuarios />
        </DashboardLayout>
      </Route>
      
      <Route path="/configuracoes">
        <DashboardLayout>
          <Configuracoes />
        </DashboardLayout>
      </Route>
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
