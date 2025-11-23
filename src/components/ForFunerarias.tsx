import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, ShoppingCart, FileText, BarChart3, Users, Shield } from "lucide-react";

export const ForFunerarias = () => {
  const features = [
    {
      icon: Building2,
      title: "Perfil Digital",
      description: "Crea tu presencia online profesional",
    },
    {
      icon: ShoppingCart,
      title: "Gestión de Productos",
      description: "Administra tu catálogo de servicios",
    },
    {
      icon: FileText,
      title: "Obituarios Premium",
      description: "Ofrece obituarios digitales a tus clientes",
    },
    {
      icon: BarChart3,
      title: "Analíticas",
      description: "Seguimiento de visitas y conversiones",
    },
    {
      icon: Users,
      title: "Gestión de Pedidos",
      description: "Recibe y gestiona solicitudes online",
    },
    {
      icon: Shield,
      title: "Soporte Dedicado",
      description: "Asistencia técnica especializada",
    },
  ];

  return (
    <section className="py-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
          >
            Para Funerarias
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold"
          >
            Moderniza tu funeraria
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Plataforma completa de gestión para digitalizar tu negocio
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full card-hover">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="px-8">
            Solicitar Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
