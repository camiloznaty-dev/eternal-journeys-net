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

interface CasoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caso?: any;
  onSuccess: () => void;
}

export function CasoDialog({ open, onOpenChange, caso, onSuccess }: CasoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    difunto_nombre: "",
    difunto_apellido: "",
    tipo_servicio: "",
    fecha_fallecimiento: "",
    fecha_velorio: "",
    fecha_ceremonia: "",
    ubicacion_velorio: "",
    responsable_id: "",
    lead_id: "",
    monto_total: "",
    notas: "",
    status: "planificacion"
  });

  useEffect(() => {
    if (open) {
      fetchEmpleados();
      fetchLeads();
      if (caso) {
        setFormData({
          difunto_nombre: caso.difunto_nombre || "",
          difunto_apellido: caso.difunto_apellido || "",
          tipo_servicio: caso.tipo_servicio || "",
          fecha_fallecimiento: caso.fecha_fallecimiento || "",
          fecha_velorio: caso.fecha_velorio?.split('T')[0] || "",
          fecha_ceremonia: caso.fecha_ceremonia?.split('T')[0] || "",
          ubicacion_velorio: caso.ubicacion_velorio || "",
          responsable_id: caso.responsable_id || "",
          lead_id: caso.lead_id || "",
          monto_total: caso.monto_total?.toString() || "",
          notas: caso.notas || "",
          status: caso.status || "planificacion"
        });
      } else {
        resetForm();
      }
    }
  }, [open, caso]);

  const resetForm = () => {
    setFormData({
      difunto_nombre: "",
      difunto_apellido: "",
      tipo_servicio: "",
      fecha_fallecimiento: "",
      fecha_velorio: "",
      fecha_ceremonia: "",
      ubicacion_velorio: "",
      responsable_id: "",
      lead_id: "",
      monto_total: "",
      notas: "",
      status: "planificacion"
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

  const fetchLeads = async () => {
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
        .from("leads")
        .select("id, name")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) throw new Error("No empleado found");

      const casoData = {
        ...formData,
        funeraria_id: empleado.funeraria_id,
        monto_total: formData.monto_total ? parseFloat(formData.monto_total) : null,
        responsable_id: formData.responsable_id || null,
        lead_id: formData.lead_id || null,
        fecha_velorio: formData.fecha_velorio ? new Date(formData.fecha_velorio).toISOString() : null,
        fecha_ceremonia: formData.fecha_ceremonia ? new Date(formData.fecha_ceremonia).toISOString() : null,
      };

      if (caso) {
        const { error } = await supabase
          .from("casos_servicios")
          .update(casoData)
          .eq("id", caso.id);

        if (error) throw error;
        toast.success("Caso actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("casos_servicios")
          .insert([casoData]);

        if (error) throw error;
        toast.success("Caso creado exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el caso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caso ? "Editar Caso" : "Nuevo Caso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difunto_nombre">Nombre del Difunto *</Label>
              <Input
                id="difunto_nombre"
                value={formData.difunto_nombre}
                onChange={(e) => setFormData({ ...formData, difunto_nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="difunto_apellido">Apellido del Difunto *</Label>
              <Input
                id="difunto_apellido"
                value={formData.difunto_apellido}
                onChange={(e) => setFormData({ ...formData, difunto_apellido: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tipo_servicio">Tipo de Servicio *</Label>
            <Select
              value={formData.tipo_servicio}
              onValueChange={(value) => setFormData({ ...formData, tipo_servicio: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="estandar">Estándar</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="cremacion">Cremación</SelectItem>
                <SelectItem value="velorio_simple">Velorio Simple</SelectItem>
                <SelectItem value="servicio_completo">Servicio Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_fallecimiento">Fecha Fallecimiento *</Label>
              <Input
                id="fecha_fallecimiento"
                type="date"
                value={formData.fecha_fallecimiento}
                onChange={(e) => setFormData({ ...formData, fecha_fallecimiento: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha_velorio">Fecha Velorio</Label>
              <Input
                id="fecha_velorio"
                type="date"
                value={formData.fecha_velorio}
                onChange={(e) => setFormData({ ...formData, fecha_velorio: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fecha_ceremonia">Fecha Ceremonia</Label>
              <Input
                id="fecha_ceremonia"
                type="date"
                value={formData.fecha_ceremonia}
                onChange={(e) => setFormData({ ...formData, fecha_ceremonia: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ubicacion_velorio">Ubicación Velorio</Label>
            <Input
              id="ubicacion_velorio"
              value={formData.ubicacion_velorio}
              onChange={(e) => setFormData({ ...formData, ubicacion_velorio: e.target.value })}
              placeholder="Dirección del velorio"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsable_id">Responsable</Label>
              <Select
                value={formData.responsable_id}
                onValueChange={(value) => setFormData({ ...formData, responsable_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar responsable" />
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
              <Label htmlFor="lead_id">Lead Relacionado</Label>
              <Select
                value={formData.lead_id}
                onValueChange={(value) => setFormData({ ...formData, lead_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificacion">Planificación</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="monto_total">Monto Total (CLP)</Label>
              <Input
                id="monto_total"
                type="number"
                value={formData.monto_total}
                onChange={(e) => setFormData({ ...formData, monto_total: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas adicionales sobre el caso"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {caso ? "Actualizar" : "Crear"} Caso
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
