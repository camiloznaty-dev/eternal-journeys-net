import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, Star } from "lucide-react";

export const Stats = () => {
  const stats = [
    { 
      value: "500+", 
      label: "Funerarias Verificadas",
      icon: Users,
      color: "text-primary"
    },
    { 
      value: "10,000+", 
      label: "Familias Atendidas",
      icon: TrendingUp,
      color: "text-accent"
    },
    { 
      value: "50+", 
      label: "Ciudades en Chile",
      icon: MapPin,
      color: "text-primary-glow"
    },
    { 
      value: "4.9★", 
      label: "Satisfacción",
      icon: Star,
      color: "text-accent-glow"
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-subtle relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Confianza respaldada por números
          </h2>
          <p className="text-muted-foreground text-lg">
            Miles de familias confían en nosotros cada día
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center ${stat.color} shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className={`font-display text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="text-sm font-medium">Certificados y verificados por familias chilenas</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
