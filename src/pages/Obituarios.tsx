import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Obituarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: obituarios, isLoading } = useQuery({
    queryKey: ["obituarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obituarios")
        .select("*, funerarias(name)")
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
      <Header />
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Obituarios</h1>
            <p className="text-lg text-muted-foreground mb-8">
              En memoria de nuestros seres queridos
            </p>
            
            {/* Buscador */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredObituarios && filteredObituarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                        <Badge className="absolute top-4 right-4 bg-accent">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{obituario.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {format(new Date(obituario.birth_date), "yyyy", { locale: es })} -{" "}
                        {format(new Date(obituario.death_date), "yyyy", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Def. {format(new Date(obituario.death_date), "d/MM/yyyy", { locale: es })}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {obituario.biography}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                        <span>{obituario.funerarias?.name}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{obituario.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
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
