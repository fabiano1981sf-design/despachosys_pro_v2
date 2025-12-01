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

export default function Usuarios() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
  });

  const utils = trpc.useUtils();
  const { data: usuarios, isLoading } = trpc.usuarios.list.useQuery();

  // Criar usuários é feito via OAuth, não manualmente

  const updateMutation = trpc.usuarios.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado!");
      utils.usuarios.list.invalidate();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Deletar usuários não é permitido por questões de auditoria
  // Apenas desativar seria a opção ideal

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (usuario: any) => {
    setEditingId(usuario.id);
    setFormData({
      name: usuario.name || "",
      email: usuario.email || "",
      role: usuario.role || "user",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Preencha todos os campos");
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, role: formData.role });
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      user: "bg-blue-100 text-blue-800",
    };
    const labels: Record<string, string> = {
      admin: "Administrador",
      user: "Usuário",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role] || ""}`}>
        {labels[role] || role}
      </span>
    );
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar" : "Novo"} Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Função</Label>
                <Select value={formData.role} onValueChange={(v: any) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  Atualizar Usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios?.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.name}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{getRoleBadge(usuario.role)}</TableCell>
                      <TableCell>{formatDate(usuario.lastSignedIn)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(usuario)}
                          >
                            <Pencil className="h-4 w-4" />
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
