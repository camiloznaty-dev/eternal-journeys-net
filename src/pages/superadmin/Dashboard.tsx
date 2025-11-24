import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalFunerarias: 0,
    totalUsuarios: 0,
    totalLeads: 0,
    totalCasos: 0,
    totalObituarios: 0,
    totalAnuncios: 0,
    ingresosEstimados: 0,
  });

  useEffect(() => {
    checkSuperAdminAccess();
  }, []);

  const checkSuperAdminAccess = async () => {
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

      setIsSuperAdmin(true);
      await fetchStats();
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const fetchStats = async () => {
    try {
      const [funerarias, usuarios, leads, casos, obituarios, anuncios, facturas] = await Promise.all([
        supabase.from("funerarias").select("*", { count: "exact" }),
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("leads").select("*", { count: "exact" }),
        supabase.from("casos_servicios").select("*", { count: "exact" }),
        supabase.from("obituarios").select("*", { count: "exact" }),
        supabase.from("anuncios_sepulturas").select("*", { count: "exact" }),
        supabase.from("facturas").select("total"),
      ]);

      const totalIngresos = facturas.data?.reduce((sum, f) => sum + (Number(f.total) || 0), 0) || 0;

      setStats({
        totalFunerarias: funerarias.count || 0,
        totalUsuarios: usuarios.count || 0,
        totalLeads: leads.count || 0,
        totalCasos: casos.count || 0,
        totalObituarios: obituarios.count || 0,
        totalAnuncios: anuncios.count || 0,
        ingresosEstimados: totalIngresos,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  const statsCards = [
    {
      title: "Funerarias Registradas",
      value: stats.totalFunerarias,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Usuarios Totales",
      value: stats.totalUsuarios,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Leads Generados",
      value: stats.totalLeads,
      icon: TrendingUp,
      color: "text-sage",
      bgColor: "bg-sage/10",
    },
    {
      title: "Casos Activos",
      value: stats.totalCasos,
      icon: AlertCircle,
      color: "text-terracotta",
      bgColor: "bg-terracotta/10",
    },
    {
      title: "Obituarios Publicados",
      value: stats.totalObituarios,
      icon: FileText,
      color: "text-muted-foreground",
      bgColor: "bg-muted/30",
    },
    {
      title: "Ingresos Estimados",
      value: `$${stats.ingresosEstimados.toLocaleString("es-CL")}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Panel de Super Administrador
          </h1>
          <p className="text-muted-foreground">
            Vista completa del sistema y gestión de la plataforma
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                  </CardContent>
                </Card>
              ))
            : statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-display font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistema de monitoreo de actividad en desarrollo...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Alertas del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Panel de alertas en desarrollo...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
