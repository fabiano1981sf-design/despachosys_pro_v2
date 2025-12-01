import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function PlanoContas() {
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    tipo: "receita" as "receita" | "despesa",
    contaPaiId: "",
    descricao: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.planoContas.list.useQuery();

  const createMutation = trpc.planoContas.create.useMutation({
    onSuccess: () => {
      toast.success("Conta criada!");
      utils.planoContas.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.planoContas.update.useMutation({
    onSuccess: () => {
      toast.success("Conta atualizada!");
      utils.planoContas.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.planoContas.delete.useMutation({
    onSuccess: () => {
      toast.success("Conta excluída!");
      utils.planoContas.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      tipo: "receita",
      contaPaiId: "",
      descricao: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      codigo: item.codigo || "",
      nome: item.nome || "",
      tipo: item.tipo || "receita",
      contaPaiId: item.contaPaiId?.toString() || "",
      descricao: item.descricao || "",
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    const data = {
      codigo: formData.codigo,
      nome: formData.nome,
      tipo: formData.tipo,
      contaPaiId: formData.contaPaiId ? parseInt(formData.contaPaiId) : undefined,
      descricao: formData.descricao || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      receita: "bg-green-100 text-green-800",
      despesa: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      receita: "Receita",
      despesa: "Despesa",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[tipo] || ""}`}>
        {labels[tipo] || tipo}
      </span>
    );
  };

  return (
    <CrudTable
      title="Plano de Contas"
      description="Gerencie a estrutura de contas contábeis"
      data={data}
      columns={[
        { header: "Código", accessor: "codigo", className: "font-mono" },
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Tipo", accessor: (row) => getTipoBadge(row.tipo) },
        { header: "Ativo", accessor: (row) => row.ativo ? "Sim" : "Não" },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Nova Conta"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código *</Label>
              <Input
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ex: 1.1.01"
                required
              />
            </div>
            <div>
              <Label>Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(v: any) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Nome *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Conta Pai (opcional)</Label>
              <Select value={formData.contaPaiId} onValueChange={(v) => setFormData({ ...formData, contaPaiId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma (conta raiz)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {data?.filter(c => c.id !== editingId).map((conta) => (
                    <SelectItem key={conta.id} value={conta.id.toString()}>
                      {conta.codigo} - {conta.nome}
                    </SelectItem>
                  ))}
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
