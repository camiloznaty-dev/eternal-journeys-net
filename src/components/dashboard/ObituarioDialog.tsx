import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ObituarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obituario?: any;
  onSuccess: () => void;
}

export function ObituarioDialog({ open, onOpenChange, obituario, onSuccess }: ObituarioDialogProps) {
  const [loading, setLoading] = useState(false);
  const [casos, setCasos] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    death_date: "",
    biography: "",
    photo_url: "",
    caso_id: "",
    is_premium: false
  });

  useEffect(() => {
    if (open) {
      fetchCasos();
      if (obituario) {
        setFormData({
          name: obituario.name || "",
          birth_date: obituario.birth_date || "",
          death_date: obituario.death_date || "",
          biography: obituario.biography || "",
          photo_url: obituario.photo_url || "",
          caso_id: obituario.caso_id || "",
          is_premium: obituario.is_premium || false
        });
      } else {
        resetForm();
      }
    }
  }, [open, obituario]);

  const resetForm = () => {
    setFormData({
      name: "",
      birth_date: "",
      death_date: "",
      biography: "",
      photo_url: "",
      caso_id: "",
      is_premium: false
    });
  };

  const fetchCasos = async () => {
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
        .from("casos_servicios")
        .select("id, difunto_nombre, difunto_apellido")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      setCasos(data || []);
    } catch (error) {
      console.error("Error fetching casos:", error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `obituarios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('funeraria-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('funeraria-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, photo_url: publicUrl });
      toast.success("Foto cargada exitosamente");
    } catch (error: any) {
      toast.error("Error al cargar la foto");
    } finally {
      setUploadingPhoto(false);
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

      const obituarioData = {
        ...formData,
        funeraria_id: empleado.funeraria_id,
        caso_id: formData.caso_id || null
      };

      if (obituario) {
        const { error } = await supabase
          .from("obituarios")
          .update(obituarioData)
          .eq("id", obituario.id);

        if (error) throw error;
        toast.success("Obituario actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("obituarios")
          .insert([obituarioData]);

        if (error) throw error;
        toast.success("Obituario creado exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el obituario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{obituario ? "Editar Obituario" : "Nuevo Obituario"}</DialogTitle>
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
              <Label htmlFor="birth_date">Fecha de Nacimiento *</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="death_date">Fecha de Fallecimiento *</Label>
              <Input
                id="death_date"
                type="date"
                value={formData.death_date}
                onChange={(e) => setFormData({ ...formData, death_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="photo">Fotografía</Label>
            <div className="flex items-center gap-4">
              {formData.photo_url && (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Cargando foto...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="biography">Biografía</Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              placeholder="Escribe la biografía del difunto"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="caso_id">Caso Relacionado</Label>
            <Select
              value={formData.caso_id}
              onValueChange={(value) => setFormData({ ...formData, caso_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar caso" />
              </SelectTrigger>
              <SelectContent>
                {casos.map((caso) => (
                  <SelectItem key={caso.id} value={caso.id}>
                    {caso.difunto_nombre} {caso.difunto_apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_premium"
              checked={formData.is_premium}
              onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
            />
            <Label htmlFor="is_premium">Obituario Premium (destacado)</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {obituario ? "Actualizar" : "Crear"} Obituario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
