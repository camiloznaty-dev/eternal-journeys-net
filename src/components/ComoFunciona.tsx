import { motion } from "framer-motion";
import { Search, FileText, Phone, CheckCircle2 } from "lucide-react";

export const ComoFunciona = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Busca y Compara",
      description: "Explora funerarias y servicios en tu zona. Compara precios, servicios y opiniones de forma transparente.",
      color: "from-primary/20 to-primary/5"
    },
    {
      number: "02",
      icon: FileText,
      title: "Revisa Opciones",
      description: "Consulta paquetes detallados, lee sobre cada servicio y elige lo que mejor se adapte a tus necesidades.",
      color: "from-accent/20 to-accent/5"
    },
    {
      number: "03",
      icon: Phone,
      title: "Contacta Directamente",
      description: "Comunícate con la funeraria de tu elección por teléfono, WhatsApp o formulario. Sin intermediarios.",
      color: "from-primary-glow/20 to-primary-glow/5"
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Coordina el Servicio",
      description: "La funeraria te guiará en cada paso. Nosotros solo facilitamos la conexión, tú controlas la decisión.",
      color: "from-accent-glow/20 to-accent-glow/5"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Un proceso simple y transparente para ayudarte en momentos difíciles
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 h-full">
                  {/* Number Badge */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-muted-foreground mb-2">{step.number}</div>
                      <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Connector line for desktop */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-6">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              Contáctanos
            </a>
            <a 
              href="/funerarias"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-border bg-background hover:bg-accent/5 font-medium transition-all duration-300 hover:border-accent/30"
            >
              Ver Funerarias
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
