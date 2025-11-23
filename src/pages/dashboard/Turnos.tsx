import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TurnoDialog } from "@/components/dashboard/TurnoDialog";

export default function Turnos() {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => { fetchTurnos(); }, []);

  const fetchTurnos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: empleado } = await supabase.from("empleados").select("funeraria_id").eq("user_id", session.user.id).single();
      if (!empleado) return;
      const { data: allEmpleados } = await supabase.from("empleados").select("id").eq("funeraria_id", empleado.funeraria_id);
      if (!allEmpleados) return;
      const { data, error } = await supabase.from("turnos").select("*, empleado:empleados(nombre, apellido)").in("empleado_id", allEmpleados.map(e => e.id)).order("fecha");
      if (error) throw error;
      setTurnos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Turnos</h1><p className="text-muted-foreground">Calendario de turnos</p></div>
          <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Turno</Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold">{weekDays[0].toLocaleDateString("es-CL")} - {weekDays[6].toLocaleDateString("es-CL")}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 grid-cols-7">
          {weekDays.map((day, i) => (
            <Card key={i}><CardHeader className="pb-3"><CardTitle className="text-sm">{day.toLocaleDateString("es-CL", { weekday: "short", day: "numeric" })}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Sin turnos</p></CardContent></Card>
          ))}
        </div>
      </div>
      <TurnoDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchTurnos} />
    </DashboardLayout>
  );
}
