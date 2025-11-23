import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CasoDialog } from "@/components/dashboard/CasoDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Casos() {
  const [casos, setCasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCaso, setEditingCaso] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = async () => {
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
        .from("casos_servicios")
        .select(`
          *,
          responsable:empleados(nombre, apellido)
        `)
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCasos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar casos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planificacion: "bg-blue-500/10 text-blue-700 border-blue-200",
      en_curso: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      completado: "bg-green-500/10 text-green-700 border-green-200",
      cancelado: "bg-red-500/10 text-red-700 border-red-200"
    };
    return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planificacion: "Planificación",
      en_curso: "En Curso",
      completado: "Completado",
      cancelado: "Cancelado"
    };
    return labels[status] || status;
  };

  const filteredCasos = casos.filter((caso) => {
    const matchesSearch =
      caso.difunto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.difunto_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.tipo_servicio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || caso.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCaso(null);
    fetchCasos();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Casos Activos</h1>
            <p className="text-muted-foreground">
              Servicios funerarios en gestión
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Caso
          </Button>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar casos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="planificacion">Planificación</SelectItem>
              <SelectItem value="en_curso">En Curso</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCasos.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold mb-2">No hay casos</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No se encontraron casos con los filtros aplicados"
                  : "Comienza agregando tu primer caso"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Caso
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCasos.map((caso) => (
              <Card
                key={caso.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setEditingCaso(caso);
                  setDialogOpen(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {caso.difunto_nombre} {caso.difunto_apellido}
                        </h3>
                        <Badge className={getStatusColor(caso.status)}>
                          {getStatusLabel(caso.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span>{caso.tipo_servicio}</span>
                        {caso.fecha_velorio && (
                          <>
                            <span>•</span>
                            <span>Velorio: {new Date(caso.fecha_velorio).toLocaleDateString("es-CL")}</span>
                          </>
                        )}
                        {caso.responsable && (
                          <>
                            <span>•</span>
                            <span>Responsable: {caso.responsable.nombre} {caso.responsable.apellido}</span>
                          </>
                        )}
                        {caso.monto_total && (
                          <>
                            <span>•</span>
                            <span>Monto: ${caso.monto_total.toLocaleString("es-CL")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CasoDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        caso={editingCaso}
        onSuccess={handleDialogClose}
      />
    </DashboardLayout>
  );
}
