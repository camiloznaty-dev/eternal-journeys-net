import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";

const CrearMemorial = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre_ser_querido: "",
    fecha_nacimiento: "",
    fecha_fallecimiento: "",
    relacion: "",
    descripcion: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión para crear un memorial");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("memoriales")
        .insert({
          ...formData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Memorial creado exitosamente");
      navigate(`/asistencia/memorial/${data.id}`);
    } catch (error: any) {
      console.error("Error creating memorial:", error);
      toast.error("Error al crear el memorial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/asistencia")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Crear Memorial
              </CardTitle>
              <CardDescription>
                Comienza creando un espacio para honrar la memoria de tu ser querido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nombre">Nombre completo *</Label>
                  <Input
                    id="nombre"
                    required
                    value={formData.nombre_ser_querido}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre_ser_querido: e.target.value })
                    }
                    placeholder="Ej: María Elena González"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nacimiento">Fecha de nacimiento</Label>
                    <Input
                      id="nacimiento"
                      type="date"
                      value={formData.fecha_nacimiento}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha_nacimiento: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="fallecimiento">Fecha de fallecimiento</Label>
                    <Input
                      id="fallecimiento"
                      type="date"
                      value={formData.fecha_fallecimiento}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha_fallecimiento: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="relacion">Relación</Label>
                  <Select
                    value={formData.relacion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, relacion: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu relación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madre">Madre</SelectItem>
                      <SelectItem value="padre">Padre</SelectItem>
                      <SelectItem value="hermano">Hermano/a</SelectItem>
                      <SelectItem value="hijo">Hijo/a</SelectItem>
                      <SelectItem value="esposo">Esposo/a</SelectItem>
                      <SelectItem value="abuelo">Abuelo/a</SelectItem>
                      <SelectItem value="amigo">Amigo/a</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción (opcional)</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Escribe algunas palabras sobre tu ser querido..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/asistencia")}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Creando..." : "Crear Memorial"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CrearMemorial;
