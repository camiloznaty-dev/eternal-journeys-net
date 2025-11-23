import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
    fallecido_nombre: "",
    fallecido_apellido: "",
    tipo_servicio: "",
    fecha_fallecimiento: "",
    fecha_velorio: "",
    fecha_funeral: "",
    tipo_lugar_velorio: "",
    direccion_velorio: "",
    contratante: "",
    contratante_telefono: "",
    contratante_email: "",
    familiar_a_cargo: "",
    familiar_telefono: "",
    vendedor_id: "",
    carroza_tipo: "",
    carroza_patente: "",
    vehiculo_acompanamiento: "",
    vehiculo_acompanamiento_patente: "",
    cantidad_arreglos_florales: "0",
    usa_cuota_mortuoria: false,
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
          fallecido_nombre: caso.fallecido_nombre || "",
          fallecido_apellido: caso.fallecido_apellido || "",
          tipo_servicio: caso.tipo_servicio || "",
          fecha_fallecimiento: caso.fecha_fallecimiento || "",
          fecha_velorio: caso.fecha_velorio?.split('T')[0] || "",
          fecha_funeral: caso.fecha_funeral?.split('T')[0] || "",
          tipo_lugar_velorio: caso.tipo_lugar_velorio || "",
          direccion_velorio: caso.direccion_velorio || "",
          contratante: caso.contratante || "",
          contratante_telefono: caso.contratante_telefono || "",
          contratante_email: caso.contratante_email || "",
          familiar_a_cargo: caso.familiar_a_cargo || "",
          familiar_telefono: caso.familiar_telefono || "",
          vendedor_id: caso.vendedor_id || "",
          carroza_tipo: caso.carroza_tipo || "",
          carroza_patente: caso.carroza_patente || "",
          vehiculo_acompanamiento: caso.vehiculo_acompanamiento || "",
          vehiculo_acompanamiento_patente: caso.vehiculo_acompanamiento_patente || "",
          cantidad_arreglos_florales: caso.cantidad_arreglos_florales?.toString() || "0",
          usa_cuota_mortuoria: caso.usa_cuota_mortuoria || false,
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
      fallecido_nombre: "",
      fallecido_apellido: "",
      tipo_servicio: "",
      fecha_fallecimiento: "",
      fecha_velorio: "",
      fecha_funeral: "",
      tipo_lugar_velorio: "",
      direccion_velorio: "",
      contratante: "",
      contratante_telefono: "",
      contratante_email: "",
      familiar_a_cargo: "",
      familiar_telefono: "",
      vendedor_id: "",
      carroza_tipo: "",
      carroza_patente: "",
      vehiculo_acompanamiento: "",
      vehiculo_acompanamiento_patente: "",
      cantidad_arreglos_florales: "0",
      usa_cuota_mortuoria: false,
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
        cantidad_arreglos_florales: formData.cantidad_arreglos_florales ? parseInt(formData.cantidad_arreglos_florales) : 0,
        responsable_id: formData.responsable_id || null,
        lead_id: formData.lead_id || null,
        vendedor_id: formData.vendedor_id || null,
        fecha_velorio: formData.fecha_velorio ? new Date(formData.fecha_velorio).toISOString() : null,
        fecha_funeral: formData.fecha_funeral ? new Date(formData.fecha_funeral).toISOString() : null,
        tipo_lugar_velorio: formData.tipo_lugar_velorio || null,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caso ? "Editar Caso" : "Nuevo Caso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Fallecido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Información del Fallecido</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fallecido_nombre">Nombre del Fallecido *</Label>
                <Input
                  id="fallecido_nombre"
                  value={formData.fallecido_nombre}
                  onChange={(e) => setFormData({ ...formData, fallecido_nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fallecido_apellido">Apellido del Fallecido *</Label>
                <Input
                  id="fallecido_apellido"
                  value={formData.fallecido_apellido}
                  onChange={(e) => setFormData({ ...formData, fallecido_apellido: e.target.value })}
                  required
                />
              </div>
            </div>
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
          </div>

          {/* Información del Contratante */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Información del Contratante</h3>
            <div>
              <Label htmlFor="contratante">Nombre del Contratante</Label>
              <Input
                id="contratante"
                value={formData.contratante}
                onChange={(e) => setFormData({ ...formData, contratante: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contratante_telefono">Teléfono</Label>
                <Input
                  id="contratante_telefono"
                  value={formData.contratante_telefono}
                  onChange={(e) => setFormData({ ...formData, contratante_telefono: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <Label htmlFor="contratante_email">Email</Label>
                <Input
                  id="contratante_email"
                  type="email"
                  value={formData.contratante_email}
                  onChange={(e) => setFormData({ ...formData, contratante_email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Familiar a Cargo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Familiar a Cargo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="familiar_a_cargo">Nombre del Familiar</Label>
                <Input
                  id="familiar_a_cargo"
                  value={formData.familiar_a_cargo}
                  onChange={(e) => setFormData({ ...formData, familiar_a_cargo: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="familiar_telefono">Teléfono</Label>
                <Input
                  id="familiar_telefono"
                  value={formData.familiar_telefono}
                  onChange={(e) => setFormData({ ...formData, familiar_telefono: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Servicio y Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Servicio y Fechas</h3>
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="fecha_funeral">Fecha Funeral</Label>
                <Input
                  id="fecha_funeral"
                  type="date"
                  value={formData.fecha_funeral}
                  onChange={(e) => setFormData({ ...formData, fecha_funeral: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Ubicación del Velorio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Ubicación del Velorio</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo_lugar_velorio">Tipo de Lugar</Label>
                <Select
                  value={formData.tipo_lugar_velorio}
                  onValueChange={(value) => setFormData({ ...formData, tipo_lugar_velorio: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="iglesia">Iglesia</SelectItem>
                    <SelectItem value="cementerio">Cementerio</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="direccion_velorio">Dirección</Label>
                <Input
                  id="direccion_velorio"
                  value={formData.direccion_velorio}
                  onChange={(e) => setFormData({ ...formData, direccion_velorio: e.target.value })}
                  placeholder="Dirección completa"
                />
              </div>
            </div>
          </div>

          {/* Planificación del Funeral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Planificación del Funeral</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carroza_tipo">Tipo de Carroza</Label>
                <Select
                  value={formData.carroza_tipo}
                  onValueChange={(value) => setFormData({ ...formData, carroza_tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presidencial">Presidencial</SelectItem>
                    <SelectItem value="panoramica">Panorámica</SelectItem>
                    <SelectItem value="estandar">Estándar</SelectItem>
                    <SelectItem value="clasica">Clásica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="carroza_patente">Patente Carroza</Label>
                <Input
                  id="carroza_patente"
                  value={formData.carroza_patente}
                  onChange={(e) => setFormData({ ...formData, carroza_patente: e.target.value })}
                  placeholder="AB-1234"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehiculo_acompanamiento">Vehículo de Acompañamiento</Label>
                <Input
                  id="vehiculo_acompanamiento"
                  value={formData.vehiculo_acompanamiento}
                  onChange={(e) => setFormData({ ...formData, vehiculo_acompanamiento: e.target.value })}
                  placeholder="Tipo de vehículo"
                />
              </div>
              <div>
                <Label htmlFor="vehiculo_acompanamiento_patente">Patente Vehículo</Label>
                <Input
                  id="vehiculo_acompanamiento_patente"
                  value={formData.vehiculo_acompanamiento_patente}
                  onChange={(e) => setFormData({ ...formData, vehiculo_acompanamiento_patente: e.target.value })}
                  placeholder="CD-5678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cantidad_arreglos_florales">Cantidad de Arreglos Florales</Label>
                <Input
                  id="cantidad_arreglos_florales"
                  type="number"
                  min="0"
                  value={formData.cantidad_arreglos_florales}
                  onChange={(e) => setFormData({ ...formData, cantidad_arreglos_florales: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usa_cuota_mortuoria"
                    checked={formData.usa_cuota_mortuoria}
                    onCheckedChange={(checked) => setFormData({ ...formData, usa_cuota_mortuoria: checked as boolean })}
                  />
                  <Label htmlFor="usa_cuota_mortuoria" className="cursor-pointer">
                    Usa Cuota Mortuoria
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Responsables y Estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Gestión Interna</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="responsable_id">Responsable</Label>
                <Select
                  value={formData.responsable_id}
                  onValueChange={(value) => setFormData({ ...formData, responsable_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
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
                <Label htmlFor="vendedor_id">Vendedor</Label>
                <Select
                  value={formData.vendedor_id}
                  onValueChange={(value) => setFormData({ ...formData, vendedor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
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
                    <SelectValue placeholder="Seleccionar" />
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
