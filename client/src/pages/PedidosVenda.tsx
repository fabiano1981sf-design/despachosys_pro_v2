import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ItemPedido {
  mercadoriaId: number;
  quantidade: number;
  precoUnitario: number;
}

export default function PedidosVenda() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    status: "rascunho" as "rascunho" | "aprovado" | "faturado" | "cancelado",
    observacao: "",
  });
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [novoItem, setNovoItem] = useState({
    mercadoriaId: "",
    quantidade: "",
    precoUnitario: "",
  });

  const utils = trpc.useUtils();
  const { data: pedidos, isLoading } = trpc.pedidosVenda.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: mercadorias } = trpc.mercadorias.list.useQuery();

  const createMutation = trpc.pedidosVenda.create.useMutation({
    onSuccess: () => {
      toast.success("Pedido criado com sucesso!");
      utils.pedidosVenda.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.pedidosVenda.update.useMutation({
    onSuccess: () => {
      toast.success("Pedido atualizado!");
      utils.pedidosVenda.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.pedidosVenda.delete.useMutation({
    onSuccess: () => {
      toast.success("Pedido excluído!");
      utils.pedidosVenda.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      clienteId: "",
      status: "rascunho",
      observacao: "",
    });
    setItens([]);
    setNovoItem({ mercadoriaId: "", quantidade: "", precoUnitario: "" });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      clienteId: item.clienteId?.toString() || "",
      status: item.status || "pendente",
      observacao: item.observacao || "",
    });
    setOpen(true);
  };

  const handleAdicionarItem = () => {
    if (!novoItem.mercadoriaId || !novoItem.quantidade || !novoItem.precoUnitario) {
      toast.error("Preencha todos os campos do item");
      return;
    }

    const mercadoria = mercadorias?.find(m => m.id === parseInt(novoItem.mercadoriaId));
    if (!mercadoria) return;

    setItens([...itens, {
      mercadoriaId: parseInt(novoItem.mercadoriaId),
      quantidade: parseInt(novoItem.quantidade),
      precoUnitario: Math.round(parseFloat(novoItem.precoUnitario) * 100),
    }]);

    setNovoItem({ mercadoriaId: "", quantidade: "", precoUnitario: "" });
  };

  const handleRemoverItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    const valorTotal = calcularTotal();
    const numero = `PV${Date.now()}`;

    const data = {
      clienteId: parseInt(formData.clienteId),
      numero,
      valorTotal,
      status: formData.status,
      observacao: formData.observacao || undefined,
      itens,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pendente: "bg-yellow-100 text-yellow-800",
      confirmado: "bg-blue-100 text-blue-800",
      enviado: "bg-purple-100 text-purple-800",
      entregue: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      enviado: "Enviado",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Venda</h1>
          <p className="text-muted-foreground">Gerencie os pedidos de venda</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar" : "Novo"} Pedido de Venda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente *</Label>
                  <Select value={formData.clienteId} onValueChange={(v) => setFormData({ ...formData, clienteId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes?.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome || cliente.razaoSocial || cliente.nomeFantasia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="faturado">Faturado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Observação</Label>
                  <Input
                    value={formData.observacao}
                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Itens do Pedido</h3>
                
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-5">
                    <Label>Mercadoria</Label>
                    <Select value={novoItem.mercadoriaId} onValueChange={(v) => {
                      const merc = mercadorias?.find(m => m.id === parseInt(v));
                      setNovoItem({ 
                        ...novoItem, 
                        mercadoriaId: v,
                        precoUnitario: merc ? (merc.precoVenda / 100).toFixed(2) : ""
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {mercadorias?.map((merc) => (
                          <SelectItem key={merc.id} value={merc.id.toString()}>
                            {merc.nome} - {formatCurrency(merc.precoVenda)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Qtd</Label>
                    <Input
                      type="number"
                      min="1"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label>Preço Unit. (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoItem.precoUnitario}
                      onChange={(e) => setNovoItem({ ...novoItem, precoUnitario: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button type="button" onClick={handleAdicionarItem} className="w-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {itens.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mercadoria</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.map((item, index) => {
                        const merc = mercadorias?.find(m => m.id === item.mercadoriaId);
                        return (
                          <TableRow key={index}>
                            <TableCell>{merc?.nome}</TableCell>
                            <TableCell className="text-right">{item.quantidade}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.precoUnitario)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.quantidade * item.precoUnitario)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoverItem(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(calcularTotal())}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Atualizar" : "Criar"} Pedido
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum pedido cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidos?.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-mono">#{pedido.id}</TableCell>
                      <TableCell className="font-medium">{pedido.clienteNome}</TableCell>
                      <TableCell>{formatDate(pedido.dataEmissao)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(pedido.valorTotal)}</TableCell>
                      <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(pedido)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate({ id: pedido.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
