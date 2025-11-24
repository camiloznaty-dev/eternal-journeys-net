import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { todasLasComunas } from "@/data/comunas";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const tiposSepultura = ["Perpetua", "Temporal", "Nicho", "Mausoleo", "Columbario"];

export default function PublicarSepultura() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    cementerio: "",
    comuna: "",
    tipo_sepultura: "",
    precio: "",
    vendedor_nombre: "",
    vendedor_telefono: "",
    vendedor_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("anuncios_sepulturas")
        .insert({
          ...formData,
          precio: parseFloat(formData.precio),
          user_id: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Anuncio publicado",
        description: "Tu anuncio ha sido publicado exitosamente.",
      });

      navigate("/vende-sepultura");
    } catch (error) {
      console.error("Error al publicar anuncio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo publicar el anuncio. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/vende-sepultura">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a anuncios
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Publicar Anuncio</CardTitle>
              <CardDescription>
                Completa la información de tu sepultura. Todos los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del anuncio */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información de la sepultura</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título del anuncio *</Label>
                    <Input
                      id="titulo"
                      required
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ej: Sepultura perpetua en excelente ubicación"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_sepultura">Tipo de sepultura *</Label>
                    <Select
                      required
                      value={formData.tipo_sepultura}
                      onValueChange={(value) => setFormData({ ...formData, tipo_sepultura: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposSepultura.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cementerio">Cementerio *</Label>
                    <Input
                      id="cementerio"
                      required
                      value={formData.cementerio}
                      onChange={(e) => setFormData({ ...formData, cementerio: e.target.value })}
                      placeholder="Nombre del cementerio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comuna">Comuna *</Label>
                    <Select
                      required
                      value={formData.comuna}
                      onValueChange={(value) => setFormData({ ...formData, comuna: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la comuna" />
                      </SelectTrigger>
                      <SelectContent>
                        {todasLasComunas.map(comuna => (
                          <SelectItem key={comuna} value={comuna}>{comuna}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (CLP) *</Label>
                    <Input
                      id="precio"
                      required
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Describe las características, ubicación exacta, documentación, etc."
                      rows={5}
                    />
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Información de contacto</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendedor_nombre">Nombre completo *</Label>
                    <Input
                      id="vendedor_nombre"
                      required
                      value={formData.vendedor_nombre}
                      onChange={(e) => setFormData({ ...formData, vendedor_nombre: e.target.value })}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendedor_telefono">Teléfono *</Label>
                    <Input
                      id="vendedor_telefono"
                      required
                      type="tel"
                      value={formData.vendedor_telefono}
                      onChange={(e) => setFormData({ ...formData, vendedor_telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendedor_email">Email</Label>
                    <Input
                      id="vendedor_email"
                      type="email"
                      value={formData.vendedor_email}
                      onChange={(e) => setFormData({ ...formData, vendedor_email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/vende-sepultura")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Publicando..." : "Publicar anuncio"}
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
}