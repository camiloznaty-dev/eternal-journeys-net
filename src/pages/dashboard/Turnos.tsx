import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Turnos() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Turnos</h1>
            <p className="text-muted-foreground">Gestiona los turnos de tu equipo</p>
          </div>
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Turno</Button>
        </div>
        <p className="text-muted-foreground">Módulo de gestión de turnos en desarrollo...</p>
      </div>
    </DashboardLayout>
  );
}
