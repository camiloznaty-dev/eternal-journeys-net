import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnuncioSepulturaCard } from "@/components/AnuncioSepulturaCard";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { todasLasComunas } from "@/data/comunas";
import { motion } from "framer-motion";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-vende-sepultura.jpg";

const tiposSepultura = ["Todos", "Perpetua", "Temporal", "Nicho", "Mausoleo", "Columbario"];

export default function VendeSepultura() {
  const [searchTerm, setSearchTerm] = useState("");
  const [comunaFilter, setComunaFilter] = useState("Todas");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const { data: anuncios, isLoading } = useQuery({
    queryKey: ["anuncios-sepulturas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anuncios_sepulturas")
        .select("*")
        .eq("status", "disponible")
        .order("destacado", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredAnuncios = anuncios?.filter(anuncio => {
    const matchesSearch = 
      anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anuncio.cementerio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComuna = comunaFilter === "Todas" || anuncio.comuna === comunaFilter;
    const matchesTipo = tipoFilter === "Todos" || anuncio.tipo_sepultura === tipoFilter;
    
    return matchesSearch && matchesComuna && matchesTipo;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatedHero
        title="Sepulturas Disponibles"
        subtitle="Marketplace de Sepulturas"
        description="Encuentra o vende sepulturas en los mejores cementerios de Chile. Transparencia y confianza garantizada."
        icon={<Home className="w-10 h-10" />}
        backgroundImage={heroImage}
      >
        <Link to="/publicar-sepultura">
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Publicar Sepultura
          </Button>
        </Link>
      </AnimatedHero>

      <main className="flex-1">
        {/* Filtros */}
        <section className="py-6 sm:py-8 border-b bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o cementerio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-11"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={comunaFilter} onValueChange={setComunaFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas las comunas</SelectItem>
                    {todasLasComunas.map(comuna => (
                      <SelectItem key={comuna} value={comuna}>{comuna}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposSepultura.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <Skeleton className="h-40 sm:h-48 w-full" />
                    <CardContent className="p-3 sm:p-4 space-y-2">
                      <Skeleton className="h-5 sm:h-6 w-3/4" />
                      <Skeleton className="h-3 sm:h-4 w-full" />
                      <Skeleton className="h-3 sm:h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAnuncios && filteredAnuncios.length > 0 ? (
              <>
                <div className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
                  {filteredAnuncios.length} {filteredAnuncios.length === 1 ? "resultado" : "resultados"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredAnuncios.map((anuncio, index) => (
                    <motion.div
                      key={anuncio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnuncioSepulturaCard anuncio={anuncio} />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
                  No se encontraron anuncios con los filtros seleccionados
                </p>
                <Button asChild size="default" className="w-full sm:w-auto">
                  <Link to="/publicar-sepultura">
                    <Plus className="mr-2 h-4 w-4" />
                    Publicar el primer anuncio
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">Publica tu anuncio</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Completa el formulario con la información de tu sepultura y fotos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">Recibe consultas</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Los interesados te contactarán directamente por teléfono o email
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">Te asesoramos</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Nuestro equipo te guía en todo el proceso legal y administrativo
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}