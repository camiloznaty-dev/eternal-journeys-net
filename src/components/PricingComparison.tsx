import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PricingComparison = () => {
  const features = [
    {
      category: "Presencia Digital",
      items: [
        { name: "Perfil en marketplace", basico: true, profesional: true, empresa: true },
        { name: "Página web personalizada", basico: false, profesional: true, empresa: true },
        { name: "Multi-ubicación", basico: false, profesional: false, empresa: true },
        { name: "Dominio personalizado", basico: false, profesional: true, empresa: true },
      ],
    },
    {
      category: "Productos y Servicios",
      items: [
        { name: "Catálogo de productos", basico: "10", profesional: "Ilimitado", empresa: "Ilimitado" },
        { name: "Catálogo de servicios", basico: "10", profesional: "Ilimitado", empresa: "Ilimitado" },
        { name: "Gestión de inventario", basico: true, profesional: true, empresa: true },
        { name: "Gestión de proveedores", basico: false, profesional: true, empresa: true },
      ],
    },
    {
      category: "Gestión Operativa",
      items: [
        { name: "Gestión de casos", basico: true, profesional: true, empresa: true },
        { name: "Gestión de leads", basico: true, profesional: true, empresa: true },
        { name: "Cotizaciones digitales", basico: true, profesional: true, empresa: true },
        { name: "Facturación electrónica", basico: false, profesional: true, empresa: true },
        { name: "Gestión de turnos", basico: false, profesional: true, empresa: true },
        { name: "Gestión de equipo", basico: false, profesional: true, empresa: true },
      ],
    },
    {
      category: "Obituarios y Condolencias",
      items: [
        { name: "Obituarios básicos", basico: true, profesional: true, empresa: true },
        { name: "Obituarios premium", basico: false, profesional: true, empresa: true },
        { name: "Galería de fotos", basico: false, profesional: true, empresa: true },
        { name: "Mensajes de condolencias", basico: true, profesional: true, empresa: true },
      ],
    },
    {
      category: "Analíticas y Reportes",
      items: [
        { name: "Analíticas básicas", basico: true, profesional: true, empresa: true },
        { name: "Analíticas avanzadas", basico: false, profesional: true, empresa: true },
        { name: "Reportes personalizados", basico: false, profesional: false, empresa: true },
        { name: "Dashboard ejecutivo", basico: false, profesional: false, empresa: true },
      ],
    },
    {
      category: "Soporte y Capacitación",
      items: [
        { name: "Soporte por email", basico: true, profesional: true, empresa: true },
        { name: "Soporte prioritario", basico: false, profesional: true, empresa: true },
        { name: "Capacitación dedicada", basico: false, profesional: false, empresa: true },
        { name: "Account manager", basico: false, profesional: false, empresa: true },
      ],
    },
    {
      category: "Integraciones",
      items: [
        { name: "Integraciones básicas", basico: true, profesional: true, empresa: true },
        { name: "API personalizada", basico: false, profesional: false, empresa: true },
        { name: "Integración con sistemas", basico: false, profesional: false, empresa: true },
        { name: "Webhooks", basico: false, profesional: false, empresa: true },
      ],
    },
  ];

  const plans = [
    { name: "Básico", price: "0.5 UF/mes", key: "basico" },
    { name: "Profesional", price: "2 UF/mes", key: "profesional", highlighted: true },
    { name: "Empresa", price: "Personalizado", key: "empresa" },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-accent mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

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
            Comparación detallada de planes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Encuentra el plan perfecto para tu funeraria
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <Card className="overflow-hidden">
            {/* Header with plan names */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 border-b border-border">
              <div className="font-semibold text-lg">Características</div>
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`text-center ${
                    plan.highlighted ? "bg-accent/10 -m-6 p-6 border-x border-accent/20" : ""
                  }`}
                >
                  <div className="font-bold text-xl mb-1">{plan.name}</div>
                  <div className="text-lg font-semibold text-accent">{plan.price}</div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            <div className="divide-y divide-border">
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="px-6 py-4 bg-muted/30">
                    <h3 className="font-bold text-base">{category.category}</h3>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="text-sm text-muted-foreground">{item.name}</div>
                      <div className="text-center">
                        {renderCell(item.basico)}
                      </div>
                      <div className="text-center bg-accent/5">
                        {renderCell(item.profesional)}
                      </div>
                      <div className="text-center">
                        {renderCell(item.empresa)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer with CTA buttons */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 border-t border-border">
              <div></div>
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`text-center ${
                    plan.highlighted ? "bg-accent/10 -m-6 p-6 border-x border-accent/20" : ""
                  }`}
                >
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.key === "empresa" ? "Contactar" : "Contratar"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
