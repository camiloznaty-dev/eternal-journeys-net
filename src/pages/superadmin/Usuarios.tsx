import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignPlanDialog } from "@/components/superadmin/AssignPlanDialog";

export default function SuperAdminUsuarios() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<any[]>([]);
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

      await fetchUsuarios();
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Get funerarias and empleados data
      const { data: empleados, error: empleadosError } = await supabase
        .from("empleados")
        .select("user_id, funeraria_id, funerarias(id, name)");

      if (empleadosError) throw empleadosError;

      // Get funeraria plans
      const funerariaIds = empleados?.map(e => e.funeraria_id).filter(Boolean) || [];
      const { data: funerariaPlanes, error: planesError } = await supabase
        .from("funeraria_planes")
        .select("*, planes(nombre)")
        .in("funeraria_id", funerariaIds)
        .eq("estado", "activo");

      if (planesError) throw planesError;

      const usersWithRoles = profiles?.map((profile) => {
        const userRoles = roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
        const empleado = empleados?.find(e => e.user_id === profile.id);
        const funeraria = empleado?.funerarias;
        const plan = funerariaPlanes?.find(fp => fp.funeraria_id === empleado?.funeraria_id);

        return {
          ...profile,
          roles: userRoles,
          funeraria: funeraria,
          funerariaId: empleado?.funeraria_id,
          currentPlan: plan
        };
      });

      setUsuarios(usersWithRoles || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superadmin":
        return "destructive";
      case "funeraria":
        return "default";
      case "cliente":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra todos los usuarios y sus roles en la plataforma
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email o nombre..."
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
                    <TableHead>Email</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Funeraria</TableHead>
                    <TableHead>Plan Actual</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{usuario.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{usuario.full_name || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {usuario.roles.length > 0 ? (
                              usuario.roles.map((role: string) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                  {role === "superadmin" && <Shield className="h-3 w-3 mr-1" />}
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline">Sin rol</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {usuario.funeraria ? (
                            <span className="font-medium">{usuario.funeraria.name}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {usuario.currentPlan ? (
                            <Badge variant="default">
                              {usuario.currentPlan.planes?.nombre || "Plan Asignado"}
                            </Badge>
                          ) : usuario.roles.includes("funeraria") ? (
                            <Badge variant="outline">Sin plan</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {usuario.phone || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(usuario.created_at).toLocaleDateString("es-CL")}
                        </TableCell>
                        <TableCell>
                          {usuario.roles.includes("funeraria") && usuario.funerariaId && (
                            <AssignPlanDialog
                              funerariaId={usuario.funerariaId}
                              funerariaName={usuario.funeraria?.name || "Funeraria"}
                              currentPlan={usuario.currentPlan}
                              onSuccess={fetchUsuarios}
                            />
                          )}
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
