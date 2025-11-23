import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentosTab } from "@/components/proveedor/DocumentosTab";
import { PedidosTab } from "@/components/proveedor/PedidosTab";
import { PagosTab } from "@/components/proveedor/PagosTab";
import { RecordatoriosTab } from "@/components/proveedor/RecordatoriosTab";
import { Badge } from "@/components/ui/badge";

export default function ProveedorDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProveedor();
    }
  }, [id]);

  const fetchProveedor = async () => {
    try {
      const { data, error } = await supabase
        .from("proveedores")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProveedor(data);
    } catch (error: any) {
      toast.error("Error al cargar proveedor");
      navigate("/dashboard/proveedores");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!proveedor) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/proveedores")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">{proveedor.nombre}</h1>
                <p className="text-muted-foreground">
                  {proveedor.categoria || "Sin categoría"}
                </p>
              </div>
              <Badge variant={proveedor.activo ? "default" : "secondary"}>
                {proveedor.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">RUT</p>
                <p className="font-medium">{proveedor.rut || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Contacto</p>
                <p className="font-medium">{proveedor.contacto_nombre || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{proveedor.email || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Teléfono</p>
                <p className="font-medium">{proveedor.phone || "-"}</p>
              </div>
              {proveedor.direccion && (
                <div className="md:col-span-2 lg:col-span-4">
                  <p className="text-muted-foreground mb-1">Dirección</p>
                  <p className="font-medium">{proveedor.direccion}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="documentos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
            <TabsTrigger value="recordatorios">Recordatorios</TabsTrigger>
          </TabsList>

          <TabsContent value="documentos">
            <DocumentosTab proveedorId={id!} />
          </TabsContent>

          <TabsContent value="pedidos">
            <PedidosTab proveedorId={id!} />
          </TabsContent>

          <TabsContent value="pagos">
            <PagosTab proveedorId={id!} />
          </TabsContent>

          <TabsContent value="recordatorios">
            <RecordatoriosTab proveedorId={id!} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
