import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Equipo() {
  const empleados = [
    {
      id: "1",
      nombre: "Juan Pérez",
      role: "Director",
      email: "juan@funeraria.cl",
      phone: "+56912345678",
      activo: true
    },
    {
      id: "2",
      nombre: "María González",
      role: "Asesora",
      email: "maria@funeraria.cl",
      phone: "+56987654321",
      activo: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipo</h1>
            <p className="text-muted-foreground">
              Gestiona tu equipo de trabajo
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Empleado
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {empleados.map((empleado) => (
            <Card key={empleado.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {empleado.nombre.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{empleado.nombre}</h3>
                      {empleado.activo && (
                        <Badge variant="outline" className="text-xs">Activo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{empleado.role}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{empleado.email}</p>
                      <p>{empleado.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
