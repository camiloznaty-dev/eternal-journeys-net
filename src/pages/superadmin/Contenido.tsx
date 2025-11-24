import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Eye, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SuperAdminContenido() {
  const [searchTerm, setSearchTerm] = useState("");
  const [obituariosFilter, setObituariosFilter] = useState<string>("all");
  const [anunciosFilter, setAnunciosFilter] = useState<string>("all");
  const [leadsFilter, setLeadsFilter] = useState<string>("all");
  const [selectedFuneraria, setSelectedFuneraria] = useState<string>("all");

  // Fetch obituarios
  const { data: obituarios, isLoading: loadingObituarios, refetch: refetchObituarios } = useQuery({
    queryKey: ["superadmin-obituarios", searchTerm, obituariosFilter, selectedFuneraria],
    queryFn: async () => {
      let query = supabase
        .from("obituarios")
        .select("*, funerarias(name)")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      if (obituariosFilter !== "all") {
        query = query.eq("is_premium", obituariosFilter === "premium");
      }

      if (selectedFuneraria !== "all") {
        query = query.eq("funeraria_id", selectedFuneraria);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch anuncios de sepulturas
  const { data: anuncios, isLoading: loadingAnuncios, refetch: refetchAnuncios } = useQuery({
    queryKey: ["superadmin-anuncios", searchTerm, anunciosFilter, selectedFuneraria],
    queryFn: async () => {
      let query = supabase
        .from("anuncios_sepulturas")
        .select("*, funerarias(name)")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,cementerio.ilike.%${searchTerm}%`);
      }

      if (anunciosFilter !== "all") {
        query = query.eq("status", anunciosFilter);
      }

      if (selectedFuneraria !== "all") {
        query = query.eq("funeraria_id", selectedFuneraria);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch leads
  const { data: leads, isLoading: loadingLeads, refetch: refetchLeads } = useQuery({
    queryKey: ["superadmin-leads", searchTerm, leadsFilter, selectedFuneraria],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*, funerarias(name), empleados(nombre, apellido)")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (leadsFilter !== "all") {
        query = query.eq("status", leadsFilter);
      }

      if (selectedFuneraria !== "all") {
        query = query.eq("funeraria_id", selectedFuneraria);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch funerarias for filter
  const { data: funerarias } = useQuery({
    queryKey: ["funerarias-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funerarias")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleDeleteObituario = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este obituario?")) return;
    
    const { error } = await supabase.from("obituarios").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar obituario");
    } else {
      toast.success("Obituario eliminado");
      refetchObituarios();
    }
  };

  const handleDeleteAnuncio = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este anuncio?")) return;
    
    const { error } = await supabase.from("anuncios_sepulturas").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar anuncio");
    } else {
      toast.success("Anuncio eliminado");
      refetchAnuncios();
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este lead?")) return;
    
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar lead");
    } else {
      toast.success("Lead eliminado");
      refetchLeads();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      disponible: "default",
      vendido: "secondary",
      reservado: "outline",
      nuevo: "default",
      contactado: "outline",
      calificado: "secondary",
      convertido: "default",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Gestión de Contenido</h1>
          <p className="text-muted-foreground">
            Administra obituarios, anuncios de sepulturas y leads del sistema
          </p>
        </div>

        {/* Filtros globales */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedFuneraria} onValueChange={setSelectedFuneraria}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filtrar por funeraria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las funerarias</SelectItem>
                {funerarias?.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Tabs defaultValue="obituarios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="obituarios">Obituarios</TabsTrigger>
            <TabsTrigger value="anuncios">Anuncios de Sepulturas</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          {/* Obituarios Tab */}
          <TabsContent value="obituarios">
            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={obituariosFilter} onValueChange={setObituariosFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="basic">Básicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Funeraria</TableHead>
                    <TableHead>Nacimiento</TableHead>
                    <TableHead>Fallecimiento</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingObituarios ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : obituarios?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No se encontraron obituarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    obituarios?.map((obit) => (
                      <TableRow key={obit.id}>
                        <TableCell className="font-medium">{obit.name}</TableCell>
                        <TableCell>{obit.funerarias?.name || "N/A"}</TableCell>
                        <TableCell>{format(new Date(obit.birth_date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{format(new Date(obit.death_date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{obit.views || 0}</TableCell>
                        <TableCell>
                          <Badge variant={obit.is_premium ? "default" : "secondary"}>
                            {obit.is_premium ? "Premium" : "Básico"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(obit.created_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/obituarios/${obit.id}`, "_blank")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteObituario(obit.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Anuncios Tab */}
          <TabsContent value="anuncios">
            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={anunciosFilter} onValueChange={setAnunciosFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Funeraria</TableHead>
                    <TableHead>Cementerio</TableHead>
                    <TableHead>Comuna</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingAnuncios ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : anuncios?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No se encontraron anuncios
                      </TableCell>
                    </TableRow>
                  ) : (
                    anuncios?.map((anuncio) => (
                      <TableRow key={anuncio.id}>
                        <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                        <TableCell>{anuncio.funerarias?.name || "Particular"}</TableCell>
                        <TableCell>{anuncio.cementerio}</TableCell>
                        <TableCell>{anuncio.comuna}</TableCell>
                        <TableCell>${anuncio.precio.toLocaleString("es-CL")}</TableCell>
                        <TableCell>{getStatusBadge(anuncio.status || "disponible")}</TableCell>
                        <TableCell>{anuncio.views || 0}</TableCell>
                        <TableCell>{format(new Date(anuncio.created_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAnuncio(anuncio.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={leadsFilter} onValueChange={setLeadsFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="contactado">Contactado</SelectItem>
                      <SelectItem value="calificado">Calificado</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                      <SelectItem value="perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Funeraria</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingLeads ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : leads?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No se encontraron leads
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.funerarias?.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.email || "N/A"}</TableCell>
                        <TableCell>
                          {Array.isArray(lead.empleados) && lead.empleados.length > 0
                            ? `${lead.empleados[0].nombre} ${lead.empleados[0].apellido}`
                            : "Sin asignar"}
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status || "nuevo")}</TableCell>
                        <TableCell>
                          <Badge variant={lead.priority === "alta" ? "destructive" : lead.priority === "media" ? "default" : "secondary"}>
                            {lead.priority || "media"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(lead.created_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
