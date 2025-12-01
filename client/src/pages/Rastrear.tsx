import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Package, Search, TruckIcon } from "lucide-react";
import { useState } from "react";

export default function Rastrear() {
  const [codigo, setCodigo] = useState("");
  const [searchCodigo, setSearchCodigo] = useState("");

  const { data, isLoading, error } = trpc.despachos.rastrear.useQuery(
    { codigo: searchCodigo },
    { enabled: searchCodigo.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCodigo(codigo);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "em_transito":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "entregue":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "em_transito":
        return "Em Trânsito";
      case "entregue":
        return "Entregue";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-full">
              <Package className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">DespachoSys Pro</h1>
          <p className="text-muted-foreground text-lg">
            Rastreamento de Despachos
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Consultar Despacho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="codigo">Código de Rastreamento</Label>
                <div className="flex gap-2">
                  <Input
                    id="codigo"
                    placeholder="Digite o código de rastreamento"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </form>

            {isLoading && (
              <div className="mt-6 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Buscando despacho...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-center">
                  Erro ao buscar despacho. Tente novamente.
                </p>
              </div>
            )}

            {data === null && searchCodigo && !isLoading && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-center text-muted-foreground">
                  Nenhum despacho encontrado com este código.
                </p>
              </div>
            )}

            {data && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center">
                  <span
                    className={`px-4 py-2 rounded-full border font-semibold ${getStatusColor(
                      data.status
                    )}`}
                  >
                    {getStatusLabel(data.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                    <p className="font-semibold">{data.clienteNome}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Mercadoria</p>
                    <p className="font-semibold">{data.mercadoriaNome}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Quantidade</p>
                    <p className="font-semibold">{data.quantidade}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Transportadora</p>
                    <p className="font-semibold">{data.transportadoraNome || "-"}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Data de Despacho</p>
                    <p className="font-semibold">{formatDate(data.dataDespacho)}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Data de Entrega</p>
                    <p className="font-semibold">{formatDate(data.dataEntrega)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground mt-6">
                  <TruckIcon className="h-4 w-4" />
                  <p className="text-sm">
                    Código: <span className="font-mono font-semibold">{data.codigoRastreio}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2024 DespachoSys Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
