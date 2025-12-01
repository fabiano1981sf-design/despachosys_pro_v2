import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function Mercadorias() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    categoriaId: "",
    descricao: "",
    precoCusto: "",
    precoVenda: "",
    quantidadeEstoque: "",
    unidade: "UN",
    ativo: true,
  });

  const utils = trpc.useUtils();
  const { data: mercadorias, isLoading } = trpc.mercadorias.list.useQuery();
  const { data: categorias } = trpc.categorias.list.useQuery();

  const createMutation = trpc.mercadorias.create.useMutation({
    onSuccess: () => {
      toast.success("Mercadoria criada com sucesso!");
      utils.mercadorias.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.mercadorias.update.useMutation({
    onSuccess: () => {
      toast.success("Mercadoria atualizada com sucesso!");
      utils.mercadorias.list.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.mercadorias.delete.useMutation({
    onSuccess: () => {
      toast.success("Mercadoria excluída com sucesso!");
      utils.mercadorias.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao excluir mercadoria");
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      sku: "",
      categoriaId: "",
      descricao: "",
      precoCusto: "",
      precoVenda: "",
      quantidadeEstoque: "",
      unidade: "UN",
      ativo: true,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      nome: item.nome || "",
      sku: item.sku || "",
      categoriaId: item.categoriaId?.toString() || "",
      descricao: item.descricao || "",
      precoCusto: (item.precoCusto / 100).toFixed(2),
      precoVenda: (item.precoVenda / 100).toFixed(2),
      quantidadeEstoque: item.quantidadeEstoque?.toString() || "0",
      unidade: item.unidade || "UN",
      ativo: item.ativo ?? true,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: formData.nome,
      sku: formData.sku || undefined,
      categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : undefined,
      descricao: formData.descricao || undefined,
      precoCusto: Math.round(parseFloat(formData.precoCusto || "0") * 100),
      precoVenda: Math.round(parseFloat(formData.precoVenda || "0") * 100),
      quantidadeEstoque: parseInt(formData.quantidadeEstoque || "0"),
      unidade: formData.unidade,
      ativo: formData.ativo,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta mercadoria?")) {
      deleteMutation.mutate({ id });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mercadorias</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Mercadoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar" : "Nova"} Mercadoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoriaId} onValueChange={(v) => setFormData({ ...formData, categoriaId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {categorias?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="precoCusto">Preço de Custo (R$)</Label>
                  <Input
                    id="precoCusto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precoCusto}
                    onChange={(e) => setFormData({ ...formData, precoCusto: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precoVenda}
                    onChange={(e) => setFormData({ ...formData, precoVenda: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
                  <Input
                    id="quantidadeEstoque"
                    type="number"
                    min="0"
                    value={formData.quantidadeEstoque}
                    onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input
                    id="unidade"
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Mercadorias</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço Custo</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mercadorias?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhuma mercadoria cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  mercadorias?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.sku || "-"}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>{item.categoriaNome || "-"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.precoCusto)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.precoVenda)}</TableCell>
                      <TableCell className="text-right">{item.quantidadeEstoque} {item.unidade}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
