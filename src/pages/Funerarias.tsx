import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star, Mail, Loader2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-funerarias.jpg";

const Funerarias = () => {
  const { data: funerarias, isLoading } = useQuery({
    queryKey: ["funerarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funerarias")
        .select("*")
        .eq("website_active", true)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatedHero
        title="Encuentra la Funeraria Perfecta"
        subtitle="Directorio de Funerarias"
        description="Explora y compara las mejores funerarias de Chile. Transparencia, calidad y confianza en un solo lugar."
        icon={<Building2 className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {funerarias?.map((funeraria) => (
                <Card key={funeraria.id} className="p-4 sm:p-6 card-hover">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {funeraria.logo_url && (
                      <img
                        src={funeraria.logo_url}
                        alt={`Logo ${funeraria.name}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg flex-shrink-0 mx-auto sm:mx-0"
                      />
                    )}
                    <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-center sm:text-left">{funeraria.name}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{funeraria.description}</p>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="line-clamp-1">{funeraria.address}</span>
                        </div>
                        {funeraria.phone && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span>{funeraria.phone}</span>
                          </div>
                        )}
                        {funeraria.email && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{funeraria.email}</span>
                          </div>
                        )}
                        {funeraria.rating > 0 && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent fill-accent" />
                            <span className="font-semibold">{funeraria.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                        <Link to={`/f/${funeraria.slug}`} className="flex-1">
                          <Button className="w-full" size="sm">Ver Detalles</Button>
                        </Link>
                        <Button variant="outline" size="sm" className="sm:w-auto">Contactar</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Funerarias;
