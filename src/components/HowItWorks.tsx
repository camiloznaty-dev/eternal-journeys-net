import { motion } from "framer-motion";
import { Search, GitCompare, Phone, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Busca",
      description: "Encuentra funerarias y servicios en tu zona",
    },
    {
      icon: GitCompare,
      title: "Compara",
      description: "Revisa precios, servicios y opiniones",
    },
    {
      icon: Phone,
      title: "Contacta",
      description: "Comunícate directamente con la funeraria",
    },
    {
      icon: CheckCircle,
      title: "Contrata",
      description: "Organiza todo desde un solo lugar",
    },
  ];

  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold"
          >
            Cómo funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Simplificamos el proceso en momentos difíciles
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border-2 border-accent mb-4">
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
