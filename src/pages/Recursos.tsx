import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2, BookOpen, ClipboardList, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Recursos() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recursos = [
    {
      title: "Guía: Qué hacer cuando alguien fallece",
      description: "Pasos prácticos y claros para los primeros momentos. Incluye contactos importantes, documentación necesaria y trámites urgentes.",
      icon: BookOpen,
      pages: "12 páginas",
      category: "Guía Práctica",
      color: "from-primary/20 to-primary/5",
      available: false // Marcar como no disponible hasta crear el PDF real
    },
    {
      title: "Checklist de Planificación Funeral",
      description: "Lista completa de tareas y decisiones. Organiza el proceso paso a paso para no olvidar ningún detalle importante.",
      icon: ClipboardList,
      pages: "8 páginas",
      category: "Checklist",
      color: "from-accent/20 to-accent/5",
      available: false
    },
    {
      title: "Guía de Precios Promedio en Chile",
      description: "Rangos de precios referenciales por región y tipo de servicio. Información transparente para tomar decisiones informadas.",
      icon: FileCheck,
      pages: "15 páginas",
      category: "Referencia",
      color: "from-primary-glow/20 to-primary-glow/5",
      available: false
    }
  ];

  const handleDownload = async (recurso: typeof recursos[0]) => {
    if (!recurso.available) {
      toast({
        title: "Próximamente disponible",
        description: "Estamos preparando este recurso. Déjanos tu email para avisarte cuando esté listo.",
        variant: "default",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para descargar el recurso.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica de envío de email y descarga
      // Por ahora solo simulamos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Descarga iniciada!",
        description: `Hemos enviado "${recurso.title}" a ${email}`,
      });
      
      // Aquí iría el código real de descarga del PDF
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos procesar tu solicitud. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
              >
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Recursos Gratuitos</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold"
              >
                Guías y recursos útiles
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Descarga guías prácticas y checklists para ayudarte en momentos difíciles. Información clara y transparente sin costo.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Email Capture Section */}
        <section className="py-12 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="shadow-large border-2">
                <CardHeader>
                  <CardTitle className="text-center">Recibe los recursos por email</CardTitle>
                  <CardDescription className="text-center">
                    Ingresa tu correo una sola vez para descargar todos los recursos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Label htmlFor="email" className="sr-only">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button 
                      size="lg" 
                      className="h-12 px-8"
                      disabled={!email || isSubmitting}
                    >
                      Continuar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    No spam. Solo recursos útiles cuando los necesites.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Recursos Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-8">
              {recursos.map((recurso, index) => (
                <motion.div
                  key={recurso.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-large transition-all duration-300 border-2">
                    <div className="flex flex-col md:flex-row">
                      {/* Icon Side */}
                      <div className={`md:w-48 bg-gradient-to-br ${recurso.color} flex items-center justify-center p-8`}>
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/80 flex items-center justify-center shadow-soft">
                            <recurso.icon className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{recurso.category}</div>
                            <div className="text-xs text-muted-foreground">{recurso.pages}</div>
                          </div>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-8">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-display text-2xl font-bold">{recurso.title}</h3>
                              {!recurso.available && (
                                <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                                  Próximamente
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {recurso.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              onClick={() => handleDownload(recurso)}
                              disabled={isSubmitting}
                              className="group"
                            >
                              <Download className="w-4 h-4 mr-2 transition-transform group-hover:translate-y-0.5" />
                              {recurso.available ? "Descargar PDF" : "Avísame cuando esté listo"}
                            </Button>
                            {recurso.available && (
                              <span className="text-sm text-muted-foreground">Gratis · Sin registro</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
                ¿Por qué ofrecemos estos recursos?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: CheckCircle2,
                    title: "Transparencia Total",
                    description: "Información clara sin letra chica ni sorpresas"
                  },
                  {
                    icon: BookOpen,
                    title: "Guía Práctica",
                    description: "Pasos concretos cuando más los necesitas"
                  },
                  {
                    icon: FileText,
                    title: "Completamente Gratis",
                    description: "Sin costo oculto ni compromisos"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center space-y-3"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-warm flex items-center justify-center shadow-soft">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                ¿Necesitas más ayuda?
              </h2>
              <p className="text-lg text-muted-foreground">
                Explora nuestro directorio de funerarias o contacta directamente
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/funerarias">Ver Funerarias</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/contacto">Contactar</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
