import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Share2, Copy, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ObituarioDetalle() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { data: obituario, isLoading } = useQuery({
    queryKey: ["obituario", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obituarios")
        .select("*, funerarias(name, phone)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      // Incrementar vistas
      await supabase
        .from("obituarios")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);
      
      return data;
    },
  });

  const { data: condolencias } = useQuery({
    queryKey: ["condolencias", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("condolencias")
        .select("*")
        .eq("obituario_id", id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const enviarCondolencia = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("condolencias")
        .insert({
          obituario_id: id,
          author_name: nombre.trim(),
          message: mensaje.trim(),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Condolencia enviada",
        description: "Tu mensaje ha sido publicado exitosamente",
      });
      setNombre("");
      setEmail("");
      setMensaje("");
      queryClient.invalidateQueries({ queryKey: ["condolencias", id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar la condolencia",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa tu nombre y mensaje",
        variant: "destructive",
      });
      return;
    }
    enviarCondolencia.mutate();
  };

  const copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Enlace copiado",
      description: "El enlace ha sido copiado al portapapeles",
    });
  };

  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: obituario?.name,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error al compartir:", err);
      }
    } else {
      copiarEnlace();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!obituario) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Obituario no encontrado</h1>
            <Link to="/obituarios">
              <Button>Volver a obituarios</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const birthDate = new Date(obituario.birth_date);
  const deathDate = new Date(obituario.death_date);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header con botones */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link to="/obituarios">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a obituarios
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copiarEnlace}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar enlace
              </Button>
              <Button variant="outline" size="sm" onClick={compartir}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[300px,1fr] gap-6 p-6">
                {/* Foto */}
                {obituario.photo_url && (
                  <div className="h-80 overflow-hidden rounded-lg">
                    <img
                      src={obituario.photo_url}
                      alt={obituario.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                      {obituario.name}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {format(birthDate, "d 'de' MMMM 'de' yyyy", { locale: es })} - {format(deathDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {obituario.biography}
                  </p>

                  {/* Información del Funeral */}
                  <div className="pt-6 border-t">
                    <h2 className="text-2xl font-bold mb-4">Información del Funeral</h2>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-accent shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold">Velación</p>
                          <p className="text-sm text-muted-foreground">
                            {obituario.funerarias?.name}
                          </p>
                        </div>
                      </div>
                      
                      {obituario.funerarias?.phone && (
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-accent shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold">Contacto</p>
                            <p className="text-sm text-muted-foreground">
                              {obituario.funerarias.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      Por favor contactar a la funeraria para confirmar horarios y detalles de la ceremonia
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condolencias */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Condolencias</h2>
              
              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-8 pb-8 border-b">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tu nombre <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tu email (opcional)
                    </label>
                    <Input
                      type="email"
                      placeholder="email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tu mensaje <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Escribe tu mensaje de condolencia..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={enviarCondolencia.isPending}
                  className="bg-accent hover:bg-accent/90"
                >
                  {enviarCondolencia.isPending ? "Enviando..." : "Enviar condolencia"}
                </Button>
              </form>

              {/* Lista de condolencias */}
              <div className="space-y-6">
                {condolencias?.map((condolencia) => (
                  <div key={condolencia.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold">{condolencia.author_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(condolencia.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {condolencia.message}
                    </p>
                  </div>
                ))}

                {condolencias?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aún no hay condolencias. Sé el primero en dejar un mensaje.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
