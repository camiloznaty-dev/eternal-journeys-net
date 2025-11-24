import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, BookOpen, Camera, Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MemorialDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: memorial, isLoading } = useQuery({
    queryKey: ["memorial", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memoriales")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: entradas } = useQuery({
    queryKey: ["entradas", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entradas_memorial")
        .select("*")
        .eq("memorial_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p>Memorial no encontrado</p>
          <Button onClick={() => navigate("/asistencia")} className="mt-4">
            Volver
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/asistencia")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">
                    {memorial.nombre_ser_querido}
                  </CardTitle>
                  {memorial.relacion && (
                    <p className="text-muted-foreground capitalize">
                      Tu {memorial.relacion}
                    </p>
                  )}
                  {memorial.fecha_nacimiento && memorial.fecha_fallecimiento && (
                    <p className="text-muted-foreground mt-2">
                      {format(new Date(memorial.fecha_nacimiento), "d 'de' MMMM, yyyy", { locale: es })} - {format(new Date(memorial.fecha_fallecimiento), "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  )}
                </div>
                {memorial.foto_principal && (
                  <img
                    src={memorial.foto_principal}
                    alt={memorial.nombre_ser_querido}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                )}
              </div>
            </CardHeader>
            {memorial.descripcion && (
              <CardContent>
                <p className="text-muted-foreground">{memorial.descripcion}</p>
              </CardContent>
            )}
          </Card>

          <div className="flex gap-4 mb-8">
            <Button onClick={() => navigate(`/asistencia/diario/${id}`)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Abrir Diario de Duelo
            </Button>
          </div>

          <Tabs defaultValue="cartas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cartas">
                <Mail className="mr-2 h-4 w-4" />
                Cartas
              </TabsTrigger>
              <TabsTrigger value="recuerdos">
                <Heart className="mr-2 h-4 w-4" />
                Recuerdos
              </TabsTrigger>
              <TabsTrigger value="fotos">
                <Camera className="mr-2 h-4 w-4" />
                Fotos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cartas" className="mt-6">
              {entradas?.filter(e => e.tipo === "carta").length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Aún no has escrito ninguna carta
                    </p>
                    <Button>Escribir Primera Carta</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {entradas?.filter(e => e.tipo === "carta").map((entrada) => (
                    <Card key={entrada.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{entrada.autor_nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entrada.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{entrada.contenido}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recuerdos" className="mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Próximamente: Comparte recuerdos especiales
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fotos" className="mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Próximamente: Galería de fotos
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemorialDetalle;
