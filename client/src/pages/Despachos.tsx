import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Despachos() {
  const [formData, setFormData] = useState({
    clienteId: "",
    mercadoriaId: "",
    quantidade: "",
    codigoRastreio: "",
    transportadoraId: "",
    status: "pendente" as "pendente" | "em_transito" | "entregue" | "cancelado",
    observacao: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.despachos.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: mercadorias } = trpc.mercadorias.list.useQuery();
  const { data: transportadoras } = trpc.transportadoras.list.useQuery();

  const createMutation = trpc.despachos.create.useMutation({
    onSuccess: () => {
      toast.success("Despacho criado com sucesso!");
      utils.despachos.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.despachos.update.useMutation({
    onSuccess: () => {
      toast.success("Despacho atualizado!");
      utils.despachos.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.despachos.delete.useMutation({
    onSuccess: () => {
      toast.success("Despacho excluído!");
      utils.despachos.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      clienteId: "",
      mercadoriaId: "",
      quantidade: "",
      codigoRastreio: "",
      transportadoraId: "",
      status: "pendente",
      observacao: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      clienteId: item.clienteId?.toString() || "",
      mercadoriaId: item.mercadoriaId?.toString() || "",
      quantidade: item.quantidade?.toString() || "",
      codigoRastreio: item.codigoRastreio || "",
      transportadoraId: item.transportadoraId?.toString() || "",
      status: item.status || "pendente",
      observacao: item.observacao || "",
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    const data = {
      clienteId: parseInt(formData.clienteId),
      mercadoriaId: parseInt(formData.mercadoriaId),
      quantidade: parseInt(formData.quantidade),
      codigoRastreio: formData.codigoRastreio || undefined,
      transportadoraId: formData.transportadoraId ? parseInt(formData.transportadoraId) : undefined,
      status: formData.status,
      observacao: formData.observacao || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pendente: "bg-yellow-100 text-yellow-800",
      em_transito: "bg-blue-100 text-blue-800",
      entregue: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      pendente: "Pendente",
      em_transito: "Em Trânsito",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <CrudTable
      title="Despachos"
      description="Gerencie os despachos de mercadorias"
      data={data}
      columns={[
        { header: "Código", accessor: "codigoRastreio", className: "font-mono text-sm" },
        { header: "Cliente", accessor: "clienteNome" },
        { header: "Mercadoria", accessor: "mercadoriaNome" },
        { header: "Quantidade", accessor: "quantidade", className: "text-right" },
        { header: "Transportadora", accessor: "transportadoraNome" },
        { header: "Status", accessor: (row) => getStatusBadge(row.status) },
        { header: "Data", accessor: (row) => formatDate(row.dataDespacho) },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Novo Despacho"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
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
                      {cliente.nome || cliente.razaoSocial || cliente.nomeFantasia || `Cliente #${cliente.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mercadoria *</Label>
              <Select value={formData.mercadoriaId} onValueChange={(v) => setFormData({ ...formData, mercadoriaId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mercadorias?.map((merc) => (
                    <SelectItem key={merc.id} value={merc.id.toString()}>
                      {merc.nome} {merc.sku ? `(${merc.sku})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantidade *</Label>
              <Input
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Código de Rastreio</Label>
              <Input
                value={formData.codigoRastreio}
                onChange={(e) => setFormData({ ...formData, codigoRastreio: e.target.value })}
                placeholder="Ex: BR123456789"
              />
            </div>
            <div>
              <Label>Transportadora</Label>
              <Select value={formData.transportadoraId} onValueChange={(v) => setFormData({ ...formData, transportadoraId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {transportadoras?.map((transp) => (
                    <SelectItem key={transp.id} value={transp.id.toString()}>
                      {transp.nome}
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
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_transito">Em Trânsito</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
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
