import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { 
  LayoutDashboard, 
  LogOut, 
  PanelLeft, 
  Package, 
  TruckIcon, 
  Tags, 
  Users, 
  Target, 
  ShoppingCart, 
  DollarSign, 
  ClipboardList,
  ArrowUpDown,
  Settings
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { 
    label: "WMS & Logística", 
    items: [
      { icon: Package, label: "Mercadorias", path: "/mercadorias" },
      { icon: ArrowUpDown, label: "Movimentação", path: "/estoque" },
      { icon: TruckIcon, label: "Despachos", path: "/despachos" },
      { icon: TruckIcon, label: "Transportadoras", path: "/transportadoras" },
      { icon: Tags, label: "Categorias", path: "/categorias" },
    ]
  },
  { 
    label: "CRM & Vendas", 
    items: [
      { icon: Users, label: "Clientes", path: "/clientes" },
      { icon: Target, label: "Oportunidades", path: "/oportunidades" },
      { icon: ShoppingCart, label: "Pedidos de Venda", path: "/pedidos-venda" },
    ]
  },
  { 
    label: "Financeiro", 
    items: [
      { icon: ClipboardList, label: "Plano de Contas", path: "/plano-contas" },
      { icon: DollarSign, label: "Contas a Pagar", path: "/contas-pagar" },
      { icon: DollarSign, label: "Contas a Receber", path: "/contas-receber" },
    ]
  },
  { 
    label: "Administração", 
    items: [
      { icon: Users, label: "Usuários", path: "/usuarios" },
      { icon: Settings, label: "Configurações", path: "/configuracoes" },
    ]
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Faça login para continuar
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              O acesso ao DespachoSys Pro requer autenticação. Continue para fazer login.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = getLoginUrl();
    },
  });

  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setSidebarWidth]);

  const handleMouseDown = () => {
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-4 py-3">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">DespachoSys Pro</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((section, idx) => (
              <div key={idx}>
                {section.path ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={location === section.path}
                      onClick={() => {
                        setLocation(section.path!);
                        if (isMobile) setOpen(false);
                      }}
                    >
                      {section.icon && <section.icon className="h-4 w-4" />}
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.label}
                    </p>
                    {section.items?.map((item, itemIdx) => (
                      <SidebarMenuItem key={itemIdx} className="mt-1">
                        <SidebarMenuButton
                          isActive={location === item.path}
                          onClick={() => {
                            setLocation(item.path);
                            if (isMobile) setOpen(false);
                          }}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-sm font-medium truncate w-full">
                        {user?.name || "Usuário"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {user?.email || ""}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        {!isMobile && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger>
            <PanelLeft className="h-5 w-5" />
          </SidebarTrigger>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

import { trpc } from "@/lib/trpc";
