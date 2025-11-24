import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Search, Plus, Trash2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Comparar = () => {
  const [selectedFunerarias, setSelectedFunerarias] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Comparador de Funerarias</h1>
            <p className="text-lg text-muted-foreground">
              Selecciona hasta 3 funerarias para comparar servicios y características
            </p>
          </div>

          {/* Search and Selection */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar funerarias por nombre o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              {selectedFunerarias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Seleccionadas:</span>
                  {comparisonData?.map((f) => (
                    <Badge key={f.id} variant="secondary" className="gap-2">
                      {f.name}
                      <button
                        onClick={() => toggleFuneraria(f.id)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">Cargando funerarias...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredFunerarias?.map((funeraria) => (
                    <Card
                      key={funeraria.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedFunerarias.includes(funeraria.id)
                          ? "ring-2 ring-primary"
                          : "hover:border-primary"
                      }`}
                      onClick={() => toggleFuneraria(funeraria.id)}
                    >
                      <div className="flex items-start gap-3">
                        {funeraria.logo_url && (
                          <img
                            src={funeraria.logo_url}
                            alt={funeraria.name}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{funeraria.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {funeraria.address}
                          </p>
                          {funeraria.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm font-medium">{funeraria.rating}</span>
                              <span className="text-sm">⭐</span>
                            </div>
                          )}
                        </div>
                        {selectedFunerarias.includes(funeraria.id) ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Comparison Table */}
          {comparisonData && comparisonData.length > 0 && (
            <div className="overflow-x-auto">
              <Card className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold w-48">Característica</th>
                      {comparisonData.map((funeraria) => (
                        <th key={funeraria.id} className="text-center py-4 px-4">
                          <div className="space-y-2">
                            {funeraria.logo_url && (
                              <img
                                src={funeraria.logo_url}
                                alt={funeraria.name}
                                className="w-16 h-16 object-contain mx-auto"
                              />
                            )}
                            <div className="font-bold text-lg">{funeraria.name}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Valoración</td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4">
                          <span className="text-accent font-semibold">
                            {f.rating ? `${f.rating} ⭐` : "N/A"}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Dirección
                      </td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4 text-sm">
                          {f.address}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Teléfono
                      </td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4 text-sm">
                          {f.phone || "No disponible"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4 text-sm">
                          {f.email || "No disponible"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        <Clock className="h-4 w-4 inline mr-2" />
                        Horarios
                      </td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4 text-sm">
                          {f.horarios || "No disponible"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Descripción</td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4 text-sm">
                          {f.description || "No disponible"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4"></td>
                      {comparisonData.map((f) => (
                        <td key={f.id} className="text-center py-4 px-4">
                          <Link to={`/f/${f.slug}`}>
                            <Button className="w-full">Ver Detalles</Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Comparar;
