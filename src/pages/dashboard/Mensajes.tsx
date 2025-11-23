import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function Mensajes() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground">Sistema de mensajería interno</p>
        </div>
        <p className="text-muted-foreground">Módulo de mensajería en desarrollo...</p>
      </div>
    </DashboardLayout>
  );
}
