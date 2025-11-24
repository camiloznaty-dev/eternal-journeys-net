import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, DollarSign, FileText, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { PlanCard } from "@/components/dashboard/PlanCard";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";
  
  const [stats, setStats] = useState({
    leads_nuevos: 0,
    leads_mes: 0,
    casos_activos: 0,
    empleados_activos: 0,
    ingresos_mes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo data
      setStats({
        leads_nuevos: 12,
        leads_mes: 45,
        casos_activos: 8,
        empleados_activos: 15,
        ingresos_mes: 8500000,
      });
      setLoading(false);
    } else {
      fetchStats();
    }
  }, [isDemoMode]);

  const fetchStats = async () => {
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
        .from("dashboard_stats")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .single();

      if (error) throw error;
      if (data) {
        setStats({
          leads_nuevos: data.leads_nuevos || 0,
          leads_mes: data.leads_mes || 0,
          casos_activos: data.casos_activos || 0,
          empleados_activos: data.empleados_activos || 0,
          ingresos_mes: data.ingresos_mes || 0,
        });
      }
    } catch (error: any) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Leads Nuevos",
      value: stats.leads_nuevos,
      change: `${stats.leads_mes} este mes`,
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Servicios Activos",
      value: stats.casos_activos,
      change: "En proceso",
      icon: Briefcase,
      trend: "up"
    },
    {
      title: "Equipo Activo",
      value: stats.empleados_activos,
      change: "Empleados",
      icon: Users,
      trend: "neutral"
    },
    {
      title: "Ingresos del Mes",
      value: `$${(stats.ingresos_mes / 1000000).toFixed(1)}M`,
      change: "CLP",
      icon: DollarSign,
      trend: "up"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Panel Principal</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bienvenido a tu dashboard. Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-20" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Nuevo lead asignado</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Cotización enviada</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Hace 1 hora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Servicio completado</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Hace 3 horas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PlanCard />
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <input type="checkbox" className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Llamar a familia González</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Vence hoy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input type="checkbox" className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Preparar ceremonia</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Vence mañana</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input type="checkbox" className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Actualizar inventario</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Vence en 2 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Ceremonia Familia López</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Hoy, 15:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Reunión con proveedor</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Mañana, 10:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
