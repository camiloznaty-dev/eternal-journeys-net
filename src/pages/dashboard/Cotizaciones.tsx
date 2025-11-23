import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, FileText, Download, Send, Eye, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CotizacionDialog } from "@/components/dashboard/CotizacionDialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateQuotePDF } from "@/lib/quotePDF";
import type { Cotizacion } from "@/types/cotizaciones";

const statusLabels: Record<string, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

const statusColors: Record<string, string> = {
  borrador: "bg-gray-500/10 text-gray-700 border-gray-200",
  enviada: "bg-blue-500/10 text-blue-700 border-blue-200",
  aceptada: "bg-green-500/10 text-green-700 border-green-200",
  rechazada: "bg-red-500/10 text-red-700 border-red-200",
};

const statusIcons: Record<string, any> = {
  borrador: FileText,
  enviada: Send,
  aceptada: CheckCircle,
  rechazada: XCircle,
};

export default function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCotizacion, setEditingCotizacion] = useState<Cotizacion | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cotizacionToDelete, setCotizacionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
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
        .from("cotizaciones")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCotizaciones(data || []);
    } catch (error: any) {
      toast.error("Error al cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cotizacionToDelete) return;

    try {
      const { error } = await supabase
        .from("cotizaciones")
        .delete()
        .eq("id", cotizacionToDelete);

      if (error) throw error;

      toast.success("Cotización eliminada");
      fetchCotizaciones();
    } catch (error: any) {
      toast.error("Error al eliminar cotización");
    } finally {
      setDeleteDialogOpen(false);
      setCotizacionToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("cotizaciones")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Estado cambiado a ${statusLabels[newStatus]}`);
      fetchCotizaciones();
    } catch (error: any) {
      toast.error("Error al cambiar estado");
    }
  };

  const handleDownloadPDF = async (cotizacion: Cotizacion) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id, funerarias(*)")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      let vendedor = null;
      if (cotizacion.vendedor_id) {
        const { data: vendedorData } = await supabase
          .from("empleados")
          .select("nombre, apellido, email, phone")
          .eq("id", cotizacion.vendedor_id)
          .single();
        vendedor = vendedorData;
      }

      await generateQuotePDF(cotizacion, empleado.funerarias, vendedor);
      toast.success("PDF generado");
    } catch (error: any) {
      toast.error("Error al generar PDF");
      console.error(error);
    }
  };

  const filteredCotizaciones = cotizaciones.filter((cot) => {
    const matchesSearch =
      cot.numero_cotizacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.notas?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCotizacion(null);
    fetchCotizaciones();
  };

  const stats = {
    total: cotizaciones.length,
    borrador: cotizaciones.filter(c => c.status === "borrador").length,
    enviada: cotizaciones.filter(c => c.status === "enviada").length,
    aceptada: cotizaciones.filter(c => c.status === "aceptada").length,
    rechazada: cotizaciones.filter(c => c.status === "rechazada").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cotizaciones</h1>
            <p className="text-muted-foreground">Gestiona tus cotizaciones</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cotización
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          {Object.entries(statusLabels).map(([key, label]) => {
            const Icon = statusIcons[key];
            return (
              <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(key)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats[key as keyof typeof stats]}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {statusFilter !== "all" && (
            <Button variant="outline" onClick={() => setStatusFilter("all")}>
              Mostrar todas
            </Button>
          )}
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredCotizaciones.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No se encontraron cotizaciones"
                  : "Comienza creando tu primera cotización"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cotización
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Válida hasta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCotizaciones.map((cotizacion) => {
                  const items = Array.isArray(cotizacion.items) ? cotizacion.items : [];
                  const Icon = statusIcons[cotizacion.status || "borrador"];
                  
                  return (
                    <TableRow key={cotizacion.id}>
                      <TableCell className="font-medium">
                        {cotizacion.numero_cotizacion}
                      </TableCell>
                      <TableCell>
                        {new Date(cotizacion.created_at).toLocaleDateString("es-CL")}
                      </TableCell>
                      <TableCell>{items.length} items</TableCell>
                      <TableCell className="font-semibold">
                        ${cotizacion.total.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {cotizacion.valida_hasta
                          ? new Date(cotizacion.valida_hasta).toLocaleDateString("es-CL")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[cotizacion.status || "borrador"]}>
                          <Icon className="mr-1 h-3 w-3" />
                          {statusLabels[cotizacion.status || "borrador"]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setEditingCotizacion(cotizacion);
                              setDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(cotizacion)}>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                            {Object.entries(statusLabels).map(([status, label]) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusChange(cotizacion.id, status)}
                                disabled={cotizacion.status === status}
                              >
                                {label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCotizacionToDelete(cotizacion.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <CotizacionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        cotizacion={editingCotizacion}
        onSuccess={handleDialogClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cotización?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cotización será eliminada permanentemente.
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
