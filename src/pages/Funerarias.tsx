import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Funerarias</h1>
            <p className="text-lg text-muted-foreground">
              Encuentra la funeraria perfecta para tus necesidades
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {funerarias?.map((funeraria) => (
                <Card key={funeraria.id} className="p-6 card-hover">
                  <div className="flex gap-4">
                    {funeraria.logo_url && (
                      <img
                        src={funeraria.logo_url}
                        alt={`Logo ${funeraria.name}`}
                        className="w-20 h-20 object-contain rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col gap-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{funeraria.name}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{funeraria.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="line-clamp-1">{funeraria.address}</span>
                        </div>
                        {funeraria.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{funeraria.phone}</span>
                          </div>
                        )}
                        {funeraria.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{funeraria.email}</span>
                          </div>
                        )}
                        {funeraria.rating > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="font-semibold">{funeraria.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link to={`/f/${funeraria.slug}`} className="flex-1">
                          <Button className="w-full">Ver Detalles</Button>
                        </Link>
                        <Button variant="outline">Contactar</Button>
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
