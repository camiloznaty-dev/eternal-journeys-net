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
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Funerarias destacadas ⭐
            </h2>
            <p className="text-muted-foreground text-lg">
              Las mejor valoradas por familias como la tuya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Funerarias destacadas ⭐
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Las mejor valoradas por familias como la tuya
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {funerarias?.map((funeraria, index) => (
            <motion.div
              key={funeraria.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 h-full hover:shadow-xl transition-all duration-300 hover:border-accent/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                      {funeraria.name}
                    </h3>
                    {funeraria.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold">{funeraria.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Calificación
                        </span>
                      </div>
                    )}
                  </div>
                  {funeraria.logo_url && (
                    <img
                      src={funeraria.logo_url}
                      alt={`Logo ${funeraria.name}`}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {funeraria.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{funeraria.address}</span>
                    </div>
                  )}
                  {funeraria.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{funeraria.phone}</span>
                    </div>
                  )}
                  {funeraria.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{funeraria.email}</span>
                    </div>
                  )}
                </div>

                {funeraria.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {funeraria.description}
                  </p>
                )}

                <div className="pt-2">
                  <Link to={`/funerarias?id=${funeraria.id}`}>
                    <Button variant="outline" className="w-full group-hover:border-accent group-hover:text-accent">
                      Ver detalles →
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/funerarias">
            <Button size="lg" variant="outline">
              Ver todas las funerarias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
