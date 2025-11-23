import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Bell, Edit, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface RecordatoriosTabProps {
  proveedorId: string;
}

export function RecordatoriosTab({ proveedorId }: RecordatoriosTabProps) {
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRecordatorio, setEditingRecordatorio] = useState<any>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaRecordatorio, setFechaRecordatorio] = useState("");
  const [horaRecordatorio, setHoraRecordatorio] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [tipo, setTipo] = useState("seguimiento");

  useEffect(() => {
    fetchRecordatorios();
  }, [proveedorId]);

  useEffect(() => {
    if (editingRecordatorio) {
      setTitulo(editingRecordatorio.titulo);
      setDescripcion(editingRecordatorio.descripcion || "");
      const fecha = new Date(editingRecordatorio.fecha_recordatorio);
      setFechaRecordatorio(fecha.toISOString().split('T')[0]);
      setHoraRecordatorio(fecha.toTimeString().slice(0, 5));
      setPrioridad(editingRecordatorio.prioridad);
      setTipo(editingRecordatorio.tipo || "seguimiento");
    } else {
      resetForm();
    }
  }, [editingRecordatorio]);

  const fetchRecordatorios = async () => {
    try {
      const { data, error } = await supabase
        .from("proveedor_recordatorios")
        .select("*")
        .eq("proveedor_id", proveedorId)
        .order("fecha_recordatorio", { ascending: true });

      if (error) throw error;
      setRecordatorios(data || []);
    } catch (error: any) {
      toast.error("Error al cargar recordatorios");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!titulo || !fechaRecordatorio || !horaRecordatorio) {
      toast.error("Completa los campos requeridos");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const fechaHora = `${fechaRecordatorio}T${horaRecordatorio}:00`;

      const recordatorioData = {
        proveedor_id: proveedorId,
        titulo,
        descripcion: descripcion || null,
        fecha_recordatorio: fechaHora,
        prioridad,
        tipo,
        creado_por: session.user.id,
      };

      if (editingRecordatorio) {
        const { error } = await supabase
          .from("proveedor_recordatorios")
          .update(recordatorioData)
          .eq("id", editingRecordatorio.id);

        if (error) throw error;
        toast.success("Recordatorio actualizado");
      } else {
        const { error } = await supabase
          .from("proveedor_recordatorios")
          .insert([recordatorioData]);

        if (error) throw error;
        toast.success("Recordatorio creado");
      }

      setDialogOpen(false);
      setEditingRecordatorio(null);
      fetchRecordatorios();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar recordatorio");
    } finally {
      setSaving(false);
    }
  };

  const toggleCompletado = async (recordatorio: any) => {
    try {
      const { error } = await supabase
        .from("proveedor_recordatorios")
        .update({ completado: !recordatorio.completado })
        .eq("id", recordatorio.id);

      if (error) throw error;
      toast.success(recordatorio.completado ? "Marcado como pendiente" : "Marcado como completado");
      fetchRecordatorios();
    } catch (error: any) {
      toast.error("Error al actualizar recordatorio");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este recordatorio?")) return;

    try {
      const { error } = await supabase
        .from("proveedor_recordatorios")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Recordatorio eliminado");
      fetchRecordatorios();
    } catch (error: any) {
      toast.error("Error al eliminar recordatorio");
    }
  };

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    const now = new Date();
    setFechaRecordatorio(now.toISOString().split('T')[0]);
    setHoraRecordatorio(now.toTimeString().slice(0, 5));
    setPrioridad("media");
    setTipo("seguimiento");
  };

  const getPrioridadBadge = (prioridad: string) => {
    const badges: any = {
      baja: { label: "Baja", variant: "secondary" },
      media: { label: "Media", variant: "default" },
      alta: { label: "Alta", variant: "destructive" },
    };
    return badges[prioridad] || badges.media;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Recordatorios y Alertas</h3>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Recordatorio
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : recordatorios.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay recordatorios</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Recordatorio
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recordatorios.map((recordatorio) => (
              <div
                key={recordatorio.id}
                className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition ${
                  recordatorio.completado ? "opacity-50" : ""
                }`}
              >
                <Checkbox
                  checked={recordatorio.completado}
                  onCheckedChange={() => toggleCompletado(recordatorio)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className={`font-medium ${recordatorio.completado ? "line-through" : ""}`}>
                      {recordatorio.titulo}
                    </p>
                    <Badge {...getPrioridadBadge(recordatorio.prioridad)}>
                      {getPrioridadBadge(recordatorio.prioridad).label}
                    </Badge>
                    {recordatorio.tipo && (
                      <Badge variant="outline">{recordatorio.tipo}</Badge>
                    )}
                  </div>
                  {recordatorio.descripcion && (
                    <p className="text-sm text-muted-foreground mb-1">{recordatorio.descripcion}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(recordatorio.fecha_recordatorio), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRecordatorio(recordatorio);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(recordatorio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingRecordatorio(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRecordatorio ? "Editar Recordatorio" : "Nuevo Recordatorio"}</DialogTitle>
              <DialogDescription>
                Programa un recordatorio o alerta para el proveedor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Llamar para seguimiento..."
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles adicionales..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha *</Label>
                  <Input
                    type="date"
                    value={fechaRecordatorio}
                    onChange={(e) => setFechaRecordatorio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hora *</Label>
                  <Input
                    type="time"
                    value={horaRecordatorio}
                    onChange={(e) => setHoraRecordatorio(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={prioridad} onValueChange={setPrioridad}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="seguimiento">Seguimiento</SelectItem>
                      <SelectItem value="renovacion">Renovación</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingRecordatorio(null);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Guardando..." : editingRecordatorio ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
