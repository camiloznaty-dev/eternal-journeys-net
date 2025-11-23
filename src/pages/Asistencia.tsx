import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Stamp, Heart, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Asistencia() {
  const sections = [
    {
      id: "A",
      title: "Registro Oficial del Deceso",
      icon: FileText,
      description: "Es fundamental formalizar el deceso mediante la documentación legal correspondiente. Este es el paso inicial que permite continuar con las siguientes gestiones.",
      documents: [
        {
          title: "Constancia Médica del Deceso:",
          items: [
            "Centros de salud donde ocurrió el deceso",
            "Profesional médico que atendió al paciente en domicilio",
            "Para situaciones inusuales, es necesario notificar a las autoridades policiales"
          ]
        },
        {
          title: "Otros documentos:",
          items: [
            "Identificación oficial del difunto",
            "Registro familiar (opcional)",
            "Comprobante de pensión o previsión si aplica"
          ]
        }
      ],
      note: "Si lo necesitan, podemos coordinar con profesionales médicos que acuden al domicilio para emitir la documentación requerida."
    },
    {
      id: "B",
      title: "Permiso Legal para el Sepelio",
      icon: Stamp,
      description: "Nosotros gestionamos esta autorización incluida en nuestro servicio completo. La tramitación se realiza en la oficina del Registro Civil de la comuna respectiva.",
      documents: [
        {
          title: "Papelería Necesaria:",
          items: [
            "Documento médico original o duplicado del deceso (sin correcciones)",
            "Documento de identificación del difunto",
            "Registro familiar (sugerido mas no obligatorio)",
            "Copias extra del acta de defunción para gestiones futuras"
          ]
        }
      ],
      specialCases: [
        {
          title: "Servicio Médico Legal:",
          description: "Para decesos por circunstancias atípicas, el registro se efectúa en el Servicio Médico Legal. Fuera del horario regular del Registro Civil, los papeles pueden presentarse en el camposanto directamente."
        },
        {
          title: "Días no laborables:",
          description: "Durante sábados, domingos y festivos, la documentación se entrega en el cementerio seleccionado."
        }
      ]
    },
    {
      id: "C",
      title: "Planificación del Homenaje",
      icon: Heart,
      description: "Organizamos cada aspecto de la ceremonia de despedida respetando las tradiciones y deseos familiares.",
      documents: [
        {
          title: "Selección de Espacios:",
          items: [
            "Espacio para el velatorio: residencia, templo, capilla u otro sitio",
            "Servicio religioso: establecer el momento de la ceremonia",
            "Estas decisiones influyen en la programación del día y momento del sepelio"
          ]
        }
      ]
    },
    {
      id: "D",
      title: "Inhumación o Cremación",
      icon: MapPin,
      description: "Facilitamos todas las gestiones administrativas en el parque memorial o crematorio escogido.",
      documents: [
        {
          title: "Gestiones en el Camposanto:",
          items: [
            "Nuestros asesores orientan y apoyan en procedimientos que requieren presencia familiar",
            "Obtención de espacio de descanso final o coordinación de cremación según preferencia",
            "Liquidación de costos administrativos del cementerio",
            "Acompañamiento profesional durante todo el proceso"
          ]
        }
      ],
      note: "Los costos del cementerio deben ser cubiertos según las tarifas del lugar elegido. Ciertos trámites requieren la presencia de un familiar directo."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Guía para Momentos Difíciles
              </h1>
              <p className="text-lg text-muted-foreground">
                Te acompañamos paso a paso en cada gestión necesaria. 
                Esta guía te ayudará a comprender el proceso y los documentos requeridos.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl font-bold text-primary">
                                {section.id}
                              </span>
                              <CardTitle className="text-2xl">
                                {section.title}
                              </CardTitle>
                            </div>
                            <p className="text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6 space-y-6">
                        {/* Documents */}
                        {section.documents?.map((doc, idx) => (
                          <div key={idx}>
                            <h3 className="font-semibold mb-3 text-lg">
                              {doc.title}
                            </h3>
                            <ul className="space-y-2 ml-4">
                              {doc.items.map((item, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="flex items-start gap-2 text-muted-foreground"
                                >
                                  <span className="text-accent mt-1.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Special Cases */}
                        {section.specialCases && (
                          <div>
                            <h3 className="font-semibold mb-3 text-lg">
                              Casos Especiales:
                            </h3>
                            <div className="space-y-4">
                              {section.specialCases.map((specialCase, idx) => (
                                <div key={idx} className="ml-4">
                                  <h4 className="font-medium mb-2">
                                    {specialCase.title}
                                  </h4>
                                  <p className="text-muted-foreground">
                                    {specialCase.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Note */}
                        {section.note && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="ml-2">
                              <strong>Nota:</strong> {section.note}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Necesitas ayuda adicional?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Nuestro equipo está disponible 24/7 para orientarte y acompañarte 
              en cada paso del proceso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+56-2-2345-6789"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8"
              >
                Llamar Ahora
              </a>
              <a
                href="/funerarias"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                Ver Funerarias
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
