import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface CrudTableProps<T extends { id: number }> {
  title: string;
  description?: string;
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  renderForm: (editingItem: T | null, onClose: () => void) => ReactNode;
  createButtonLabel?: string;
}

export function CrudTable<T extends { id: number }>({
  title,
  description,
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  renderForm,
  createButtonLabel = "Novo",
}: CrudTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setOpen(true);
    onEdit(item);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      onDelete(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) handleClose(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar" : "Novo"} {title}</DialogTitle>
            </DialogHeader>
            {renderForm(editingItem, handleClose)}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de {title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col, idx) => (
                    <TableHead key={idx} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((col, idx) => (
                        <TableCell key={idx} className={col.className}>
                          {typeof col.accessor === "function"
                            ? col.accessor(item)
                            : String(item[col.accessor] ?? "-")}
                        </TableCell>
                      ))}
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
