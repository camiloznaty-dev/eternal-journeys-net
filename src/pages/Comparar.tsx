import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Search, Plus, MapPin, Phone, Mail, Clock, Filter, ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Comparar = () => {
  const [selectedFunerarias, setSelectedFunerarias] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const { data: funerarias, isLoading } = useQuery({
    queryKey: ["funerarias", sortBy],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funerarias")
        .select("*")
        .eq("website_active", true)
        .order(sortBy === "rating" ? "rating" : "name", { ascending: sortBy === "name" });

      if (error) throw error;
      return data;
    },
  });

  const filteredFunerarias = funerarias?.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const comparisonData = funerarias?.filter((f) =>
    selectedFunerarias.includes(f.id)
  );

  const toggleFuneraria = (id: string) => {
    if (selectedFunerarias.includes(id)) {
      setSelectedFunerarias(selectedFunerarias.filter((fid) => fid !== id));
    } else if (selectedFunerarias.length < 3) {
      setSelectedFunerarias([...selectedFunerarias, id]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-hero border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center space-y-4"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
                Comparador de Funerarias
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Compara servicios, precios y ubicaciones lado a lado. Decisiones informadas con total transparencia.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Badge variant="secondary" className="text-sm">Hasta 3 funerarias</Badge>
                <Badge variant="secondary" className="text-sm">100% Gratis</Badge>
                <Badge variant="secondary" className="text-sm">Sin registro</Badge>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar y Filtrar
                </CardTitle>
                <CardDescription>
                  Encuentra las funerarias que mejor se adapten a tus necesidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nombre o ubicación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(value: "rating" | "name") => setSortBy(value)}>
                      <SelectTrigger className="w-[180px] h-12">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Mejor valoradas</SelectItem>
                        <SelectItem value="name">Por nombre</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-12 w-12"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters (Collapsible) */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t"
                  >
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ubicación</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas las comunas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las comunas</SelectItem>
                            <SelectItem value="stgo-centro">Santiago Centro</SelectItem>
                            <SelectItem value="providencia">Providencia</SelectItem>
                            <SelectItem value="las-condes">Las Condes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Servicios</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los servicios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="cremacion">Cremación</SelectItem>
                            <SelectItem value="tradicional">Servicio Tradicional</SelectItem>
                            <SelectItem value="internacional">Traslado Internacional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Disponibilidad</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Cualquier horario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="24-7">24/7</SelectItem>
                            <SelectItem value="business">Horario comercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Selected Funerarias */}
                {selectedFunerarias.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm font-medium text-muted-foreground self-center">
                      Seleccionadas ({selectedFunerarias.length}/3):
                    </span>
                    {comparisonData?.map((f) => (
                      <Badge key={f.id} variant="default" className="gap-2 py-2 px-3">
                        {f.name}
                        <button
                          onClick={() => toggleFuneraria(f.id)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Funerarias Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando funerarias...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {filteredFunerarias?.map((funeraria, index) => (
                <motion.div
                  key={funeraria.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 h-full hover:shadow-large ${
                      selectedFunerarias.includes(funeraria.id)
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-accent/30"
                    }`}
                    onClick={() => toggleFuneraria(funeraria.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {funeraria.logo_url ? (
                          <img
                            src={funeraria.logo_url}
                            alt={funeraria.name}
                            className="w-16 h-16 object-contain rounded-lg bg-muted p-2"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-warm flex items-center justify-center text-white font-bold text-xl">
                            {funeraria.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-bold mb-1 truncate">
                            {funeraria.name}
                          </h3>
                          {funeraria.rating && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-accent">{funeraria.rating}</span>
                              <span className="text-sm">⭐</span>
                            </div>
                          )}
                        </div>
                        {selectedFunerarias.includes(funeraria.id) ? (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-border hover:border-primary flex items-center justify-center">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{funeraria.address}</span>
                        </div>
                        {funeraria.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{funeraria.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Comparison Table */}
          {comparisonData && comparisonData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="shadow-large">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Comparación Detallada
                  </CardTitle>
                  <CardDescription>
                    Revisa lado a lado las características de cada funeraria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-6 px-4 font-semibold min-w-[200px]">
                            Característica
                          </th>
                          {comparisonData.map((funeraria) => (
                            <th key={funeraria.id} className="text-center py-6 px-4 min-w-[250px]">
                              <div className="space-y-3">
                                {funeraria.logo_url ? (
                                  <img
                                    src={funeraria.logo_url}
                                    alt={funeraria.name}
                                    className="w-20 h-20 object-contain mx-auto rounded-lg bg-muted p-2"
                                  />
                                ) : (
                                  <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-warm flex items-center justify-center text-white font-bold text-2xl">
                                    {funeraria.name.charAt(0)}
                                  </div>
                                )}
                                <div className="font-display font-bold text-lg">{funeraria.name}</div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">Valoración</td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4">
                              <span className="text-xl font-bold text-accent">
                                {f.rating ? `${f.rating} ⭐` : "Sin calificación"}
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Dirección
                            </div>
                          </td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4 text-sm">
                              {f.address}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              Teléfono
                            </div>
                          </td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4 text-sm">
                              {f.phone || (
                                <span className="text-muted-foreground italic">No disponible</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-primary" />
                              Email
                            </div>
                          </td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4 text-sm">
                              {f.email || (
                                <span className="text-muted-foreground italic">No disponible</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              Horarios
                            </div>
                          </td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4 text-sm">
                              {f.horarios || (
                                <span className="text-muted-foreground italic">Consultar</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">Descripción</td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-4 px-4 text-sm">
                              <p className="line-clamp-3">
                                {f.description || (
                                  <span className="text-muted-foreground italic">Sin descripción</span>
                                )}
                              </p>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-6 px-4"></td>
                          {comparisonData.map((f) => (
                            <td key={f.id} className="text-center py-6 px-4">
                              <Link to={`/f/${f.slug}`}>
                                <Button size="lg" className="w-full">
                                  Ver Perfil Completo
                                </Button>
                              </Link>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {comparisonData && comparisonData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold">
                  Selecciona funerarias para comparar
                </h3>
                <p className="text-muted-foreground">
                  Haz clic en las tarjetas de arriba para seleccionar hasta 3 funerarias y compararlas lado a lado
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Comparar;
