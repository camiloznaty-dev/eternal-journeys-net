import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProveedorDialog } from "@/components/dashboard/ProveedorDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data, error } = await supabase
        .from("proveedores")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("nombre");

      if (error) throw error;
      setProveedores(data || []);
    } catch (error: any) {
      toast.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!proveedorToDelete) return;

    try {
      const { error } = await supabase
        .from("proveedores")
        .delete()
        .eq("id", proveedorToDelete);

      if (error) throw error;

      toast.success("Proveedor eliminado");
      fetchProveedores();
    } catch (error: any) {
      toast.error("Error al eliminar proveedor");
    } finally {
      setDeleteDialogOpen(false);
      setProveedorToDelete(null);
    }
  };

  const filteredProveedores = proveedores.filter((prov) =>
    prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prov.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prov.contacto_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProveedor(null);
    fetchProveedores();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <p className="text-muted-foreground">Gestiona tus proveedores</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <Card>
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </Card>
        ) : filteredProveedores.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold mb-2">No hay proveedores</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No se encontraron proveedores"
                  : "Comienza agregando tu primer proveedor"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Proveedor
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.categoria || "-"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{proveedor.contacto_nombre || "-"}</p>
                        {proveedor.email && (
                          <p className="text-xs text-muted-foreground">{proveedor.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{proveedor.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={proveedor.activo ? "default" : "secondary"}>
                        {proveedor.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProveedor(proveedor);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setProveedorToDelete(proveedor.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ProveedorDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        proveedor={editingProveedor}
        onSuccess={handleDialogClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proveedor será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
