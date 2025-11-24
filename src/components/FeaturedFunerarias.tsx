import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FeaturedFunerarias = () => {
  const { data: funerarias, isLoading } = useQuery({
    queryKey: ["featured-funerarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funerarias")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Funerarias destacadas ⭐
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Las mejor valoradas por familias como la tuya
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 sm:h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Funerarias destacadas ⭐
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg px-4"
          >
            Las mejor valoradas por familias como la tuya
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {funerarias?.map((funeraria, index) => (
            <motion.div
              key={funeraria.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-4 sm:p-6 h-full hover:shadow-xl transition-all duration-300 hover:border-accent/50 space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl mb-1.5 sm:mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {funeraria.name}
                    </h3>
                    {funeraria.rating && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-accent text-accent" />
                          <span className="font-semibold text-sm sm:text-base">{funeraria.rating}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Calificación
                        </span>
                      </div>
                    )}
                  </div>
                  {funeraria.logo_url && (
                    <img
                      src={funeraria.logo_url}
                      alt={`Logo ${funeraria.name}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg flex-shrink-0"
                    />
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  {funeraria.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{funeraria.address}</span>
                    </div>
                  )}
                  {funeraria.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{funeraria.phone}</span>
                    </div>
                  )}
                  {funeraria.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="truncate">{funeraria.email}</span>
                    </div>
                  )}
                </div>

                {funeraria.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {funeraria.description}
                  </p>
                )}

                <div className="pt-1 sm:pt-2">
                  <Link to={`/f/${funeraria.slug}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-accent group-hover:text-accent text-xs sm:text-sm">
                      Ver detalles →
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link to="/funerarias">
            <Button size="default" variant="outline" className="w-full sm:w-auto">
              Ver todas las funerarias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
