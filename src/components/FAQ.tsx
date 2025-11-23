import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo funciona Sirius?",
      answer: "Sirius es un marketplace que conecta familias con funerarias. Puedes buscar, comparar servicios y precios, y contactar directamente con las funerarias de tu zona.",
    },
    {
      question: "¿Es gratuito para las familias?",
      answer: "Sí, Sirius es completamente gratuito para las familias. Solo pagas por los servicios que contrates directamente con la funeraria elegida.",
    },
    {
      question: "¿Cómo se registra una funeraria?",
      answer: "Las funerarias pueden registrarse haciendo clic en 'Soy Funeraria' en el menú. Ofrecemos un plan gratuito para comenzar y planes premium con funcionalidades avanzadas.",
    },
    {
      question: "¿Qué incluye el plan de obituarios premium?",
      answer: "El plan premium incluye obituarios digitales ilimitados con galerías de fotos, biografías extensas, libro de condolencias digital y opciones de compartir en redes sociales.",
    },
    {
      question: "¿Cómo garantizan la calidad de las funerarias?",
      answer: "Verificamos todos los registros de funerarias, revisamos documentación legal y monitoreamos las calificaciones de los usuarios. Las funerarias con baja calificación son suspendidas.",
    },
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, las funerarias pueden cancelar su suscripción en cualquier momento sin penalizaciones. Los planes se facturan mensualmente.",
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
            Preguntas frecuentes
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
