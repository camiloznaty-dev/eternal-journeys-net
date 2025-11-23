import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProveedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor?: any | null;
  onSuccess: () => void;
}

export function ProveedorDialog({ open, onOpenChange, proveedor, onSuccess }: ProveedorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [contactoNombre, setContactoNombre] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [direccion, setDireccion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre || "");
      setRut(proveedor.rut || "");
      setContactoNombre(proveedor.contacto_nombre || "");
      setEmail(proveedor.email || "");
      setPhone(proveedor.phone || "");
      setDireccion(proveedor.direccion || "");
      setCategoria(proveedor.categoria || "");
      setActivo(proveedor.activo !== false);
    } else {
      resetForm();
    }
  }, [proveedor, open]);

  const resetForm = () => {
    setNombre("");
    setRut("");
    setContactoNombre("");
    setEmail("");
    setPhone("");
    setDireccion("");
    setCategoria("");
    setActivo(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre) {
      toast.error("El nombre es requerido");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) throw new Error("No funeraria found");

      const proveedorData = {
        nombre,
        rut: rut || null,
        contacto_nombre: contactoNombre || null,
        email: email || null,
        phone: phone || null,
        direccion: direccion || null,
        categoria: categoria || null,
        activo,
        funeraria_id: empleado.funeraria_id,
      };

      if (proveedor) {
        const { error } = await supabase
          .from("proveedores")
          .update(proveedorData)
          .eq("id", proveedor.id);

        if (error) throw error;
        toast.success("Proveedor actualizado");
      } else {
        const { error } = await supabase
          .from("proveedores")
          .insert([proveedorData]);

        if (error) throw error;
        toast.success("Proveedor creado");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar proveedor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            Gestiona la información de tus proveedores
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
                    placeholder="Empresa S.A."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Input
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ataúdes, Flores, Transporte..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactoNombre">Nombre de Contacto</Label>
                <Input
                  id="contactoNombre"
                  value={contactoNombre}
                  onChange={(e) => setContactoNombre(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
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

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Av. Principal 123, Santiago"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={activo}
                  onCheckedChange={setActivo}
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Proveedor activo
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
                {loading ? "Guardando..." : proveedor ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
