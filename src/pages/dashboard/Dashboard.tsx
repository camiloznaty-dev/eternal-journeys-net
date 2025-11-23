import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, DollarSign } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Leads Activos",
      value: "23",
      change: "+12%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Casos en Curso",
      value: "8",
      change: "+3",
      icon: Briefcase,
      trend: "up"
    },
    {
      title: "Equipo",
      value: "12",
      change: "2 online",
      icon: Users,
      trend: "neutral"
    },
    {
      title: "Ingresos del Mes",
      value: "$2.4M",
      change: "+18%",
      icon: DollarSign,
      trend: "up"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Panel Principal</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu dashboard. Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} desde el último mes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo lead asignado</p>
                    <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cotización enviada</p>
                    <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Servicio completado</p>
                    <p className="text-xs text-muted-foreground">Hace 3 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Llamar a familia González</p>
                    <p className="text-xs text-muted-foreground">Vence hoy</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Preparar ceremonia</p>
                    <p className="text-xs text-muted-foreground">Vence mañana</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Actualizar inventario</p>
                    <p className="text-xs text-muted-foreground">Vence en 2 días</p>
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
