import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

export const PricingComparison = () => {
  const isMobile = useIsMobile();
  
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
        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent mx-auto" />
      ) : (
        <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-xs sm:text-sm font-medium">{value}</span>;
  };

  // Vista móvil - Cards por plan
  if (isMobile) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            >
              Comparación detallada de planes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
            >
              Encuentra el plan perfecto para tu funeraria
            </motion.p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className={`p-4 ${plan.highlighted ? 'border-accent border-2' : ''}`}>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      {plan.highlighted && <Badge variant="default">Popular</Badge>}
                    </div>
                    <p className="text-xl font-semibold text-accent">{plan.price}</p>
                  </div>

                  <div className="space-y-3">
                    {features.map((category) => (
                      <div key={category.category}>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">{category.category}</h4>
                        <div className="space-y-1.5">
                          {category.items.map((item) => {
                            const value = item[plan.key as keyof typeof item];
                            return (
                              <div key={item.name} className="flex items-center justify-between text-xs">
                                <span className="flex-1">{item.name}</span>
                                <span className="ml-2">{renderCell(value)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full mt-4"
                    size="sm"
                  >
                    {plan.key === "empresa" ? "Contactar" : "Contratar"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Vista desktop - Tabla
  return (
    <section className="py-16 lg:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            Comparación detallada de planes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto"
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
          <Card className="overflow-x-auto">
            {/* Header with plan names */}
            <div className="grid grid-cols-4 gap-4 p-4 lg:p-6 bg-muted/50 border-b border-border min-w-[800px]">
              <div className="font-semibold text-base lg:text-lg">Características</div>
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`text-center ${
                    plan.highlighted ? "bg-accent/10 -m-4 lg:-m-6 p-4 lg:p-6 border-x border-accent/20" : ""
                  }`}
                >
                  <div className="font-bold text-lg lg:text-xl mb-1">{plan.name}</div>
                  <div className="text-base lg:text-lg font-semibold text-accent">{plan.price}</div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            <div className="divide-y divide-border min-w-[800px]">
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="px-4 lg:px-6 py-3 lg:py-4 bg-muted/30">
                    <h3 className="font-bold text-sm lg:text-base">{category.category}</h3>
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-4 gap-4 px-4 lg:px-6 py-3 lg:py-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="text-xs lg:text-sm text-muted-foreground">{item.name}</div>
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
            <div className="grid grid-cols-4 gap-4 p-4 lg:p-6 bg-muted/50 border-t border-border min-w-[800px]">
              <div></div>
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`text-center ${
                    plan.highlighted ? "bg-accent/10 -m-4 lg:-m-6 p-4 lg:p-6 border-x border-accent/20" : ""
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