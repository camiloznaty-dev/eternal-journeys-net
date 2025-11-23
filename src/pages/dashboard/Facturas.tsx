import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FacturaDialog } from "@/components/dashboard/FacturaDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Facturas() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
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
        .from("facturas")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFacturas(data || []);
    } catch (error: any) {
      toast.error("Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      pagada: "bg-green-500/10 text-green-700 border-green-200",
      vencida: "bg-red-500/10 text-red-700 border-red-200",
      anulada: "bg-gray-500/10 text-gray-700 border-gray-200"
    };
    return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const filteredFacturas = facturas.filter((factura) => {
    const matchesSearch = factura.numero_factura.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || factura.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingFactura(null);
    fetchFacturas();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Facturas</h1>
            <p className="text-muted-foreground">Gestiona tus facturas</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Nueva Factura
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar facturas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="pagada">Pagada</SelectItem>
              <SelectItem value="vencida">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <Card className="p-6"><div className="h-32 bg-muted rounded animate-pulse" /></Card>
        ) : filteredFacturas.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay facturas</h3>
            <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Agregar Factura</Button>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.map((factura) => (
                  <TableRow key={factura.id} className="cursor-pointer" onClick={() => { setEditingFactura(factura); setDialogOpen(true); }}>
                    <TableCell className="font-medium">{factura.numero_factura}</TableCell>
                    <TableCell>{new Date(factura.fecha_emision).toLocaleDateString("es-CL")}</TableCell>
                    <TableCell>${factura.total.toLocaleString("es-CL")}</TableCell>
                    <TableCell><Badge className={getStatusColor(factura.status)}>{factura.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      <FacturaDialog open={dialogOpen} onOpenChange={handleDialogClose} factura={editingFactura} onSuccess={handleDialogClose} />
    </DashboardLayout>
  );
}
