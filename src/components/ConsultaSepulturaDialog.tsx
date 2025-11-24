import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

interface ConsultaSepulturaDialogProps {
  anuncioId: string;
}

export const ConsultaSepulturaDialog = ({ anuncioId }: ConsultaSepulturaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("consultas_sepulturas")
        .insert({
          anuncio_id: anuncioId,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Consulta enviada",
        description: "El vendedor recibirá tu consulta y se pondrá en contacto contigo pronto.",
      });

      setOpen(false);
      setFormData({ nombre: "", telefono: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar consulta:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la consulta. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Consultar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Consultar por esta sepultura</DialogTitle>
            <DialogDescription className="text-sm">
              Completa el formulario y el vendedor se pondrá en contacto contigo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="nombre" className="text-sm">Nombre completo *</Label>
              <Input
                id="nombre"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Juan Pérez"
                className="h-9 sm:h-10"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="telefono" className="text-sm">Teléfono *</Label>
              <Input
                id="telefono"
                required
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56 9 1234 5678"
                className="h-9 sm:h-10"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@ejemplo.com"
                className="h-9 sm:h-10"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="mensaje" className="text-sm">Mensaje</Label>
              <Textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                placeholder="Hola, estoy interesado en esta sepultura..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} size="sm" className="flex-1 sm:flex-none">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} size="sm" className="flex-1 sm:flex-none">
              {loading ? "Enviando..." : "Enviar consulta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};