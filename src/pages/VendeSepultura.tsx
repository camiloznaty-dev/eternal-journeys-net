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
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { todasLasComunas } from "@/data/comunas";
import { motion } from "framer-motion";

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
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Vende tu Sepultura
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Conectamos vendedores y compradores de sepulturas. 
                Te asesoramos en todo el proceso de manera profesional y segura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/publicar-sepultura">
                    <Plus className="mr-2 h-5 w-5" />
                    Publicar Anuncio
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contacto">Asesoría Gratuita</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o cementerio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={comunaFilter} onValueChange={setComunaFilter}>
                <SelectTrigger className="w-full md:w-48">
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
                <SelectTrigger className="w-full md:w-48">
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
        </section>

        {/* Resultados */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAnuncios && filteredAnuncios.length > 0 ? (
              <>
                <div className="mb-6 text-muted-foreground">
                  {filteredAnuncios.length} {filteredAnuncios.length === 1 ? "resultado" : "resultados"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-6">
                  No se encontraron anuncios con los filtros seleccionados
                </p>
                <Button asChild>
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Publica tu anuncio</h3>
                  <p className="text-muted-foreground">
                    Completa el formulario con la información de tu sepultura y fotos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Recibe consultas</h3>
                  <p className="text-muted-foreground">
                    Los interesados te contactarán directamente por teléfono o email
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Te asesoramos</h3>
                  <p className="text-muted-foreground">
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