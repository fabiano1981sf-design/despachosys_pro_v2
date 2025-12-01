import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Oportunidades() {
  const [formData, setFormData] = useState({
    clienteId: "",
    titulo: "",
    descricao: "",
    valorEstimado: "",
    probabilidade: "50" as "0" | "25" | "50" | "75" | "100",
    status: "prospeccao" as "prospeccao" | "qualificacao" | "proposta" | "negociacao" | "ganho" | "perdido",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.oportunidades.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const createMutation = trpc.oportunidades.create.useMutation({
    onSuccess: () => {
      toast.success("Oportunidade criada!");
      utils.oportunidades.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.oportunidades.update.useMutation({
    onSuccess: () => {
      toast.success("Oportunidade atualizada!");
      utils.oportunidades.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.oportunidades.delete.useMutation({
    onSuccess: () => {
      toast.success("Oportunidade excluída!");
      utils.oportunidades.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      clienteId: "",
      titulo: "",
      descricao: "",
      valorEstimado: "",
      probabilidade: "50",
      status: "prospeccao",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      clienteId: item.clienteId?.toString() || "",
      titulo: item.titulo || "",
      descricao: item.descricao || "",
      valorEstimado: (item.valorEstimado / 100).toFixed(2),
      probabilidade: item.probabilidade?.toString() || "50",
      status: item.status || "prospeccao",
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    const data = {
      clienteId: parseInt(formData.clienteId),
      titulo: formData.titulo,
      descricao: formData.descricao || undefined,
      valorEstimado: Math.round(parseFloat(formData.valorEstimado || "0") * 100),
      probabilidade: parseInt(formData.probabilidade),
      status: formData.status,
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

  const getEstagioLabel = (status: string) => {
    const labels: Record<string, string> = {
      prospeccao: "Prospecção",
      qualificacao: "Qualificação",
      proposta: "Proposta",
      negociacao: "Negociação",
      fechamento: "Fechamento",
      ganho: "Ganho",
      perdido: "Perdido",
    };
    return labels[status] || status;
  };

  const getEstagioColor = (status: string) => {
    const colors: Record<string, string> = {
      prospeccao: "bg-gray-100 text-gray-800",
      qualificacao: "bg-blue-100 text-blue-800",
      proposta: "bg-purple-100 text-purple-800",
      negociacao: "bg-yellow-100 text-yellow-800",
      fechamento: "bg-orange-100 text-orange-800",
      ganho: "bg-green-100 text-green-800",
      perdido: "bg-red-100 text-red-800",
    };
    return colors[status] || "";
  };

  return (
    <CrudTable
      title="Oportunidades"
      description="Gerencie o pipeline de vendas"
      data={data}
      columns={[
        { header: "Título", accessor: "titulo", className: "font-medium" },
        { header: "Cliente", accessor: "clienteNome" },
        { 
          header: "Estágio", 
          accessor: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstagioColor(row.status)}`}>
              {getEstagioLabel(row.status)}
            </span>
          )
        },
        { header: "Valor Estimado", accessor: (row) => formatCurrency(row.valorEstimado), className: "text-right" },
        { header: "Probabilidade", accessor: (row) => `${row.probabilidade}%`, className: "text-center" },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Nova Oportunidade"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título *</Label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Venda de 100 unidades"
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Cliente *</Label>
              <Select value={formData.clienteId} onValueChange={(v) => setFormData({ ...formData, clienteId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
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
              <Label>Valor Estimado (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.valorEstimado}
                onChange={(e) => setFormData({ ...formData, valorEstimado: e.target.value })}
              />
            </div>
            <div>
              <Label>Probabilidade</Label>
              <Select value={formData.probabilidade} onValueChange={(v: any) => setFormData({ ...formData, probabilidade: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% - Muito Baixa</SelectItem>
                  <SelectItem value="25">25% - Baixa</SelectItem>
                  <SelectItem value="50">50% - Média</SelectItem>
                  <SelectItem value="75">75% - Alta</SelectItem>
                  <SelectItem value="100">100% - Muito Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Estágio</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospeccao">Prospecção</SelectItem>
                  <SelectItem value="qualificacao">Qualificação</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechamento">Fechamento</SelectItem>
                  <SelectItem value="ganho">Ganho</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
