import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadDialog } from "@/components/dashboard/LeadDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
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
        .from("leads")
        .select(`
          *,
          asignado:empleados(nombre, apellido)
        `)
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error("Error al cargar leads");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      nuevo: "bg-blue-500/10 text-blue-700 border-blue-200",
      contactado: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      cotizado: "bg-purple-500/10 text-purple-700 border-purple-200",
      negociacion: "bg-orange-500/10 text-orange-700 border-orange-200",
      ganado: "bg-green-500/10 text-green-700 border-green-200",
      perdido: "bg-red-500/10 text-red-700 border-red-200"
    };
    return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      baja: "bg-gray-500/10 text-gray-700 border-gray-200",
      media: "bg-blue-500/10 text-blue-700 border-blue-200",
      alta: "bg-orange-500/10 text-orange-700 border-orange-200",
      urgente: "bg-red-500/10 text-red-700 border-red-200"
    };
    return colors[priority] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingLead(null);
    fetchLeads();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes potenciales
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Lead
          </Button>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar leads..."
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
              <SelectItem value="nuevo">Nuevo</SelectItem>
              <SelectItem value="contactado">Contactado</SelectItem>
              <SelectItem value="cotizado">Cotizado</SelectItem>
              <SelectItem value="negociacion">Negociación</SelectItem>
              <SelectItem value="ganado">Ganado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
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
        ) : filteredLeads.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold mb-2">No hay leads</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "No se encontraron leads con los filtros aplicados"
                  : "Comienza agregando tu primer lead"}
              </p>
              {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Lead
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setEditingLead(lead);
                  setDialogOpen(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{lead.name}</h3>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <Badge className={getPriorityColor(lead.priority)}>
                          {lead.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span>{lead.phone}</span>
                        {lead.email && (
                          <>
                            <span>•</span>
                            <span>{lead.email}</span>
                          </>
                        )}
                        {lead.source && (
                          <>
                            <span>•</span>
                            <span>Fuente: {lead.source}</span>
                          </>
                        )}
                        {lead.asignado && (
                          <>
                            <span>•</span>
                            <span>Asignado: {lead.asignado.nombre}</span>
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

      <LeadDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        lead={editingLead}
        onSuccess={handleDialogClose}
      />
    </DashboardLayout>
  );
}
