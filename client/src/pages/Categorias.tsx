import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Categorias() {
  const [formData, setFormData] = useState({ nome: "", descricao: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.categorias.list.useQuery();

  const createMutation = trpc.categorias.create.useMutation({
    onSuccess: () => {
      toast.success("Categoria criada!");
      utils.categorias.list.invalidate();
      setFormData({ nome: "", descricao: "" });
      setEditingId(null);
    },
  });

  const updateMutation = trpc.categorias.update.useMutation({
    onSuccess: () => {
      toast.success("Categoria atualizada!");
      utils.categorias.list.invalidate();
      setFormData({ nome: "", descricao: "" });
      setEditingId(null);
    },
  });

  const deleteMutation = trpc.categorias.delete.useMutation({
    onSuccess: () => {
      toast.success("Categoria excluída!");
      utils.categorias.list.invalidate();
    },
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ nome: item.nome, descricao: item.descricao || "" });
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
      title="Categorias"
      description="Gerencie as categorias de mercadorias"
      data={data}
      columns={[
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Descrição", accessor: "descricao" },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Nova Categoria"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      )}
    />
  );
}
