import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search, BookHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-obituarios.jpg";
import { SEO } from "@/components/SEO";

const Obituarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: obituarios, isLoading } = useQuery({
    queryKey: ["obituarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obituarios")
        .select("*, funerarias(name)")
        .eq("is_premium", false)
        .order("death_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredObituarios = obituarios?.filter(obit =>
    obit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Obituarios Digitales en Chile | Esquelas y Memoriales | ConectaFunerarias"
        description="Obituarios y esquelas digitales en Chile. Honra la memoria de tus seres queridos con obituarios online, condolencias virtuales y memoriales permanentes."
        keywords={[
          "obituarios chile",
          "obituarios digitales",
          "esquelas online",
          "memoriales digitales",
          "condolencias virtuales",
          "obituarios santiago"
        ]}
      />
      <Header />
      
      <AnimatedHero
        title="Obituarios"
        subtitle="En Memoria"
        description="Honrando la vida y el legado de nuestros seres queridos. Un espacio de recuerdo y homenaje."
        icon={<BookHeart className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
            
          {/* Buscador */}
          <div className="relative max-w-md mx-auto mb-8 sm:mb-12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredObituarios && filteredObituarios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {filteredObituarios.map((obituario) => (
                <Link key={obituario.id} to={`/obituarios/${obituario.id}`}>
                  <Card className="overflow-hidden card-hover h-full hover:shadow-xl transition-all">
                    <div className="relative">
                      {obituario.photo_url && (
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={obituario.photo_url}
                            alt={obituario.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {obituario.is_premium && (
                        <Badge className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 line-clamp-2">{obituario.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                        {format(new Date(obituario.birth_date), "yyyy", { locale: es })} -{" "}
                        {format(new Date(obituario.death_date), "yyyy", { locale: es })}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
                        Def. {format(new Date(obituario.death_date), "d/MM/yyyy", { locale: es })}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                        {obituario.biography}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t">
                        <span className="line-clamp-1 flex-1 mr-2">{obituario.funerarias?.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{obituario.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-sm sm:text-base text-muted-foreground">
                {searchTerm ? "No se encontraron obituarios con ese nombre" : "No hay obituarios disponibles"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Obituarios;
