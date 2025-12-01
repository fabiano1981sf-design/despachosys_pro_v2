import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Transportadoras() {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    ativo: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.transportadoras.list.useQuery();

  const createMutation = trpc.transportadoras.create.useMutation({
    onSuccess: () => {
      toast.success("Transportadora criada!");
      utils.transportadoras.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.transportadoras.update.useMutation({
    onSuccess: () => {
      toast.success("Transportadora atualizada!");
      utils.transportadoras.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.transportadoras.delete.useMutation({
    onSuccess: () => {
      toast.success("Transportadora excluída!");
      utils.transportadoras.list.invalidate();
    },
    onError: () => {
      toast.error("Erro ao excluir transportadora");
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
      ativo: true,
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      nome: item.nome || "",
      cnpj: item.cnpj || "",
      telefone: item.telefone || "",
      email: item.email || "",
      endereco: item.endereco || "",
      ativo: item.ativo ?? true,
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData }, { onSuccess: onClose });
    } else {
      createMutation.mutate(formData, { onSuccess: onClose });
    }
  };

  return (
    <CrudTable
      title="Transportadoras"
      description="Gerencie as transportadoras parceiras"
      data={data}
      columns={[
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "CNPJ", accessor: "cnpj" },
        { header: "Telefone", accessor: "telefone" },
        { header: "Email", accessor: "email" },
        { header: "Status", accessor: (row) => row.ativo ? "Ativo" : "Inativo" },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Nova Transportadora"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      )}
    />
  );
}
