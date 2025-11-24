import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Plus, Calendar, HeartHandshake } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-asistencia.jpg";

const Asistencia = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const { data: memoriales, isLoading } = useQuery({
    queryKey: ["memoriales"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from("memoriales")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateMemorial = () => {
    navigate("/asistencia/crear-memorial");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatedHero
        title="Asistencia en el Duelo"
        subtitle="Apoyo y Acompañamiento"
        description="Un espacio seguro para honrar la memoria de tus seres queridos y acompañarte en tu proceso de duelo."
        icon={<HeartHandshake className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-6 sm:py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!isLoading && (!memoriales || memoriales.length === 0) && (
              <Card className="mb-6 sm:mb-8 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    Bienvenido a tu espacio de sanación
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Aquí podrás crear memoriales digitales para tus seres queridos y llevar un diario guiado de tu proceso de duelo
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <Heart className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">Memorial Digital</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Guarda fotos y recuerdos especiales</li>
                        <li>• Escribe cartas a tu ser querido</li>
                        <li>• Comparte historias y anécdotas</li>
                        <li>• Invita a familiares a participar</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">Diario de Duelo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Reflexiones guiadas semanales</li>
                        <li>• Seguimiento emocional personal</li>
                        <li>• Prompts adaptados a tu proceso</li>
                        <li>• Espacio privado y confidencial</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Mis Memoriales</h2>
              <Button onClick={handleCreateMemorial} disabled={isCreating} size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Crear Memorial
              </Button>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-2/3 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : memoriales && memoriales.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {memoriales.map((memorial) => (
                  <Card
                    key={memorial.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/asistencia/memorial/${memorial.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-primary" />
                            {memorial.nombre_ser_querido}
                          </CardTitle>
                          {memorial.relacion && (
                            <CardDescription className="capitalize">
                              {memorial.relacion}
                            </CardDescription>
                          )}
                        </div>
                        {memorial.foto_principal && (
                          <img
                            src={memorial.foto_principal}
                            alt={memorial.nombre_ser_querido}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {memorial.fecha_nacimiento && memorial.fecha_fallecimiento && (
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(memorial.fecha_nacimiento), "d 'de' MMMM, yyyy", { locale: es })} - {format(new Date(memorial.fecha_fallecimiento), "d 'de' MMMM, yyyy", { locale: es })}
                          </p>
                        )}
                        {memorial.descripcion && (
                          <p className="line-clamp-2">{memorial.descripcion}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/asistencia/memorial/${memorial.id}`);
                          }}
                        >
                          <Heart className="mr-1 h-3 w-3" />
                          Ver Memorial
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/asistencia/diario/${memorial.id}`);
                          }}
                        >
                          <BookOpen className="mr-1 h-3 w-3" />
                          Diario
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aún no has creado ningún memorial
                  </p>
                  <Button onClick={handleCreateMemorial}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear tu Primer Memorial
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Asistencia;
