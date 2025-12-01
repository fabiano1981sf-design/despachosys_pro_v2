import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MovimentacaoEstoque() {
  const [formData, setFormData] = useState({
    mercadoriaId: "",
    tipo: "entrada" as "entrada" | "saida",
    quantidade: "",
    motivo: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.estoque.movimentacoes.useQuery();
  const { data: mercadorias } = trpc.mercadorias.list.useQuery();

  const createMutation = trpc.estoque.registrar.useMutation({
    onSuccess: () => {
      toast.success("Movimentação registrada!");
      utils.estoque.movimentacoes.invalidate();
      utils.mercadorias.list.invalidate();
      utils.dashboard.stats.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Movimentações não podem ser excluídas por questões de auditoria

  const resetForm = () => {
    setFormData({
      mercadoriaId: "",
      tipo: "entrada",
      quantidade: "",
      motivo: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      mercadoriaId: item.mercadoriaId?.toString() || "",
      tipo: item.tipo || "entrada",
      quantidade: item.quantidade?.toString() || "",
      motivo: item.motivo || "",
    });
  };

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    const data = {
      mercadoriaId: parseInt(formData.mercadoriaId),
      tipo: formData.tipo,
      quantidade: parseInt(formData.quantidade),
      motivo: formData.motivo || undefined,
    };

    createMutation.mutate(data, { onSuccess: onClose });
  };

  const getTipoIcon = (tipo: string) => {
    if (tipo === "entrada") {
      return <ArrowDown className="h-4 w-4 text-green-600" />;
    }
    return <ArrowUp className="h-4 w-4 text-red-600" />;
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CrudTable
      title="Movimentação de Estoque"
      description="Registre entradas e saídas de mercadorias"
      data={data}
      columns={[
        { 
          header: "Tipo", 
          accessor: (row) => (
            <div className="flex items-center gap-2">
              {getTipoIcon(row.tipo)}
              <span className="capitalize">{row.tipo}</span>
            </div>
          )
        },
        { header: "Mercadoria", accessor: "mercadoriaNome", className: "font-medium" },
        { header: "Quantidade", accessor: "quantidade", className: "text-right" },
        { header: "Motivo", accessor: "motivo" },
        { header: "Data", accessor: (row) => formatDate(row.createdAt) },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={() => toast.error("Movimentações não podem ser excluídas")}
      createButtonLabel="Nova Movimentação"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Mercadoria *</Label>
              <Select value={formData.mercadoriaId} onValueChange={(v) => setFormData({ ...formData, mercadoriaId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a mercadoria" />
                </SelectTrigger>
                <SelectContent>
                  {mercadorias?.map((merc) => (
                    <SelectItem key={merc.id} value={merc.id.toString()}>
                      {merc.nome} {merc.sku ? `(${merc.sku})` : ""} - Estoque: {merc.quantidadeEstoque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Movimentação *</Label>
              <Select value={formData.tipo} onValueChange={(v: any) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
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
            <div className="col-span-2">
              <Label>Motivo</Label>
              <Textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Ex: Compra, Venda, Ajuste de inventário, Devolução..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Registrar
            </Button>
          </div>
        </form>
      )}
    />
  );
}
