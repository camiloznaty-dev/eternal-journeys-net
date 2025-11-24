import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartHandshake, FileText, Phone, ClipboardCheck } from "lucide-react";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-asistencia.jpg";
import { SEO } from "@/components/SEO";

const Asistencia = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Asistencia en el Duelo | Guía Práctica y Apoyo | ConectaFunerarias"
        description="Guía completa para momentos de duelo. Pasos prácticos, trámites necesarios, recursos útiles y apoyo emocional. Acompañamiento durante procesos difíciles en Chile."
        keywords={[
          "asistencia duelo",
          "guía funeral chile",
          "trámites fallecimiento",
          "apoyo duelo",
          "qué hacer cuando fallece alguien",
          "certificado defunción"
        ]}
      />
      <Header />
      
      <AnimatedHero
        title="Asistencia en el Duelo"
        subtitle="Apoyo y Acompañamiento"
        description="Guía práctica paso a paso para orientarte en los trámites y decisiones necesarias durante este momento difícil."
        icon={<HeartHandshake className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-6 sm:py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="guia" className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="guia" className="text-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Guía Práctica
                </TabsTrigger>
                <TabsTrigger value="recursos" className="text-sm">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Recursos
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
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Asistencia;
