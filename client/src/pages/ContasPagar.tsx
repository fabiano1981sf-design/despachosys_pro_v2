import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function ContasPagar() {
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    dataVencimento: "",
    dataPagamento: "",
    fornecedor: "",
    planoContasId: "",
    status: "aberto" as "aberto" | "pago" | "vencido" | "cancelado",
    observacao: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.contasAPagar.list.useQuery();
  const { data: planoContas } = trpc.planoContas.list.useQuery();

  const createMutation = trpc.contasAPagar.create.useMutation({
    onSuccess: () => {
      toast.success("Conta criada!");
      utils.contasAPagar.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.contasAPagar.update.useMutation({
    onSuccess: () => {
      toast.success("Conta atualizada!");
      utils.contasAPagar.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.contasAPagar.delete.useMutation({
    onSuccess: () => {
      toast.success("Conta excluída!");
      utils.contasAPagar.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      descricao: "",
      valor: "",
      dataVencimento: "",
      dataPagamento: "",
      fornecedor: "",
      planoContasId: "",
      status: "aberto",
      observacao: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      descricao: item.descricao || "",
      valor: (item.valor / 100).toFixed(2),
      dataVencimento: item.dataVencimento ? new Date(item.dataVencimento).toISOString().split('T')[0] : "",
      dataPagamento: item.dataPagamento ? new Date(item.dataPagamento).toISOString().split('T')[0] : "",
      fornecedor: item.fornecedor || "",
      planoContasId: item.planoContasId?.toString() || "",
      status: item.status || "aberto",
      observacao: item.observacao || "",
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    const data = {
      descricao: formData.descricao,
      valor: Math.round(parseFloat(formData.valor) * 100),
      dataVencimento: new Date(formData.dataVencimento),
      dataPagamento: formData.dataPagamento ? new Date(formData.dataPagamento) : undefined,
      fornecedor: formData.fornecedor || undefined,
      planoContasId: formData.planoContasId ? parseInt(formData.planoContasId) : undefined,
      status: formData.status,
      observacao: formData.observacao || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
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

  const getStatusBadge = (status: string, dataVencimento: Date | null) => {
    let statusFinal = status;
    if (status === "aberto" && dataVencimento && new Date(dataVencimento) < new Date()) {
      statusFinal = "vencido";
    }

    const colors: Record<string, string> = {
      aberto: "bg-yellow-100 text-yellow-800",
      pago: "bg-green-100 text-green-800",
      vencido: "bg-red-100 text-red-800",
      cancelado: "bg-gray-100 text-gray-800",
    };
    const labels: Record<string, string> = {
      aberto: "Aberto",
      pago: "Pago",
      vencido: "Vencido",
      cancelado: "Cancelado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[statusFinal] || ""}`}>
        {labels[statusFinal] || statusFinal}
      </span>
    );
  };

  return (
    <CrudTable
      title="Contas a Pagar"
      description="Gerencie as contas a pagar"
      data={data}
      columns={[
        { header: "Descrição", accessor: "descricao", className: "font-medium" },
        { header: "Fornecedor", accessor: "fornecedorNome" },
        { header: "Valor", accessor: (row) => formatCurrency(row.valor), className: "text-right" },
        { header: "Vencimento", accessor: (row) => formatDate(row.dataVencimento) },
        { header: "Pagamento", accessor: (row) => formatDate(row.dataPagamento) },
        { header: "Status", accessor: (row) => getStatusBadge(row.status, row.dataVencimento) },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Nova Conta"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Descrição *</Label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Fornecedor</Label>
              <Input
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              />
            </div>
            <div>
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Data de Vencimento *</Label>
              <Input
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Data de Pagamento</Label>
              <Input
                type="date"
                value={formData.dataPagamento}
                onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
              />
            </div>
            <div>
              <Label>Plano de Contas</Label>
              <Select value={formData.planoContasId} onValueChange={(v) => setFormData({ ...formData, planoContasId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {planoContas?.filter(c => c.tipo === "despesa").map((conta) => (
                    <SelectItem key={conta.id} value={conta.id.toString()}>
                      {conta.codigo} - {conta.nome}
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
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Observação</Label>
              <Textarea
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      )}
    />
  );
}
