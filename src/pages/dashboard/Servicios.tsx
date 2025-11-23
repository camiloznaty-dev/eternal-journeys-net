import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServiceDialog } from "@/components/dashboard/ServiceDialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: string | null;
  category: string;
  features: any;
  images: string[];
  sku: string | null;
  is_featured: boolean;
  stock_available: boolean;
  funeraria_id: string;
}

const categoryLabels: Record<string, string> = {
  plan_funerario: "Plan Funerario",
  traslado: "Traslado",
  cremacion: "Cremación",
  arreglo_floral: "Arreglo Floral",
  velorio: "Velorio",
  ceremonia: "Ceremonia",
  lapida: "Lápida",
  urna: "Urna",
  otro: "Otro",
};

const categoryColors: Record<string, string> = {
  plan_funerario: "bg-blue-500/10 text-blue-600 border-blue-200",
  traslado: "bg-purple-500/10 text-purple-600 border-purple-200",
  cremacion: "bg-orange-500/10 text-orange-600 border-orange-200",
  arreglo_floral: "bg-pink-500/10 text-pink-600 border-pink-200",
  velorio: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  ceremonia: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  lapida: "bg-slate-500/10 text-slate-600 border-slate-200",
  urna: "bg-amber-500/10 text-amber-600 border-amber-200",
  otro: "bg-gray-500/10 text-gray-600 border-gray-200",
};

export default function Servicios() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get funeraria_id from empleados
      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const { error } = await supabase
        .from("servicios")
        .delete()
        .eq("id", serviceToDelete);

      if (error) throw error;

      toast.success("Servicio eliminado");
      fetchServices();
    } catch (error: any) {
      toast.error("Error al eliminar servicio");
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingService(null);
    fetchServices();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Servicios</h1>
            <p className="text-muted-foreground">Gestiona los servicios que ofreces</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay servicios</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== "all"
                  ? "No se encontraron servicios con los filtros aplicados"
                  : "Comienza agregando tu primer servicio"}
              </p>
              {!searchTerm && categoryFilter === "all" && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Servicio
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {service.images && service.images.length > 0 ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{service.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {service.description || "Sin descripción"}
                      </CardDescription>
                    </div>
                    {service.is_featured && (
                      <Badge variant="secondary" className="shrink-0">
                        Destacado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${service.price.toLocaleString("es-CL")}
                    </span>
                    <Badge className={categoryColors[service.category] || categoryColors.otro}>
                      {categoryLabels[service.category] || "Otro"}
                    </Badge>
                  </div>
                  {service.duration && (
                    <p className="text-sm text-muted-foreground">
                      Duración: {service.duration}
                    </p>
                  )}
                  {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-1">Características:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        {service.features.slice(0, 3).map((feature: string, idx: number) => (
                          <li key={idx} className="line-clamp-1">
                            {feature}
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-xs">+{service.features.length - 3} más</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setServiceToDelete(service.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        service={editingService}
        onSuccess={handleDialogClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El servicio será eliminado permanentemente.
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
