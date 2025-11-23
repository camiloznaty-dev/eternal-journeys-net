import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmpleadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado?: any | null;
  onSuccess: () => void;
}

const roleLabels: Record<string, string> = {
  director: "Director",
  coordinador: "Coordinador",
  asesor: "Asesor",
  conductor: "Conductor",
  administrador: "Administrador",
  otro: "Otro",
};

export function EmpleadoDialog({ open, onOpenChange, empleado, onSuccess }: EmpleadoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("asesor");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (empleado) {
      setNombre(empleado.nombre || "");
      setApellido(empleado.apellido || "");
      setEmail(empleado.email || "");
      setPhone(empleado.phone || "");
      setRole(empleado.role || "asesor");
      setFechaIngreso(empleado.fecha_ingreso || "");
      setActivo(empleado.activo !== false);
    } else {
      resetForm();
    }
  }, [empleado, open]);

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPhone("");
    setRole("asesor");
    setFechaIngreso(new Date().toISOString().split('T')[0]);
    setActivo(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido) {
      toast.error("Nombre y apellido son requeridos");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: empleadoActual } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleadoActual) throw new Error("No funeraria found");

      const empleadoData = {
        nombre,
        apellido,
        email: email || null,
        phone: phone || null,
        role,
        fecha_ingreso: fechaIngreso || null,
        activo,
        funeraria_id: empleadoActual.funeraria_id,
      };

      if (empleado) {
        const { error } = await supabase
          .from("empleados")
          .update(empleadoData)
          .eq("id", empleado.id);

        if (error) throw error;
        toast.success("Empleado actualizado");
      } else {
        const { error } = await supabase
          .from("empleados")
          .insert([empleadoData]);

        if (error) throw error;
        toast.success("Empleado creado");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar empleado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{empleado ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
          <DialogDescription>
            Gestiona la información de tu equipo de trabajo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">
                    Apellido <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@funeraria.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56912345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Rol <span className="text-destructive">*</span>
                  </Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                  <Input
                    id="fechaIngreso"
                    type="date"
                    value={fechaIngreso}
                    onChange={(e) => setFechaIngreso(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={activo}
                  onCheckedChange={setActivo}
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Empleado activo
                </Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : empleado ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
