import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const PricingPlans = () => {
  const plans = [
    {
      name: "Básico",
      price: "0.5 UF/mes",
      description: "Para empezar a digitalizar tu funeraria",
      features: [
        "Perfil en el marketplace",
        "Hasta 10 productos/servicios",
        "Gestión de pedidos básica",
        "Soporte por email",
      ],
      cta: "Contratar",
      highlighted: false,
    },
    {
      name: "Profesional",
      price: "2 UF/mes",
      description: "Funcionalidades completas para crecer",
      features: [
        "Todo lo del plan Básico",
        "Productos/servicios ilimitados",
        "Obituarios digitales premium",
        "Analíticas avanzadas",
        "Soporte prioritario",
        "Sin comisiones por pedido",
      ],
      cta: "Contratar",
      highlighted: true,
    },
    {
      name: "Empresa",
      price: "Personalizado",
      description: "Para cadenas de funerarias",
      features: [
        "Todo lo del plan Profesional",
        "Multi-ubicación",
        "API personalizada",
        "Integración con sistemas",
        "Capacitación dedicada",
        "Account manager",
      ],
      cta: "Contactar Ventas",
      highlighted: false,
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
            Planes y precios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Elige el plan que mejor se adapte a tu funeraria
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-8 h-full flex flex-col ${
                  plan.highlighted
                    ? "border-accent shadow-lg shadow-accent/10 scale-105"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block self-start px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
                    Más Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
