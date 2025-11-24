import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Eye, MessageCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AnunciosSepulturas() {
  const [statusFilter, setStatusFilter] = useState<string>("disponible");

  const { data: anuncios, isLoading } = useQuery({
    queryKey: ["dashboard-anuncios-sepulturas", statusFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      let query = supabase
        .from("anuncios_sepulturas")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "todos") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: consultas } = useQuery({
    queryKey: ["consultas-sepulturas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from("consultas_sepulturas")
        .select(`
          *,
          anuncio:anuncios_sepulturas(titulo)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      disponible: "default",
      reservada: "secondary",
      vendida: "outline",
    } as const;

    const labels = {
      disponible: "Disponible",
      reservada: "Reservada",
      vendida: "Vendida",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Sepulturas</h1>
            <p className="text-muted-foreground">
              Administra los anuncios de sepulturas y consultas recibidas
            </p>
          </div>
          <Button asChild>
            <Link to="/publicar-sepultura">
              <Plus className="mr-2 h-4 w-4" />
              Publicar anuncio
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="anuncios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
            <TabsTrigger value="consultas">
              Consultas
              {consultas && consultas.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {consultas.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anuncios" className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "disponible" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("disponible")}
              >
                Disponibles
              </Button>
              <Button
                variant={statusFilter === "reservada" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("reservada")}
              >
                Reservadas
              </Button>
              <Button
                variant={statusFilter === "vendida" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("vendida")}
              >
                Vendidas
              </Button>
              <Button
                variant={statusFilter === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("todos")}
              >
                Todos
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mis Anuncios</CardTitle>
                <CardDescription>
                  {anuncios?.length || 0} anuncios en total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Vistas</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Cargando...
                        </TableCell>
                      </TableRow>
                    ) : anuncios && anuncios.length > 0 ? (
                      anuncios.map((anuncio) => (
                        <TableRow key={anuncio.id}>
                          <TableCell className="font-medium">
                            {anuncio.titulo}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {anuncio.comuna}
                            </div>
                          </TableCell>
                          <TableCell>{anuncio.tipo_sepultura}</TableCell>
                          <TableCell>{formatPrecio(anuncio.precio)}</TableCell>
                          <TableCell>{getStatusBadge(anuncio.status)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {anuncio.views}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(anuncio.created_at), "dd MMM yyyy", { locale: es })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay anuncios
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultas">
            <Card>
              <CardHeader>
                <CardTitle>Consultas Recibidas</CardTitle>
                <CardDescription>
                  Personas interesadas en tus anuncios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anuncio</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mensaje</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultas && consultas.length > 0 ? (
                      consultas.map((consulta: any) => (
                        <TableRow key={consulta.id}>
                          <TableCell className="font-medium">
                            {consulta.anuncio?.titulo || "N/A"}
                          </TableCell>
                          <TableCell>{consulta.nombre}</TableCell>
                          <TableCell>{consulta.telefono}</TableCell>
                          <TableCell>{consulta.email || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {consulta.mensaje || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(consulta.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No hay consultas aún
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}