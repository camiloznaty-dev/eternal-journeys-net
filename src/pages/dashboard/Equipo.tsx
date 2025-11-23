import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Users, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmpleadoDialog } from "@/components/dashboard/EmpleadoDialog";
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

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  phone: string | null;
  role: string;
  activo: boolean | null;
  fecha_ingreso: string | null;
}

const roleLabels: Record<string, string> = {
  director: "Director",
  coordinador: "Coordinador",
  asesor: "Asesor",
  conductor: "Conductor",
  administrador: "Administrador",
  otro: "Otro",
};

const roleBadgeColors: Record<string, string> = {
  director: "bg-purple-500/10 text-purple-700 border-purple-200",
  coordinador: "bg-blue-500/10 text-blue-700 border-blue-200",
  asesor: "bg-green-500/10 text-green-700 border-green-200",
  conductor: "bg-orange-500/10 text-orange-700 border-orange-200",
  administrador: "bg-pink-500/10 text-pink-700 border-pink-200",
  otro: "bg-gray-500/10 text-gray-700 border-gray-200",
};

export default function Equipo() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
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
        .from("empleados")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("nombre");

      if (error) throw error;
      setEmpleados(data || []);
    } catch (error: any) {
      toast.error("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!empleadoToDelete) return;

    try {
      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id", empleadoToDelete);

      if (error) throw error;

      toast.success("Empleado eliminado");
      fetchEmpleados();
    } catch (error: any) {
      toast.error("Error al eliminar empleado");
    } finally {
      setDeleteDialogOpen(false);
      setEmpleadoToDelete(null);
    }
  };

  const filteredEmpleados = empleados.filter((emp) =>
    `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEmpleado(null);
    fetchEmpleados();
  };

  const activosCount = empleados.filter(e => e.activo).length;
  const inactivosCount = empleados.filter(e => !e.activo).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipo</h1>
            <p className="text-muted-foreground">Gestiona tu equipo de trabajo</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Empleado
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{empleados.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{activosCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-500/10 rounded-lg">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold">{inactivosCount}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empleados..."
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
        ) : filteredEmpleados.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay empleados</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No se encontraron empleados"
                  : "Comienza agregando tu primer empleado"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Empleado
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
                  <TableHead>Rol</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">
                      {empleado.nombre} {empleado.apellido}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleBadgeColors[empleado.role] || roleBadgeColors.otro}>
                        {roleLabels[empleado.role] || empleado.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {empleado.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {empleado.email}
                          </div>
                        )}
                        {empleado.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {empleado.phone}
                          </div>
                        )}
                        {!empleado.email && !empleado.phone && "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {empleado.fecha_ingreso
                        ? new Date(empleado.fecha_ingreso).toLocaleDateString("es-CL")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={empleado.activo ? "default" : "secondary"}>
                        {empleado.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingEmpleado(empleado);
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
                            setEmpleadoToDelete(empleado.id);
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

      <EmpleadoDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        empleado={editingEmpleado}
        onSuccess={handleDialogClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El empleado será eliminado permanentemente.
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
