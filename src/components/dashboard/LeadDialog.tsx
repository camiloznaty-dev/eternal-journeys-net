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
import { todasLasComunas } from "@/data/comunas";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any;
  onSuccess: () => void;
}

export function LeadDialog({ open, onOpenChange, lead, onSuccess }: LeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comuna: "",
    source: "",
    status: "nuevo",
    priority: "media",
    estimated_value: "",
    assigned_to: "",
    notes: "",
    next_followup_date: ""
  });

  useEffect(() => {
    if (open) {
      fetchEmpleados();
      if (lead) {
        setFormData({
          name: lead.name || "",
          phone: lead.phone || "",
          email: lead.email || "",
          comuna: lead.comuna || "",
          source: lead.source || "",
          status: lead.status || "nuevo",
          priority: lead.priority || "media",
          estimated_value: lead.estimated_value?.toString() || "",
          assigned_to: lead.assigned_to || "",
          notes: lead.notes || "",
          next_followup_date: lead.next_followup_date?.split('T')[0] || ""
        });
      } else {
        resetForm();
      }
    }
  }, [open, lead]);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      comuna: "",
      source: "",
      status: "nuevo",
      priority: "media",
      estimated_value: "",
      assigned_to: "",
      notes: "",
      next_followup_date: ""
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

      const leadData = {
        ...formData,
        funeraria_id: empleado.funeraria_id,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        assigned_to: formData.assigned_to || null,
        next_followup_date: formData.next_followup_date ? new Date(formData.next_followup_date).toISOString() : null,
        last_contact_date: new Date().toISOString()
      };

      if (lead) {
        const { error } = await supabase
          .from("leads")
          .update(leadData)
          .eq("id", lead.id);

        if (error) throw error;
        toast.success("Lead actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("leads")
          .insert([leadData]);

        if (error) throw error;
        toast.success("Lead creado exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Nuevo Lead"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+56912345678"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comuna">Comuna</Label>
            <Select
              value={formData.comuna}
              onValueChange={(value) => setFormData({ ...formData, comuna: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar comuna" />
              </SelectTrigger>
              <SelectContent>
                {todasLasComunas.map((comuna) => (
                  <SelectItem key={comuna} value={comuna}>
                    {comuna}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Fuente</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Sitio Web</SelectItem>
                  <SelectItem value="llamada">Llamada</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="referido">Referido</SelectItem>
                  <SelectItem value="redes_sociales">Redes Sociales</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
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
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="contactado">Contactado</SelectItem>
                  <SelectItem value="cotizado">Cotizado</SelectItem>
                  <SelectItem value="negociacion">Negociación</SelectItem>
                  <SelectItem value="ganado">Ganado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimated_value">Valor Estimado (CLP)</Label>
              <Input
                id="estimated_value"
                type="number"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assigned_to">Asignado a</Label>
              <Select
                value={formData.assigned_to}
                onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin asignar" />
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
              <Label htmlFor="next_followup_date">Próximo Seguimiento</Label>
              <Input
                id="next_followup_date"
                type="date"
                value={formData.next_followup_date}
                onChange={(e) => setFormData({ ...formData, next_followup_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas sobre el lead"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lead ? "Actualizar" : "Crear"} Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
