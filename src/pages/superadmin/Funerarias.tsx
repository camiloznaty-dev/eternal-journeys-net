import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuperAdminFunerarias() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [funerarias, setFunerarias] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "superadmin")
        .single();

      if (!roleData) {
        navigate("/");
        return;
      }

      await fetchFunerarias();
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const fetchFunerarias = async () => {
    try {
      const { data, error } = await supabase
        .from("funerarias")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFunerarias(data || []);
    } catch (error) {
      console.error("Error fetching funerarias:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunerarias = funerarias.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Gestión de Funerarias</h1>
            <p className="text-muted-foreground">
              Administra todas las funerarias registradas en la plataforma
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFunerarias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No se encontraron funerarias
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFunerarias.map((funeraria) => (
                      <TableRow key={funeraria.id}>
                        <TableCell className="font-medium">{funeraria.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {funeraria.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span className="text-muted-foreground">{funeraria.email}</span>
                              </div>
                            )}
                            {funeraria.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                <span className="text-muted-foreground">{funeraria.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                            <span className="line-clamp-2">{funeraria.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={funeraria.website_active ? "default" : "secondary"}>
                            {funeraria.website_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(funeraria.created_at).toLocaleDateString("es-CL")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/f/${funeraria.slug}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
