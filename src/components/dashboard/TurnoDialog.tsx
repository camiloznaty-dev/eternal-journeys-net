import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TurnoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turno?: any;
  onSuccess: () => void;
}

export function TurnoDialog({ open, onOpenChange, turno, onSuccess }: TurnoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    empleado_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo: "regular",
    notas: ""
  });

  useEffect(() => {
    if (open) {
      fetchEmpleados();
      if (turno) {
        setFormData({
          empleado_id: turno.empleado_id || "",
          fecha: turno.fecha || "",
          hora_inicio: turno.hora_inicio || "",
          hora_fin: turno.hora_fin || "",
          tipo: turno.tipo || "regular",
          notas: turno.notas || ""
        });
      } else {
        resetForm();
      }
    }
  }, [open, turno]);

  const resetForm = () => {
    setFormData({
      empleado_id: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      tipo: "regular",
      notas: ""
    });
  };

  const fetchEmpleados = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data } = await supabase
        .from("empleados")
        .select("id, nombre, apellido")
        .eq("funeraria_id", empleado.funeraria_id)
        .eq("activo", true)
        .order("nombre");

      setEmpleados(data || []);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const checkConflict = async () => {
    try {
      const { data } = await supabase
        .from("turnos")
        .select("*")
        .eq("empleado_id", formData.empleado_id)
        .eq("fecha", formData.fecha);

      if (data && data.length > 0) {
        for (const existingTurno of data) {
          if (turno && existingTurno.id === turno.id) continue;
          
          const existingStart = existingTurno.hora_inicio;
          const existingEnd = existingTurno.hora_fin;
          const newStart = formData.hora_inicio;
          const newEnd = formData.hora_fin;

          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          ) {
            toast.error("Conflicto de horario detectado con otro turno");
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking conflict:", error);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasConflict = await checkConflict();
    if (!hasConflict) return;

    setLoading(true);

    try {
      const turnoData = {
        ...formData,
      };

      if (turno) {
        const { error } = await supabase
          .from("turnos")
          .update(turnoData)
          .eq("id", turno.id);

        if (error) throw error;
        toast.success("Turno actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("turnos")
          .insert([turnoData]);

        if (error) throw error;
        toast.success("Turno creado exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{turno ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="empleado_id">Empleado *</Label>
            <Select
              value={formData.empleado_id}
              onValueChange={(value) => setFormData({ ...formData, empleado_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empleado" />
              </SelectTrigger>
              <SelectContent>
                {empleados.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora_fin">Hora Fin *</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Turno</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="guardia">Guardia</SelectItem>
                <SelectItem value="nocturno">Nocturno</SelectItem>
                <SelectItem value="extra">Extra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas adicionales sobre el turno"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {turno ? "Actualizar" : "Crear"} Turno
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
