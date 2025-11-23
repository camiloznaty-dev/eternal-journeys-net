import { motion } from "framer-motion";

export const Stats = () => {
  const stats = [
    { value: "500+", label: "Funerarias Registradas" },
    { value: "10,000+", label: "Familias Atendidas" },
    { value: "50+", label: "Ciudades Cubiertas" },
    { value: "4.9/5", label: "Calificación Promedio" },
  ];

  return (
    <section className="py-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
