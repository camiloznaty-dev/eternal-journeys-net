import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "María García",
      role: "Cliente",
      content: "En un momento muy difícil, Sirius me ayudó a encontrar la funeraria perfecta. El proceso fue transparente y respetuoso.",
      rating: 5,
    },
    {
      name: "Funeraria San Miguel",
      role: "Funeraria Partner",
      content: "Desde que usamos Sirius, hemos triplicado nuestras consultas online. La plataforma es intuitiva y el soporte excelente.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Cliente",
      content: "Poder comparar servicios y precios me dio tranquilidad en un momento complicado. Recomiendo Sirius totalmente.",
      rating: 5,
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
            Lo que dicen nuestros usuarios
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
