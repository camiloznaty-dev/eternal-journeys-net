import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Heart, Users, Lightbulb } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Nosotros() {
  const valores = [
    {
      icon: Heart,
      title: "Empatía",
      description: "Comprendemos el momento difícil que atraviesan las familias y actuamos con sensibilidad."
    },
    {
      icon: Users,
      title: "Transparencia",
      description: "Brindamos información clara y honesta sobre servicios y precios."
    },
    {
      icon: Target,
      title: "Calidad",
      description: "Conectamos familias solo con funerarias verificadas y de confianza."
    },
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Modernizamos la industria funeraria con tecnología y soluciones digitales."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Sobre Nosotros | Nuestra Misión y Valores | ConectaFunerarias"
        description="Conoce ConectaFunerarias. Modernizamos la industria funeraria en Chile conectando familias con servicios de calidad. Transparencia, empatía e innovación."
        keywords={[
          "sobre conectafunerarias",
          "misión funerarias",
          "valores empresa funeraria",
          "quienes somos"
        ]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Sobre Sirius</h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                Transformando la manera en que las familias encuentran servicios funerarios dignos y accesibles en Latinoamérica.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-8 sm:py-12 md:py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Nuestra Misión</h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Facilitar el acceso a servicios funerarios de calidad, brindando a las familias herramientas para tomar decisiones informadas en momentos difíciles, mientras apoyamos a las funerarias en su transformación digital.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Nuestra Visión</h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Ser la plataforma líder en Latinoamérica que conecta familias con servicios funerarios, modernizando la industria y estableciendo nuevos estándares de transparencia y accesibilidad.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Historia */}
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Nuestra Historia</h2>
                <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base md:text-lg">
                  <p>
                    Sirius nació de la necesidad de modernizar y transparentar la industria funeraria en Latinoamérica. Observamos que las familias enfrentaban dificultades para encontrar y comparar servicios funerarios en momentos de gran vulnerabilidad emocional.
                  </p>
                  <p>
                    Creamos una plataforma que no solo facilita la búsqueda de servicios, sino que también empodera a las funerarias con herramientas de gestión modernas, permitiéndoles ofrecer un mejor servicio y alcanzar a más familias.
                  </p>
                  <p>
                    Hoy, conectamos cientos de familias con funerarias verificadas, ayudando a dignificar este momento tan importante en la vida de las personas.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-8 sm:py-12 md:py-16 container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Nuestros Valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {valores.map((valor, index) => {
              const Icon = valor.icon;
              return (
                <motion.div
                  key={valor.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{valor.title}</h3>
                  <p className="text-muted-foreground">{valor.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Impacto */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Nuestro Impacto</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Familias Atendidas</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <div className="text-muted-foreground">Funerarias Asociadas</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Satisfacción</div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
