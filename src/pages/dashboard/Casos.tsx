import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Casos() {
  const casos = [
    {
      id: "1",
      difunto: "Pedro Ramírez Silva",
      tipo: "Velorio completo",
      fecha_velorio: "2025-01-25",
      status: "en_curso",
      responsable: "Juan Pérez"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Casos Activos</h1>
            <p className="text-muted-foreground">
              Servicios funerarios en curso
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Caso
          </Button>
        </div>

        <div className="grid gap-4">
          {casos.map((caso) => (
            <Card key={caso.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{caso.difunto}</h3>
                      <Badge>{caso.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{caso.tipo}</span>
                      <span>•</span>
                      <span>Velorio: {caso.fecha_velorio}</span>
                      <span>•</span>
                      <span>Responsable: {caso.responsable}</span>
                    </div>
                  </div>
                  <Button variant="ghost">Ver Detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
