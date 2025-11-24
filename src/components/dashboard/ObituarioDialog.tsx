import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, ArrowLeft } from "lucide-react";

interface ObituarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obituario?: any;
  onSuccess: () => void;
}

export function ObituarioDialog({ open, onOpenChange, obituario, onSuccess }: ObituarioDialogProps) {
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    birth_year: "",
    death_date: "",
    biography: "",
    lugar_velacion: "",
    direccion_velacion: "",
    fecha_velacion: "",
    fecha_funeral: "",
    cementerio: "",
    notas_adicionales: "",
    color_fondo: "verde",
    publicar_inmediatamente: true,
  });

  useEffect(() => {
    if (open) {
      if (obituario) {
        const birthYear = obituario.birth_date ? new Date(obituario.birth_date).getFullYear().toString() : "";
        setFormData({
          name: obituario.name || "",
          birth_year: birthYear,
          death_date: obituario.death_date || "",
          biography: obituario.biography || "",
          lugar_velacion: "",
          direccion_velacion: "",
          fecha_velacion: "",
          fecha_funeral: "",
          cementerio: "",
          notas_adicionales: "",
          color_fondo: "verde",
          publicar_inmediatamente: obituario.is_premium || false,
        });
        setPhotoPreview(obituario.photo_url || null);
      } else {
        resetForm();
      }
    }
  }, [open, obituario]);

  const resetForm = () => {
    setFormData({
      name: "",
      birth_year: "",
      death_date: "",
      biography: "",
      lugar_velacion: "",
      direccion_velacion: "",
      fecha_velacion: "",
      fecha_funeral: "",
      cementerio: "",
      notas_adicionales: "",
      color_fondo: "verde",
      publicar_inmediatamente: true,
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }
      
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No hay sesión");

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .eq("activo", true)
        .single();

      if (!empleado) throw new Error("No se encontró la funeraria");

      let photoUrl = obituario?.photo_url || null;

      // Subir foto si hay una nueva
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('obituarios')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('obituarios')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      // Construir biografía completa
      let biografiaCompleta = formData.biography || '';
      
      if (formData.lugar_velacion || formData.direccion_velacion || formData.fecha_velacion || 
          formData.fecha_funeral || formData.cementerio || formData.notas_adicionales) {
        biografiaCompleta += '\n\n';
        
        if (formData.lugar_velacion) {
          biografiaCompleta += `Velación: ${formData.lugar_velacion}`;
          if (formData.direccion_velacion) {
            biografiaCompleta += `, ${formData.direccion_velacion}`;
          }
          if (formData.fecha_velacion) {
            const fechaVel = new Date(formData.fecha_velacion);
            biografiaCompleta += `. ${fechaVel.toLocaleString('es-CL')}`;
          }
          biografiaCompleta += '\n';
        }
        
        if (formData.cementerio) {
          biografiaCompleta += `Cementerio: ${formData.cementerio}`;
          if (formData.fecha_funeral) {
            const fechaFun = new Date(formData.fecha_funeral);
            biografiaCompleta += `. ${fechaFun.toLocaleString('es-CL')}`;
          }
          biografiaCompleta += '\n';
        }
        
        if (formData.notas_adicionales) {
          biografiaCompleta += `\n${formData.notas_adicionales}`;
        }
      }

      const birthDate = `${formData.birth_year}-01-01`;

      const obituarioData = {
        funeraria_id: empleado.funeraria_id,
        name: formData.name,
        birth_date: birthDate,
        death_date: formData.death_date,
        biography: biografiaCompleta,
        photo_url: photoUrl,
        is_premium: formData.publicar_inmediatamente,
      };

      if (obituario) {
        const { error } = await supabase
          .from("obituarios")
          .update(obituarioData)
          .eq("id", obituario.id);

        if (error) throw error;
        toast.success("Obituario actualizado");
      } else {
        const { error } = await supabase
          .from("obituarios")
          .insert([obituarioData]);

        if (error) throw error;
        toast.success("Obituario creado");
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al guardar el obituario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <DialogTitle>{obituario ? "Editar Obituario" : "Nuevo Obituario"}</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                placeholder="Nombre completo del fallecido"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth_year">Año de nacimiento *</Label>
                <Input
                  id="birth_year"
                  type="number"
                  placeholder="1950"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.birth_year}
                  onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="death_date">Fecha de fallecimiento *</Label>
                <Input
                  id="death_date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.death_date}
                  onChange={(e) => setFormData({ ...formData, death_date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Foto */}
            <div className="space-y-2">
              <Label>Foto del fallecido</Label>
              <div className="flex items-start gap-4">
                {photoPreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                      Seleccionar archivo
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Ningún archivo seleccionado<br />
                  Formatos: JPG, PNG, WEBP. Máximo 5MB
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="biography">Biografía</Label>
              <Textarea
                id="biography"
                placeholder="Escribe una breve biografía..."
                rows={4}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              />
            </div>
          </div>

          {/* Información del Funeral */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Información del Funeral</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lugar_velacion">Lugar de velación</Label>
                <Input
                  id="lugar_velacion"
                  placeholder="Nombre del lugar"
                  value={formData.lugar_velacion}
                  onChange={(e) => setFormData({ ...formData, lugar_velacion: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="direccion_velacion">Dirección de velación</Label>
                <Input
                  id="direccion_velacion"
                  placeholder="Dirección completa"
                  value={formData.direccion_velacion}
                  onChange={(e) => setFormData({ ...formData, direccion_velacion: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha_velacion">Fecha y hora de velación</Label>
                <Input
                  id="fecha_velacion"
                  type="datetime-local"
                  value={formData.fecha_velacion}
                  onChange={(e) => setFormData({ ...formData, fecha_velacion: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fecha_funeral">Fecha y hora del funeral</Label>
                <Input
                  id="fecha_funeral"
                  type="datetime-local"
                  value={formData.fecha_funeral}
                  onChange={(e) => setFormData({ ...formData, fecha_funeral: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cementerio">Cementerio</Label>
              <Input
                id="cementerio"
                placeholder="Nombre del cementerio"
                value={formData.cementerio}
                onChange={(e) => setFormData({ ...formData, cementerio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notas_adicionales">Notas adicionales</Label>
              <Textarea
                id="notas_adicionales"
                placeholder="Ej: El cortejo saldrá del hospital a las 15:00"
                rows={2}
                value={formData.notas_adicionales}
                onChange={(e) => setFormData({ ...formData, notas_adicionales: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Información adicional como detalles del cortejo, ubicación de salida, etc.
              </p>
            </div>
          </div>

          {/* Estilo del obituario */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Estilo del obituario</h3>
            
            <div>
              <Label>Color de fondo</Label>
              <RadioGroup
                value={formData.color_fondo}
                onValueChange={(value) => setFormData({ ...formData, color_fondo: value })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="verde" id="verde" />
                  <Label htmlFor="verde" className="cursor-pointer">Verde (Hombre)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rosado" id="rosado" />
                  <Label htmlFor="rosado" className="cursor-pointer">Rosado (Mujer)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="publicar"
                checked={formData.publicar_inmediatamente}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, publicar_inmediatamente: checked as boolean })
                }
              />
              <Label htmlFor="publicar" className="cursor-pointer">
                Publicar inmediatamente
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/90"
            >
              {loading ? "Guardando..." : obituario ? "Actualizar" : "Crear obituario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
