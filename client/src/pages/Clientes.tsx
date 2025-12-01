import { CrudTable } from "@/components/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Clientes() {
  const [formData, setFormData] = useState({
    tipo: "PF" as "PF" | "PJ",
    nome: "",
    razaoSocial: "",
    nomeFantasia: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    celular: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    potencial: "Medio" as "Baixo" | "Medio" | "Alto",
    ativo: true,
    observacao: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.clientes.list.useQuery();

  const createMutation = trpc.clientes.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente criado!");
      utils.clientes.list.invalidate();
      resetForm();
    },
  });

  const updateMutation = trpc.clientes.update.useMutation({
    onSuccess: () => {
      toast.success("Cliente atualizado!");
      utils.clientes.list.invalidate();
      resetForm();
    },
  });

  const deleteMutation = trpc.clientes.delete.useMutation({
    onSuccess: () => {
      toast.success("Cliente excluído!");
      utils.clientes.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      tipo: "PF",
      nome: "",
      razaoSocial: "",
      nomeFantasia: "",
      cpfCnpj: "",
      email: "",
      telefone: "",
      celular: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      potencial: "Medio",
      ativo: true,
      observacao: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      tipo: item.tipo || "PF",
      nome: item.nome || "",
      razaoSocial: item.razaoSocial || "",
      nomeFantasia: item.nomeFantasia || "",
      cpfCnpj: item.cpfCnpj || "",
      email: item.email || "",
      telefone: item.telefone || "",
      celular: item.celular || "",
      endereco: item.endereco || "",
      cidade: item.cidade || "",
      estado: item.estado || "",
      cep: item.cep || "",
      potencial: item.potencial || "Medio",
      ativo: item.ativo ?? true,
      observacao: item.observacao || "",
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

  const getNomeCliente = (item: any) => {
    return item.nome || item.razaoSocial || item.nomeFantasia || "Sem nome";
  };

  return (
    <CrudTable
      title="Clientes"
      description="Gerencie seus clientes"
      data={data}
      columns={[
        { header: "Tipo", accessor: "tipo" },
        { header: "Nome/Razão Social", accessor: (row) => getNomeCliente(row), className: "font-medium" },
        { header: "CPF/CNPJ", accessor: "cpfCnpj" },
        { header: "Email", accessor: "email" },
        { header: "Telefone", accessor: (row) => row.telefone || row.celular || "-" },
        { header: "Cidade", accessor: "cidade" },
        { header: "Potencial", accessor: "potencial" },
      ]}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={(id) => deleteMutation.mutate({ id })}
      createButtonLabel="Novo Cliente"
      renderForm={(_, onClose) => (
        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(v: "PF" | "PJ") => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Potencial</Label>
              <Select value={formData.potencial} onValueChange={(v: any) => setFormData({ ...formData, potencial: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Medio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.tipo === "PF" ? (
              <div className="col-span-2">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
            ) : (
              <>
                <div>
                  <Label>Razão Social *</Label>
                  <Input value={formData.razaoSocial} onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })} required />
                </div>
                <div>
                  <Label>Nome Fantasia</Label>
                  <Input value={formData.nomeFantasia} onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })} />
                </div>
              </>
            )}
            <div>
              <Label>{formData.tipo === "PF" ? "CPF" : "CNPJ"}</Label>
              <Input value={formData.cpfCnpj} onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
            </div>
            <div>
              <Label>Celular</Label>
              <Input value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Endereço</Label>
              <Input value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input value={formData.cidade} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} />
            </div>
            <div>
              <Label>Estado</Label>
              <Input value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} maxLength={2} />
            </div>
            <div className="col-span-2">
              <Label>Observação</Label>
              <Textarea value={formData.observacao} onChange={(e) => setFormData({ ...formData, observacao: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      )}
    />
  );
}
