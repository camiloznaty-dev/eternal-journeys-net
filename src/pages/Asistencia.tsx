import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen, Plus, Calendar, HeartHandshake, FileText, Users, Phone, ClipboardCheck } from "lucide-react";
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
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="guia" className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                <TabsTrigger value="guia" className="text-xs sm:text-sm">
                  <FileText className="mr-1 sm:mr-2 h-4 w-4" />
                  Guía Práctica
                </TabsTrigger>
                <TabsTrigger value="memoriales" className="text-xs sm:text-sm">
                  <Heart className="mr-1 sm:mr-2 h-4 w-4" />
                  Memoriales
                </TabsTrigger>
                <TabsTrigger value="recursos" className="text-xs sm:text-sm">
                  <ClipboardCheck className="mr-1 sm:mr-2 h-4 w-4" />
                  Recursos
                </TabsTrigger>
                <TabsTrigger value="apoyo" className="text-xs sm:text-sm">
                  <Users className="mr-1 sm:mr-2 h-4 w-4" />
                  Apoyo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guia" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">¿Qué hacer en caso de fallecimiento?</CardTitle>
                    <CardDescription>Guía paso a paso para orientarte en este momento difícil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg mb-2">Certificado de Defunción</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            El médico que certifica el fallecimiento debe emitir el certificado médico de defunción. Este documento es esencial para todos los trámites posteriores.
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Hospital o clínica: Lo emite el médico tratante</li>
                            <li>• Domicilio: Llamar al SAMU (131) quien enviará un médico</li>
                            <li>• Vía pública: Carabineros y SAMU certifican el fallecimiento</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg mb-2">Contactar Funeraria</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Una vez obtenido el certificado médico, contacta a una funeraria para coordinar el traslado y servicios.
                          </p>
                          <Button variant="outline" size="sm" onClick={() => navigate("/funerarias")} className="mt-2">
                            <Phone className="mr-2 h-4 w-4" />
                            Ver Funerarias Disponibles
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg mb-2">Inscripción en Registro Civil</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            La funeraria usualmente gestiona este trámite. Se debe inscribir la defunción en el Registro Civil dentro de las 48 horas.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Documentos necesarios:</strong> Certificado médico de defunción, cédula del fallecido, cédula del solicitante.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg mb-2">Organizar el Servicio Funerario</h3>
                          <p className="text-sm text-muted-foreground">
                            Coordina con la funeraria los detalles del velorio, ceremonia y sepultación o cremación según los deseos familiares.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">5</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg mb-2">Trámites Posteriores</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Después del servicio, existen diversos trámites legales y administrativos:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Solicitud de cuota mortuoria (AFP o IPS)</li>
                            <li>• Gestión de herencias y testamentos</li>
                            <li>• Cancelación de servicios y cuentas</li>
                            <li>• Notificación a instituciones (bancos, isapres, etc.)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Números de Emergencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">SAMU (Emergencias)</p>
                      <p className="text-muted-foreground">131</p>
                    </div>
                    <div>
                      <p className="font-semibold">Carabineros</p>
                      <p className="text-muted-foreground">133</p>
                    </div>
                    <div>
                      <p className="font-semibold">Bomberos</p>
                      <p className="text-muted-foreground">132</p>
                    </div>
                    <div>
                      <p className="font-semibold">Salud Responde</p>
                      <p className="text-muted-foreground">600 360 7777</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="memoriales" className="space-y-6">
                <div className="max-w-4xl mx-auto">
                  {!isLoading && (!memoriales || memoriales.length === 0) && (
                    <Card className="mb-6 border-primary/20">
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
              </TabsContent>

              <TabsContent value="recursos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Recursos Útiles</CardTitle>
                    <CardDescription>Documentos y trámites importantes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cuota Mortuoria</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p className="mb-2">Beneficio para cubrir gastos funerarios. Pueden solicitarlo:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Cónyuge o conviviente civil</li>
                            <li>• Hijos mayores de 18 años</li>
                            <li>• Padres del fallecido</li>
                          </ul>
                          <p className="mt-2 font-semibold">Plazo: 6 meses desde el fallecimiento</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Posesión Efectiva</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p className="mb-2">Trámite para heredar bienes. Se realiza en:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Registro Civil (si no hay testamento)</li>
                            <li>• Tribunal de Justicia (con testamento)</li>
                          </ul>
                          <p className="mt-2 font-semibold">Documentos: Certificado defunción, partidas nacimiento herederos</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Pensión de Sobrevivencia</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p className="mb-2">Beneficio para familiares del fallecido que cotizaba en AFP o IPS.</p>
                          <p className="mt-2 font-semibold">Se solicita en AFP o IPS correspondiente</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cancelar Servicios</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p className="mb-2">Notificar a:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Bancos e instituciones financieras</li>
                            <li>• Isapre o Fonasa</li>
                            <li>• Compañías de servicios básicos</li>
                            <li>• SII (si era contribuyente)</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="apoyo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Apoyo Emocional</CardTitle>
                    <CardDescription>Recursos para tu proceso de duelo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Grupos de Apoyo</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Compartir tu experiencia con otros que están pasando por situaciones similares puede ser de gran ayuda.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Fundación Algreco</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            <p>Apoyo en duelo y pérdidas</p>
                            <p className="mt-2">Tel: +56 2 2222 9393</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Fundación José Ignacio</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            <p>Acompañamiento en duelo</p>
                            <p className="mt-2">www.fundacionjoseignacio.org</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3">Atención Psicológica</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        El apoyo profesional puede ayudarte a transitar el duelo de manera más saludable.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">Salud Responde:</span>
                          <span>600 360 7777 (atención telefónica gratuita 24/7)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">Fonasa/Isapre:</span>
                          <span>Consulta por cobertura de atención psicológica</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">COSAM:</span>
                          <span>Centros de Salud Mental en tu comuna</span>
                        </li>
                      </ul>
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Tu Espacio Personal</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <p className="mb-4">
                          Además del apoyo profesional y grupal, puedes usar nuestras herramientas de apoyo emocional:
                        </p>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => navigate("/asistencia/crear-memorial")}
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Crear Memorial Digital
                          </Button>
                          <p className="text-xs ml-10">Honra la memoria de tu ser querido en un espacio digital</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Asistencia;
