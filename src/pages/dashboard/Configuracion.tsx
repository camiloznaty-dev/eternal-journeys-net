import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Configuracion() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Configura las opciones de tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>Opciones de configuración en desarrollo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Módulo de configuración en desarrollo...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
